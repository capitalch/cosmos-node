// "use strict";
const express = require('express');
const {messages} = require('../../common/messages');
const logger = require('../../common/logger')('tear');
const ibuki = require('../../common/ibuki');
const compression = require('compression');
const mustache = require('mustache');
const path = require('path');
const tear = express.Router();
const sqlScripts = require('./sql');
const config = require('../../common/config.json');

tear.use(compression());
tear.use(express.static(path.join(__dirname,'public')));
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
            logger.doLog('error', err.message, err);
            ibuki.emit('error:any>handler', err);
            // console.log(err);
        } else {
            logger.doLog('info', messages.messTearDatabaseConnected);
            console.log('tear database connected');
        }
    }
)

tear.get('/apps/tear', (req, res) => {
    res.sendfile(path.join(__dirname, 'public', 'tear.html'));
})

tear.get('/apps/tear/api/reportA', (req, res) => {
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
                logger.doLog('info', messages.messTearApiQuery);
                res.json(result.recordsets);
            })
            .catch(function (err) {
                ibuki.emit('error:any>handler', err);
                console.log(err);
            });
    };
    doRequest();
});

module.exports = tear;