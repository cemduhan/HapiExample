'use strict';

const pg = require('pg');

const pool = new pg.Pool({
  user: 'main',
  host: 'localhost',
  database: 'HapiExample_dev',
  password: 'kuz60TOL12',
  port: 5432
});

pool.on('error', function (err, client) {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports.pool = pool;
