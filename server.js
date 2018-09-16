"use strict";
// const bodyParser = require('body-parser');
const path = require('path');
const config = require('./common/config.json');
const messages = require('./common/messages');
const handler = require('./common/handler');
const mailer = require('./tools/mail/mailer');
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

Object.keys(config.routers).forEach((key)=>{
    let element = config.routers[key];
    app.use(require(element.rootFolder));
});

const server = app.listen(process.env.PORT || config.common.port, () => {
    console.log(messages.messServerRunningAtPort);
});

// middleware for error handling
app.use((err, req, res, next) => {
    const errorObject = {
        htmlStatusCode: err.status || 500,
        status: 'fail',
        message: res.locals.message || err.message,
        error: { message: err.message }
    }
    logger.doLog('error', messages.errFail, errorObject);
    if (!res.finished) {
        res.status(err.status || 500);
        res.json(errorObject);
    }
});

// middleware for success
// app.use((req, res, next) => {
//     const successObject = {
//         htmlStatusCode: 200,
//         status: 'success',
//         message: res.locals.message || messages.messSuccess
//     };
//     logger.doLog('info', messages.messSuccess, successObject);
//     res.status(200).json(successObject);
// })



