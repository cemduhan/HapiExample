'use strict';

const expect = require('chai').expect;
const server = require('src/index');
const pool = require('src/middleware/db').pool;
const Hoek = require('hoek');

let restaurants = null;

describe('restaurants', function () {
  before(function (pass) {
    pool.connect((err, client, done) => {
      Hoek.assert(!err, err);

      client.query(`
        DELETE FROM restaurants
        `, (err, res) => {
          Hoek.assert(!err, err);

          done();
          pass();
        });
    });
  });

  beforeEach(function (pass) {
    pool.connect((err, client, done) => {
      Hoek.assert(!err, err);

      client.query(`
        INSERT INTO restaurants (name)
        VALUES ($1), ($2)
        RETURNING *
        `, ['Burger King', 'McDonalds'], (err, res) => {
          Hoek.assert(!err, err);

          restaurants = res.rows;

          done();
          pass();
        });
    });
  });

  afterEach(function (pass) {
    pool.connect((err, client, done) => {
      Hoek.assert(!err, err);

      client.query(`
        DELETE FROM restaurants
        `, (err, res) => {
          Hoek.assert(!err, err);

          restaurants = null;

          done();
          pass();
        });
    });
  });

  it('should return an array of all restaurants', function (pass) {
    server.inject({
      method: 'GET',
      url: '/restaurants/'
    }, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.be.an.instanceOf(Array);
      //expect(res.result).to.have.length(3);

      res.result.forEach(element => {
        expect(element).to.be.an('object');
        expect(element).to.have.all.keys('id', 'name', 'inserted_at');
        expect(element.id).to.be.a('number');
        expect(element.name).to.be.a('string');
      });

      pass();
    });
  });

  it('should show a restaurant with given id', function (pass) {
    server.inject({
      method: 'GET',
      url: `/restaurants/${restaurants[0].id}/`
    }, function (res) {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.be.an('object');
      expect(res.result).to.have.all.keys('id', 'name', 'inserted_at');

      expect(res.result.id).to.be.a('number');
      expect(res.result.name).to.be.a('string');

      expect(res.result.id).to.equal(restaurants[0].id);
      expect(res.result.name).to.equal(restaurants[0].name);

      pass();
    });
  });

  it('should throw 404 if restaurant with given id does not exist', function (pass) {
    server.inject({
      method: 'GET',
      url: `/restaurants/${restaurants[1].id + 1}/`
    }, function (res) {
      expect(res.statusCode).to.equal(404);

      pass();
    });
  });

  it('should throw 400 if given id is not integer', function (pass) {
    server.inject({
      method: 'GET',
      url: '/restaurants/not-an-integer/'
    }, function (res) {
      expect(res.statusCode).to.equal(400);

      pass();
    });
  });

  it('should create a restaurant with given name', function (pass) {
    server.inject({
      method: 'POST',
      url: '/restaurants/',
      payload: JSON.stringify({ restaurant: { name: 'McDonalds' }})
    }, function (res) {
      expect(res.statusCode).to.equal(201);
      expect(res.result).to.be.an('object');
      expect(res.result).to.have.all.keys('id', 'name', 'inserted_at');

      expect(res.result.id).to.be.a('number');
      expect(res.result.name).to.be.a('string');

      expect(res.result.name).to.equal('McDonalds');

      pass();
    });
  });

  it('should update a restaurant with given id', function (pass) {
    server.inject({
      method: 'PUT',
      url: `/restaurants/${restaurants[0].id}/`,
      payload: JSON.stringify({ restaurant: { name: 'UpdatedMcDonalds' }})
    }, function (res) {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.be.an('object');
      expect(res.result).to.have.all.keys('id', 'name', 'inserted_at');

      expect(res.result.id).to.be.a('number');
      expect(res.result.name).to.be.a('string');

      expect(res.result.name).to.equal('UpdatedMcDonalds');
      expect(res.result.id).to.equal(restaurants[0].id);

      pass();
    });
  });

  it('should throw 404 on update if restaurant does not exist with given id', function (pass) {
    server.inject({
      method: 'PUT',
      url: `/restaurants/${restaurants[1].id + 1}/`,
      payload: JSON.stringify({ restaurant: { name: 'UpdatedMcDonalds' }})
    }, function (res) {
      expect(res.result.statusCode).to.equal(404);

      pass();
    });
  });

  it('should delete a restaurant with given id', function (pass) {
    server.inject({
      method: 'DELETE',
      url: `/restaurants/${restaurants[0].id}/`
    }, function (res) {
      expect(res.statusCode).to.equal(204);

      pass();
    });
  });

  it('should throw 404 on delete if restaurant does not exist with given id', function (pass) {
    server.inject({
      method: 'DELETE',
      url: `/restaurants/${restaurants[1].id + 1}/`
    }, function (res) {
      expect(res.result.statusCode).to.equal(404);

      pass();
    });
  });
});
