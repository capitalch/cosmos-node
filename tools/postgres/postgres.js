"use strict";
// const pg = require('pg');
const messages = require('../../common/messages');
const logger = require('../../common/logger')('postgres');
const { Pool } = require('pg');
const sql = require('./sql');
const config = require('../../common/config.json');
const postgres = {};

function getParameterizedQuery(context, queryObject) {
    try {
        let counter = 1;
        const getParam = () => '$'.concat(counter++);
        const result = {};
        let paramName; result.text = queryObject.query; result.values = [];
        queryObject && Object.keys(queryObject.params).forEach(x => {
            paramName = getParam();
            result.values.push(queryObject.params[x]);
            result.text = result.text.split(':'.concat(x)).join(paramName)
        });
        return (result);
    } catch (error) {
        context.res.locals.message = messages.errQueryFormation;
        context.next(error.message);
    }
}
const dbConfig = config['system:postgres'];
const pool = new Pool(dbConfig);
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
    isId && (queryObject.text = sql[queryObject.text])
    const pzQueryObject = getParameterizedQuery(context, queryObject);
    pool.query(pzQueryObject)
        .then(r => {
            context.res.json(r.rows);
            logger.doLog('info', messages.messQueryExecuted, { database: dbConfig.database, text: queryObject.text });
        })
        .catch(e => {
            context.res.locals.message = messages.errQueryFalied(dbConfig.database)
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