'use strict';

const Hoek = require('hoek');
const Boom = require('boom');
const pool = require('src/middleware/db').pool;

module.exports = {
  index(request, reply) {
    pool.connect((err, client, done) => {
      Hoek.assert(!err, err);

      if (request.query.name) {
        client.query(`
          SELECT *
          FROM restaurants
            WHERE name ILIKE $1::text
          ORDER BY id
          LIMIT $2::int
          OFFSET $3::int`,
          [`%${request.query.name}%`, request.query.limit, request.query.offset], (err, res) => {
            Hoek.assert(!err, err);

            reply(res.rows);

            done();
          });
      } else {
        client.query(`
          SELECT *
          FROM restaurants
          ORDER BY id
          LIMIT $1::int
          OFFSET $2::int
          `,
          [request.query.limit, request.query.offset], (err, res) => {
          Hoek.assert(!err, err);

          reply(res.rows);

          done();
        });
      }
    });
  },

  show(request, reply) {
    pool.connect((err, client, done) => {
      Hoek.assert(!err, err);

      client.query('SELECT * FROM restaurants WHERE id = $1::int',
        [encodeURIComponent(request.params.id)], (err, res) => {
          Hoek.assert(!err, err);

          if (res.rowCount === 1) {
            reply(res.rows[0]);
          } else {
            reply(Boom.notFound());
          }

          done();
        });
    });
  },

  create(request, reply) {
    pool.connect((err, client, done) => {
      Hoek.assert(!err, err);

      const restaurant = request.payload.restaurant;

      client.query('INSERT INTO restaurants (name) VALUES ($1::text) RETURNING *',
        [restaurant.name], (err, res) => {
          Hoek.assert(!err, err);

          Hoek.assert(res.rowCount === 1, 'Row count is not equal to 1.');

          reply(res.rows[0]).code(201);

          done();
        });
    });
  },

  update(request, reply) {
    pool.connect((err, client, done) => {
      Hoek.assert(!err, err);

      const restaurant = request.payload.restaurant;

      client.query('UPDATE restaurants SET name = $1::text WHERE id = $2::int RETURNING *',
        [restaurant.name, encodeURIComponent(request.params.id)], (err, res) => {
          Hoek.assert(!err, err);

          if (res.rowCount === 1) {
            reply(res.rows[0]).code(200);
          } else {
            reply(Boom.notFound());
          }

          done();
        });
    });
  },

  delete(request, reply) {
    pool.connect((err, client, done) => {
      Hoek.assert(!err, err);

      client.query('DELETE FROM restaurants WHERE id = $1::int',
        [encodeURIComponent(request.params.id)], (err, res) => {
          Hoek.assert(!err, err);

          if (res.rowCount === 1) {
            reply('').code(204);
          } else {
            reply(Boom.notFound());
          }

          done();
        });
    });
  }
};
