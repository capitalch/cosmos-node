"use strict";
// const bodyParser = require('body-parser');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./common/config.json');
const messages = require('./common/messages');
const handler = require('./common/handler');
// const mailer = require('./tools/mail/mailer');
const logger = require('./common/logger')('system');
const express = require('express');
const app = express();

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', ' GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// app.use(bodyParser);
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// Object.keys(config.routers).forEach((key)=>{
//     let element = config.routers[key];
//     app.use(require(element.rootFolder));
// });

config.routes.forEach(element => {
    app.use(require(element));
});

process.on('uncaughtException', function (err) {
    logger.doLog('error', messages.errUncaught, err);
    console.log(err);
});

const server = app.listen(process.env.PORT || config.common.port, () => {
    console.log(messages.messServerRunningAtPort);
});

// middleware for error handling
app.use((err, req, res, next) => {
    const errorObject = {
        htmlStatusCode: err.status || 500,
        status: 'fail',
        message: res.locals.message,
        error: err
    };
    logger.doLog('error', messages.errFail, errorObject);
    if (!res.finished) {
        res.status(err.status || 500);
        res.json(errorObject);
    }
});

// middleware for not found / success
app.use((req, res, next) => {
    const status = res.locals.status;
    let x, url, tempObject;
    (status)
        ? (
            tempObject = {
                htmlStatusCode: 200,
                status: 'ok',
                method: req.method,
                message: res.locals.message
            },
            logger.doLog('info', messages.messSuccess, tempObject),
            res.status(200).json(tempObject)
        )
        : (
    url = req.protocol.concat('://', req.hostname, req.url),
    tempObject = {
        htmlStatuscode: 404,
        status: 'not found',
        url: url,
        method: req.method
    },
    logger.doLog('info', messages.messNotFound, tempObject),
    res.status(404).json(tempObject)
);
})



