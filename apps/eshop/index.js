"use strict";
// var bodyParser = require('body-parser');
const path = require('path');
const postgres = require('./artifacts/postgres');
let express = require('express');
// let app = express();
// app.use(postgres);

// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
const p = path.join(__dirname, 'public','eshop');
postgres.use(express.static(path.join(__dirname, 'public','eshop')));




postgres.get('/apps/eshop', (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname,'public','eshop','index.html'));
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

module.exports = postgres;