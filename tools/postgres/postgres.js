const pg = require('pg');
const format = require('pg-format');
const messages = require('../../common/messages');
const logger = require('../../common/logger')('system');
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
    // pool.connect()
    //     .then(client => {
            pool.query('SELECT * FROM apidata')
                .then(res => {
                    // client.release();
                    context.res.json(res.rows);
                    logger.doLog('info',messages.messQueryExecuted,null);
                })
                .catch(e => {
                    context.res.locals.message = messages.errQueryFalied(config['system:postgres'].database)
                    context.next(e.message);
                })
        // }).catch(e => {
        //     console.log(e);
        // });
}
module.exports = postgres;