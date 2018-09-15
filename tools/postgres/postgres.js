const pg = require('pg');
const format = require('pg-format');
const { Pool } = require('pg');
const sql = require('./sql');
const config = require('../../common/config.json');

// const dbConfig = {
//     user: config.user, // name of the user account
//     database: config.database, // name of the database
//     password: config.password,
//     port: config.dbPort,
//     max: 10, // max number of clients in the pool
//     idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
// };
const pool = new Pool(config['system:postgres']);
const postgres = {};
module.exports = postgres;