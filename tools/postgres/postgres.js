"use strict";
const pg = require('pg');
const format = require('pg-format');
const messages = require('../../common/messages');
const logger = require('../../common/logger')('system');
const { Pool } = require('pg');
// const sql = require('./sql');
const config = require('../../common/config.json');
let postgres = {};

function getParameterizedSql(sql, paramObject) {
    const matchet = {
        counter: 1,
        getParam: () => '$'.concat(matchet.counter++),
        result: {
            sql: sql,
            values: []
        }
    };

    paramObject && Object.keys(paramObject).forEach(x => {
        let paramName = matchet.getParam();
        matchet.result.values.push(paramName);
        result.sql = result.sql.split(':'.concat(x)).join(paramName);
    });
    return (matchet.result);
}

const pool = new Pool(config['system:postgres']);

postgres.exec = (context, sql) => {
    sql && (sql = 'SELECT * FROM contacts');
    pool.query(getParameterizedSql(sql))
        .then(res => {
            context.res.json(res.rows);
            logger.doLog('info', messages.messQueryExecuted, null);
        })
        .catch(e => {
            context.res.locals.message = messages.errQueryFalied(config['system:postgres'].database)
            context.next(e.message);
        })
}
module.exports = postgres;
//
// const dbConfig = {
//     user: config.user, // name of the user account
//     database: config.database, // name of the database
//     password: config.password,
//     port: config.dbPort,
//     max: 10, // max number of clients in the pool
//     idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
// };