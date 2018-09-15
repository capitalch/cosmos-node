const pg = require('pg');
const format = require('pg-format');
const { Pool } = require('pg');
const sql = require('./sql');
const config = require('../../common/config.json');
const postgres = {};
// const dbConfig = {
//     user: config.user, // name of the user account
//     database: config.database, // name of the database
//     password: config.password,
//     port: config.dbPort,
//     max: 10, // max number of clients in the pool
//     idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
// };
const pool = new Pool(config['system:postgres']);
postgres.exec = (context, sql) => {
    pool.connect()
        .then(client => {
            return client.query('SELECT * FROM apidata1')
                .then(res => {
                    client.release();
                    context.res.json(res.rows);
                })
                .catch(e => {
                    client.release();
                    context.next(e);
                })
        })
}
module.exports = postgres;