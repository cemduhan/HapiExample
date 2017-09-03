'use strict'

const expect = require('chai').expect;
const server = require('src/index');
const pool = require('src/middleware/db').pool;
const Hoek = require('hoek');

let restaurants = null;
let foods = null;

describe('foods', function() {
  before(function (pass) {
    pool.connect((err, client, done) => {
      Hoek.assert(!err, err);

      client.query(`
        INSERT INTO restaurants (name)
        VALUES ($1)
        RETURNING *
        `, ['Sivas Köftecisi'], (err, res) => {
          Hoek.assert(!err, err);

          restaurants = res.rows;

          done();
          pass();
        });
    });
  });

  beforeEach(function (pass) {
    pool.connect((err, client, done) => {
      Hoek.assert(!err, err);

      client.query(`
        INSERT INTO foods (name, restaurant_id)
        VALUES ($1, ${restaurants[0].id}), ($2, ${restaurants[0].id})
        RETURNING *
        `, ['Sivas Köftesi', 'Karışık Köfte'], (err, res) => {
          Hoek.assert(!err, err);
          foods = res.rows;

          done();
          pass();
        });
    });
  });

  afterEach(function (pass) {
    pool.connect((err, client, done) => {
      Hoek.assert(!err, err);

      client.query(`
        DELETE FROM foods
        `, (err, res) => {
          Hoek.assert(!err, err);

          foods = null;

          done();
          pass();
        });
    });
  });

  after(function (pass) {
    pool.connect((err, client, done) => {
      Hoek.assert(!err, err);

      client.query(`
        DELETE FROM restaurants
        `, (err, res) => {
          restaurants = null;

          done();
          pass();
        });
    });
  });

  it('should return an array of all foods', function (pass) {
    server.inject({
      method: 'GET',
      url: `/restaurants/${restaurants[0].id}/foods/`
    }, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.be.an.instanceOf(Array);
      expect(res.result).to.have.length(2);

      res.result.forEach(element => {
        expect(element).to.be.an('object');
        expect(element).to.have.all.keys('id', 'name', 'restaurant_id', 'inserted_at');
        expect(element.id).to.be.a('number');
        expect(element.restaurant_id).to.be.a('number');
        expect(element.name).to.be.a('string');
      });

      pass();
    });
  });

  it('should show a food with given id', function (pass) {
    server.inject({
      method: 'GET',
      url: `/restaurants/${restaurants[0].id}/foods/${foods[0].id}/`
    }, function (res) {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.be.an('object');
      expect(res.result).to.have.all.keys('id', 'name', 'restaurant_id', 'inserted_at');

      expect(res.result.id).to.be.a('number');
      expect(res.result.restaurant_id).to.be.a('number');
      expect(res.result.name).to.be.a('string');

      expect(res.result.id).to.equal(foods[0].id);
      expect(res.result.name).to.equal(foods[0].name);
      expect(res.result.restaurant_id).to.equal(restaurants[0].id);

      pass();
    });
  });

  it('should throw 404 if restaurant with given id does not exist', function (pass) {
    server.inject({
      method: 'GET',
      url: `/restaurants/${restaurants[0].id}/foods/${foods[1].id +1}/`
    }, function (res) {
      expect(res.statusCode).to.equal(404);

      pass();
    });
  });

  it('should throw 400 if given id is not integer', function (pass) {
    server.inject({
      method: 'GET',
      url: `/restaurants/${restaurants[0].id}/foods/not-an-integer/`
    }, function (res) {
      expect(res.statusCode).to.equal(400);

      pass();
    });
  });

  it('should create a food with given name', function (pass) {
    server.inject({
      method: 'POST',
      url: `/restaurants/${restaurants[0].id}/foods/`,
      payload: JSON.stringify({ food: { name: 'Big Mac' }})
    }, function (res) {
      expect(res.statusCode).to.equal(201);
      expect(res.result).to.be.an('object');
      expect(res.result).to.have.all.keys('id', 'name', 'restaurant_id', 'inserted_at');

      expect(res.result.id).to.be.a('number');
      expect(res.result.name).to.be.a('string');
      expect(res.result.restaurant_id).to.be.a('number');

      expect(res.result.name).to.equal('Big Mac');

      pass();
    });
  });

  it('should create a food with given name', function (pass) {
    server.inject({
      method: 'POST',
      url: `/restaurants/${restaurants[0].id + 13}/foods/`,
      payload: JSON.stringify({ food: { name: 'Big Mac' }})
    }, function (res) {
      expect(res.statusCode).to.equal(404);

      pass();
    });
  });

  it('should update a food with given id', function (pass) {
    server.inject({
      method: 'PUT',
      url: `/restaurants/${restaurants[0].id}/foods/${foods[0].id}/`,
      payload: JSON.stringify({ food: { name: 'Updated Big Mac', restaurant_id: `${restaurants[0].id}` }})
    }, function (res) {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.be.an('object');
      expect(res.result).to.have.all.keys('id', 'name', 'restaurant_id', 'inserted_at');

      expect(res.result.id).to.be.a('number');
      expect(res.result.restaurant_id).to.be.a('number');
      expect(res.result.name).to.be.a('string');

      expect(res.result.name).to.equal('Updated Big Mac');
      expect(res.result.id).to.equal(foods[0].id);

      pass();
    });
  });

  it('should throw 404 on update if food does not exist with given id', function (pass) {
    server.inject({
      method: 'PUT',
      url: `/restaurants/${restaurants[0].id}/foods/${foods[1].id + 13}/`,
      payload: JSON.stringify({ food: { name: 'Updated Big Mac', restaurant_id: `${restaurants[0].id}` }})
    }, function (res) {
      expect(res.result.statusCode).to.equal(404);

      pass();
    });
  });

  it('should delete a food with given id', function (pass) {
    server.inject({
      method: 'DELETE',
      url: `/restaurants/${restaurants[0].id}/foods/${foods[0].id}/`
    }, function (res) {
      expect(res.statusCode).to.equal(204);

      pass();
    });
  });

  it('should throw 404 on delete if restaurant does not exist with given id', function (pass) {
    server.inject({
      method: 'DELETE',
      url: `/restaurants/${restaurants[0].id}/foods/${foods[1].id + 13}/`
    }, function (res) {
      expect(res.result.statusCode).to.equal(404);

      pass();
    });
  });
});
