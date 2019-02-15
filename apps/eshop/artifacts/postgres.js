"use strict";
var express = require('express');
var Q = require('q');
var router = express.Router();
const config = require('../config.json');
var def = require('./definitions');
var messages = require('./messages');
var pg = require('pg');
var format = require('pg-format');
var sql = require('./sql');
var mustache = require('mustache');
const { Pool } = require('pg');
let pop = require('./create-mobile-test-data');

const dbConfig = {
  user: config.db.user, // name of the user account
  database: config.db.database, // name of the database
  password: config.db.password,
  port: config.db.port,
  host: config.db.host,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};

const pool = new Pool(dbConfig);

//positional parameters
router.post('/db/sql/generic', (req, res, next) => {
  try {
    let sqlObj = req.body;
    let sqlString = sql[sqlObj.id];
    let params = sqlObj.params;
    sqlString = format.withArray(sqlString, params);
    pool.query(sqlString)
      .then(result => {
        Array.isArray(result) || (result = result.rows);
        res.json(result);
      }
      )
      .catch(
        e => setImmediate(
          () => {
            res.status(e.status || 500);
            res.json({ error: e.message })
          })
      )
  } catch (error) {
    let err = new def.NError(500, messages.errInternalServerError, error.message);
    next(err);
  }
})



router.post('/db/create/mobile/brand', (req, res, next) => {
  try {
    pop.doPopulateBrand(pool);
    res.json({status:'ok'});
  } catch (error) {
    let err = new def.NError(500, messages.errInternalServerError, error.message);
    next(err);
  }
})

//named parameters
router.post('/db/sql/generic1', (req, res, next) => {
  try {
    let sqlObj = req.body;
    let sqlString = sql[sqlObj.id];
    let params = sqlObj.params;
    // sqlString = format.withArray(sqlString, params);

    pool.query(sqlString)
      .then(result => {
        Array.isArray(result) || (result = result.rows);
        res.json(result);
      }
      )
      .catch(
        e => setImmediate(
          () => {
            res.status(e.status || 500);
            res.json({ error: e.message })
          })
      )
  } catch (error) {
    let err = new def.NError(500, messages.errInternalServerError, error.message);
    next(err);
  }
})

router.post('/db/addsubcart', (req, res, next) => {
  try {
    let jsonData = req.body.json;
    let sqlId = req.body.id;
    let fields = Object.keys(jsonData).join();
    let valuesArray = Object.values(jsonData);
    let values = valuesArray.map(x => {
      let quote = typeof x === 'string' ? "'" : '';
      let ret = quote + x + quote;
      return (ret);
    }).join();
    jsonData.tableName = req.body.tableName;
    jsonData.fields = fields;
    jsonData.values = values;
    let sqlString = mustache.render(sql[sqlId], jsonData);
    pool.query(sqlString)
      .then(result => {
        Array.isArray(result) || (result = result.rows);
        res.json(result);
      }
      )
      .catch(
        e => setImmediate(
          () => {
            res.status(e.status || 500);
            res.json({ error: e.message })
          })
      );
  } catch (error) {
    let err = new def.NError(500, messages.errInternalServerError, error.message);
    next(err);
  }
})

router.post('/db/json/insert/generic', (req, res, next) => {
  try {
    let jsonData = req.body.json;
    let tableName = req.body.tableName;
    let idColumnName;
    idColumnName || (idColumnName = 'id');
    let fields = Object.keys(jsonData).join();
    let valuesArray = Object.values(jsonData);
    let values = valuesArray.map(x => {
      let quote = typeof x === 'string' ? '\'' : '';
      let ret = quote + x + quote;
      return (ret);
    }).join();
    let sqlString = `insert into ${tableName} (${fields}) values(${values}) returning ${idColumnName};`

    pool.query(sqlString)
      .then(result => {
        Array.isArray(result) || (result = result.rows);
        res.json(result);
      }
      )
      .catch(
        e => setImmediate(
          () => {
            res.status(e.status || 500);
            res.json({ error: e.message })
          })
      );
  } catch (error) {
    let err = new def.NError(500, messages.errInternalServerError, error.message);
    next(err);
  }
})

router.get('/db/sql/generic', (req, res, next) => {
  try {
    let sqlObj = req.body;
    let sqlString = sql[sqlObj.id];
    let params = sqlObj.params;
    sqlString = format(sqlString, params);
    pool.query(sqlString)
      .then(result => res.json(result.rows))
      .catch(e => setImmediate(() => { throw e }))
  } catch (error) {
    let err = new def.NError(500, messages.errInternalServerError, error.message);
    next(err);
  }
})

router.post('/db/sql/products', (req, res, next) => {
  try {
    let sqlObj = req.body;
    let sqlString = sql[sqlObj.id];
    let params = sqlObj.params;
    sqlString = format(sqlString, params);
    pool.query(sqlString)
      .then(result => res.json({ data: result.rows }))
      .catch(e => setImmediate(() => { throw e }))

  } catch (error) {
    let err = new def.NError(500, messages.errInternalServerError, error.message);
    next(err);
  }
})

router.post('/db/sql/multi', (req, res, next) => {
  try {
    let sqlObj = req.body;
    let sqlString = sql[sqlObj.id];
    let params = sqlObj.params;

    let promises = params.map(x => {
      let promise = pool.query(sqlString, [x]);
      return (promise);
    });
    //Q.allSettled() is used as against to Q.all() or Promise.all() 
    //because it completes even if there are errors in one+ promises 
    Q.allSettled(promises)
      .then(items => {
        let ret = items.map((x, i) => {
          let obj = { cat_id: params[i], products: x.value.rows };
          return (obj)
        });
        res.json(ret);
      });
  } catch (error) {
    let err = new def.NError(500, messages.errInternalServerError, error.message);
    next(err);
  }
})

router.get('/db/test', (req, res, next) => {
  try {
    var config = {
      user: 'postgres', // name of the user account
      database: 'ecomm', // name of the database
      password: 'su$hant123',
      port: 5433,
      max: 10, // max number of clients in the pool
      idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
    }
    var pool = new pg.Pool(config)
    var myClient;
    pool.connect(function (err, client, done) {
      if (err) console.log(err)
      myClient = client;
      var query = format(sql.mock);
      myClient.query(query, function (err, result) {
        if (err) {
          console.log(err);
          res.json({ error: err.message })
        } else {
          console.log(result.rows);
          res.json(result.rows);
        }
      })
    })
  } catch (error) {
    let err = new def.NError(500, messages.errInternalServerError, error.message);
    next(err);
  }
});

module.exports = router;