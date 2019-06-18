'use strict';
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

function getPool(queryObject) {
	const dbConfigTemp = Object.assign({}, dbConfig);
	const database = queryObject.database || dbConfig.database;
	dbConfigTemp.database = database;
	poolObject[database] || (poolObject[database] = new Pool(dbConfigTemp));
	const pool = poolObject[database];
	return pool;
}

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
	try {
		if (isFireAndForget === undefined) {
			isFireAndForget = true;
		}
		const pool = getPool(queryObject);
		const isId = queryObject.text.startsWith('id');
		// isId && (queryObject.text = (queryObject.params ? sql[queryObject.text](queryObject.params) : sql[queryObject.text]));
		isId && (queryObject.text = sql[queryObject.text]);
		const pzQueryObject = getParameterizedQuery(context, queryObject);
		//pzQueryObject is an object with text and values property. text is sql with placeholders and values is an array with parameters.
		//pool.query(pzQueryObject) is standard method of pg i.e node-postgres 
		if (isFireAndForget) {
			let r = await pool.query(pzQueryObject);
			responseOnSuccess && (r = responseOnSuccess);
			context.res.status(statusCodes.ok).json(r);
		} else {
			return pool.query(pzQueryObject);
		}
	} catch (error) {
		// context.res.locals.message = messages.errQueryExecution(dbConfigTemp.database);
		context.res.locals.message = error.message;
		context.next(error);
	}
};

/*  execCodeBlock executes the anonymous code blocks. You cannot use standard parameterized queries like pool.exec(someQueryObject)
where someQueryObject has text and values property as per pg i.e node-postgres. The text is standard sql with placeholders
and values is parameters array. The anonymous code blocks in postgres does not entertain patameters. They are written in PL/PG.
You need to use format function or can also use ES6 templates. For that the sql.id returns a function with some parameters
which at run time replaces the ${} constructs using ES6 template string interpolation.
*/
postgres.execCodeBlock = async (queryObject, context) => {
	try {
		const pool = getPool(queryObject);
		const sqlCodeBlock = sql[queryObject.text](queryObject.values);
		const cbQueryObject = { text: sqlCodeBlock, values: [] };
		return pool.query(cbQueryObject);
	} catch (error) {
		// context.res.locals.message = messages.errQueryExecution(dbConfigTemp.database);
		context.res.locals.message = error.message;
		throw(error);
	}
}

module.exports = postgres;
