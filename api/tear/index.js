"use strict";
const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
const compression = require('compression');
const mustache = require('mustache');
const path = require('path');
const tear = express.Router();
const sqlScripts = require('./sql');

tear.use(compression());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.json({ type: 'application/vnd.api+json' }));



const p = path.join(__dirname, 'public');
tear.use(express.static(path.join(__dirname, 'public')));

var sql = require('mssql');
let dbconfig = {
    user: 'netwovensa',
    password: 'Reallongpass1',
    server: 'zye0dz8stg.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
    database: 'TimeDB',
    port: 1433,
    options: {
        encrypt: true
    },
    "pool": {
        "max": 30,
        "min": 0,
        "idleTimeoutMillis": 30000
    }
}
const pool = new sql.ConnectionPool(dbconfig);
pool.connect(
    err => {
        if (err) {
            console.log(err);
        } else{
            console.log('database connected');
        }
    }
)

tear.get('/api/tear', (req, res) => {
    res.sendFile(p.concat('/','tear.html'));
})

tear.get('/api/tear/reportA', (req, res) => {
    let dateFrom = req.query.dateFrom || '2018-08-01';
    let dateTo = req.query.dateTo || '2018-08-30';
    let sqlString = sqlScripts.hours;
    sqlString = mustache.render(sqlString, {
        dateFrom: dateFrom,
        dateTo: dateTo
    });
    let doRequest = () => {
        const request = new sql.Request(pool);
        request.multiple = true;
        request
            .query(sqlString)
            .then(function (result) {
                res.json(result.recordsets);
            })
            .catch(function (err) {
                console.log(err);
            });
    };
    doRequest();
});

module.exports = tear;