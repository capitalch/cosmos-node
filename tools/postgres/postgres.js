"use strict";
const pg = require('pg');
// const format = require('pg-format');
const messages = require('../../common/messages');
const logger = require('../../common/logger')('system');
const { Pool } = require('pg');
const sql = require('./sql');
const config = require('../../common/config.json');
const postgres = {};

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

function getParameterizedQuery(context, queryObject) {
    try {
        const matchet = {
            counter: 1,
            getParam: () => '$'.concat(matchet.counter++),
            result: {
                query: '',
                values: []
            }
        };
        let paramName;
        queryObject && Object.keys(queryObject).forEach(x => {
            paramName = matchet.getParam();
            matchet.result.values.push(paramName);
            result.query = result.query.split(':'.concat(x)).join(paramName)
        });
        return (matchet.result);
    } catch (error) {
        context.res.locals.message = messages.errQueryFormation;
        context.next(error.message);
    }
}

const pool = new Pool(config['system:postgres']);
/*
context is an array of [req,res,next]. 
quesryObject schema is 
{
    query:'sql command', 
    params: parameters object
}
if query starts with id like query is id:get:items this is treated as id of sql otherwise it is treated as sql command
*/
postgres.exec = (context, queryObject) => {
    const isId = queryObject.query.startsWith('id');
    isId && (queryObject.query = sql[queryObject.query])

    pool.query(getParameterizedQuery(context,queryObject))
        .then(r => {
            context[1].json(r.rows);
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