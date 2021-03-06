"use strict";
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./common/config.json');
const ibuki = require('./common/ibuki');
const { statusCodes, messages } = require('./common/messages');
const login = require('./common/login');
const logger = require('./common/logger')('system');
const postgres = require('./common/postgres');
const express = require('express');
const expressip = require('express-ip');
const app = express();
app.use(expressip().getIpInfoMiddleware);
const mailer = require('./tools/mail/mailer');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, Authorization, Content-Length, X-Requested-With, A' +
        'ccess-Control-Allow-Origin,x-access-token');
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
};
app.use(allowCrossDomain);

app.get('/contacts/:num', (req, res, next) => {
    const num = req.params['num'];
    let fileName;
    num === 'short' ? fileName = 'contacts40.json' : fileName = 'contacts4000.json'
    const path1 = path.join(__dirname, 'data', fileName);
    res.sendFile(path1);
})

app.get('/data/:type', (req, res, next) => {
    const type = req.params['type'];
    const typeObj = {
        'india-states': 'india-states.json',
        'india-cities': 'india-cities.json',
        'contacts': 'contacts40.json'
    }
    const fileName = typeObj[type];
    if (fileName) {
        const path1 = path.join(__dirname, 'data', fileName);
        res.sendFile(path1);
    } else {
        res.json({ error: "Error in parameters" })
    }
})

app.post('/email', (req, res, next) => {
    mailer.sendMail({ req, res, next });
})

app.post('/submit', (req, res, next) => {
    res.json(req.body);
})

config.routes.forEach(element => {
    app.use(require(element));
});

app.post('/authenticate', (req, res, next) => {
    login.authenticate(req, res, next);
})

app.post('/register', (req, res, next) => {
    login.register(req, res, next);
})

app.get('/authenticate', (req, res, next) => {
    res.json('ok');
})

process.on('uncaughtException', function (err) {
    const errorObject = {
        htmlStatusCode: err.status || 500,
        status: 'fail',
        error: err.message || err
    };
    logger.doLog('error', messages.errUncaught, errorObject);
    console.log(errorObject);
});

const server = app.listen(process.env.PORT || config.common.port, () => {
    const socketHelper = ibuki.get('socketHelper');
    socketHelper && socketHelper.init(server);
    console.log(messages.messServerRunningAtPort);
});

app.listen(443);

// middleware for error handling
app.use((err, req, res, next) => {
    // res.statusCode ? (res.statusCode === 200) && res.status(500) : res.status(500);
    const errorObject = {
        statusCode: statusCodes.internalServerError,
        message: err.message || messages.errUnknown,
        context: res.locals.message || ''
    };
    logger.doLog('error', messages.errFail, errorObject);
    if (!res.finished) {
        res.status(statusCodes.internalServerError).json(errorObject);
    }
});

// middleware for not found / success
app.use((req, res, next) => {
    const status = res.locals.status;
    let url, tempObject;
    (status)
        ? (
            tempObject = {
                statusCode: statusCodes.ok,
                method: req.method,
                message: res.locals.message
            },
            logger.doLog('info', messages.messSuccess, tempObject),
            res.status(statusCodes.ok).json(tempObject)
        )
        : (
            url = req.protocol.concat('://', req.hostname, req.url),
            tempObject = {
                statusCode: statusCodes.notFound,
                url: url,
                method: req.method
            },
            logger.doLog('info', messages.messNotFound, tempObject),
            res.status(statusCodes.notFound).json(tempObject)
        );
});



