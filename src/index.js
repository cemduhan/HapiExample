#!/usr/bin/node

'use strict';

const Hapi = require('hapi');
const Hoek = require('hoek');
const fs = require('fs');
const pool = require('src/middleware/db').pool;
const routes = require('src/middleware/route_crawler')('./src/routes');
const process = require('process');

const server = module.exports = new Hapi.Server();

server.connection({
  port: 3000,
  host: 'localhost'
});

server.route(routes);

/* istanbul ignore if  */
if (process.env['NODE_ENV'] !== 'test') {
  server.register([require('vision'), require('inert'), { register: require('lout') }, { register: require('tv'), options: { endpoint: '/tv'} }], function (err) {
    Hoek.assert(!err, err);

    server.start(function (err) {
      Hoek.assert(!err, err);

      console.log('info', 'Server is starting');

      pool.connect(function (err, client, done) {
        client.query('DROP SCHEMA public CASCADE', (err, res) => {
          console.log('info', 'Dropped schema public.');

          client.query('CREATE SCHEMA public', (err, res) => {
            Hoek.assert(!err, err);

            console.log('info', 'Created schema public.');

            const query = fs.readFileSync('src/sql/init.sql').toString();

            client.query(query, (err, res) => {
              Hoek.assert(!err, err);

              console.log('info', 'Server running at: ' + server.info.uri);

              done();
            });
          });
        });
      });
    });
  });
}
