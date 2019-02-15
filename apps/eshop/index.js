"use strict";
// var bodyParser = require('body-parser');
const path = require('path');
const postgres = require('./artifacts/postgres');
let express = require('express');
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