"use strict";
// const pg = require('pg');
const messages = require('./messages');
const logger = require('./logger')('postgres');
const { Pool } = require('pg');
const sql = require('./sql');
const config = require('./config.json');
const postgres = {};

function getParameterizedQuery(context, queryObject) {
    try {
        let counter = 1;
        const getParam = () => '$'.concat(counter++);
        const result = {};
        let paramName; result.text = queryObject.text; result.values = [];
        (result.text.indexOf(':') >= 0) &&
            queryObject && Object.keys(queryObject.values).forEach(x => {
                paramName = getParam();
                result.values.push(queryObject.values[x]);
                result.text = result.text.split(':'.concat(x)).join(paramName)
            });
        return (result);
    } catch (error) {
        context.res.locals.message = messages.errQueryFormation;
        context.next(error.message);
    }
}
let dbConfig = config['system:postgres'];
const poolObject = {};
poolObject[dbConfig.database] = new Pool(dbConfig);
/*
context schema is {req:{},res:{},next:{}}
queryObject schema is 
{
    database: databaseName
    text:'sql command or id of sql command starting with id:xxxx', 
    values: parameters object
}
if text starts with id like query is id:get:items this is treated as id of sql otherwise it is treated as sql command
*/
postgres.exec = async (context, queryObject, type) => {
    try {
        type = type || 'get';
        type = type.toLowerCase();
        const database = queryObject.database || dbConfig.database;
        dbConfig.database = database;
        poolObject[database] || (poolObject[database] = new Pool(dbConfig));
        const pool = poolObject[database];
        const isId = queryObject.text.startsWith('id');
        isId && (queryObject.text = sql[queryObject.text])
        const pzQueryObject = getParameterizedQuery(context, queryObject);

        const r = await pool.query(pzQueryObject);
        if (type === 'get') {
            context.res.json(r.rows);
        } else if (type === 'use') {
            return (r);
        } else {
            // context.res.status(200).json({ result: 'success' });
        }
    } catch (error) {
        context.res.locals.message = messages.errBeforeQueryFormation;
        context.next(error.message);
    }
}
module.exports = postgres;

//deprecated
//
// const dbConfig = {
//     user: config.user, // name of the user account
//     database: config.database, // name of the database
//     password: config.password,
//     port: config.dbPort,
//     max: 10, // max number of clients in the pool
//     idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
// };


// pool.query(pzQueryObject)
//     .then(r => {
//         context.res.json(r.rows);
//         logger.doLog('info', messages.messQueryExecuted, { database: dbConfig.database, text: queryObject.text });
//     })
//     .catch(e => {
//         context.res.locals.message = messages.errQueryFalied(dbConfig.database)
//         context.next(e.message);
//     });
// try {

// } catch (e) {
//     context.res.locals.message = messages.errQueryFalied(dbConfig.database)
//     context.next(e.message);
// }
