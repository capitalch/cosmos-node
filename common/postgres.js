'use strict';
// const pg = require('pg');
const { messages, statusCodes } = require('./messages');
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
		let paramName;
		result.text = queryObject.text;
		result.values = [];
		result.text.indexOf(':') >= 0 &&
			queryObject &&
			Object.keys(queryObject.values).forEach((x) => {
				paramName = getParam();
				result.values.push(queryObject.values[x]);
				result.text = result.text.split(':'.concat(x)).join(paramName);
			});
		return result;
	} catch (error) {
		context.res.locals.message = messages.errQueryFormation;
		context.next(error);
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
postgres.exec = async (queryObject, context, isFireAndForget, responseOnSuccess) => {
	const dbConfigTemp = Object.assign({}, dbConfig);
	const database = queryObject.database || dbConfig.database;
	dbConfigTemp.database = database;
	try {
		if (isFireAndForget === undefined) {
			isFireAndForget = true;
		}
		poolObject[database] || (poolObject[database] = new Pool(dbConfigTemp));
		const pool = poolObject[database];
		const isId = queryObject.text.startsWith('id');
		isId && (queryObject.text = sql[queryObject.text]);
		const pzQueryObject = getParameterizedQuery(context, queryObject);

		if (isFireAndForget) {
			let r = await pool.query(pzQueryObject);
			responseOnSuccess && (r = responseOnSuccess);
			context.res.status(statusCodes.ok).json(r);
		} else {
			return pool.query(pzQueryObject);
		}
	} catch (error) {
		context.res.locals.message = messages.errQueryExecution(dbConfigTemp.database);
		context.next(error);
	}
};
module.exports = postgres;
