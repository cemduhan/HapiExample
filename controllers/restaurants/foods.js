'use strict';

const Hoek = require('hoek');
const Boom = require('boom');
const pool = require('middleware/db').pool;

module.exports = {
  index(request, reply) {
    pool.connect((err, client, done) => {
      Hoek.assert(!err, err);

      client.query('SELECT * FROM foods WHERE restaurant_id = $1::int ORDER BY id',
        [encodeURIComponent(request.params.restaurant_id)], (err, res) => {
          Hoek.assert(!err, err);

          reply(res.rows);

          done();
        });
    });
  },

  show(request, reply) {
    pool.connect((err, client, done) => {
      Hoek.assert(!err, err);

      client.query('SELECT * FROM foods WHERE restaurant_id = $1::int AND id = $2::int',
        [encodeURIComponent(request.params.restaurant_id),
          encodeURIComponent(request.params.id)], (err, res) => {
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

      const food = request.payload.food;

      client.query(`
        INSERT INTO foods (name, restaurant_id)
          VALUES ($1::text, $2::int)
        RETURNING *`,
        [food.name, encodeURIComponent(request.params['restaurant_id'])], (err, res) => {
        //  Check whether insertion violates foreign key constraint
          if (err && err.code === '23503') {
            reply(Boom.notFound('Restaurant with given identifier not found.'));

            done();
          } else {
            Hoek.assert(res.rowCount === 1, 'Row count is not equal to 1.');

            reply(res.rows[0]).code(201);

            done();
          }
        });
    });
  },

  update(request, reply) {
    pool.connect((err, client, done) => {
      Hoek.assert(!err, err);

      const food = request.payload.food;

      client.query(`
        UPDATE foods
        SET name = $1::text, restaurant_id = $2::int
          WHERE restaurant_id = $3::int AND id = $4::int
        RETURNING *`,
        [food.name,
          food.restaurant_id,
          encodeURIComponent(request.params.restaurant_id),
          encodeURIComponent(request.params.id)], (err, res) => {
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

      client.query(`
      DELETE FROM foods
        WHERE restaurant_id = $1::int AND id = $2::int`,
        [encodeURIComponent(request.params.restaurant_id),
          encodeURIComponent(request.params.id)], (err, res) => {
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
