"use strict";
const config = require('./common/config.json');
const messages = require('./common/messages');
const handler = require('./common/handler');
const mailer = require('./tools/mail/mailer');
const logger = require('./common/logger')('general');
// const logger1 = require('./common/logger')('myModule');
const express = require('express');
const app = express();

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', ' GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

config.routes.forEach((element) => {
    // const apiRoot = config.api['root'];
    // app.use(require(apiRoot.concat('/', element)));
    app.use(require(element));
});

const server = app.listen(process.env.PORT || config.common.port, () => {
    console.log(messages.messServerRunningAtPort);
});

// logger.debug({ message: 'Chisel system started....', context: 'startup'});
// logger.doLog('info', 'tets', 'push');
// logger1.doLog('info', 'tests', 'sush');

// middleware for error handling
app.use((err, req, res, next) => {
    const errorObject = {
        htmlStatusCode: err.status || 500,
        status: 'fail',
        message: res.locals.message || err.message,
        error: { message: err.message }
    }
    logger.doLog('error', messages.messFail, errorObject);
    if (!res.finished) {
        res.status(err.status || 500);
        res.json(errorObject);
    }
});

// middleware for success
app.use((req, res, next) => {
    const successObject = {
        htmlStatusCode: 200,
        status: 'success',
        message: res.locals.message || messages.messSuccess
    };
    logger.doLog('info', messages.messSuccess, successObject);
    res.status(200).json(successObject);
})



