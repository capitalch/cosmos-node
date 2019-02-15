"use strict";
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./common/config.json');
const ibuki = require('./common/ibuki');
const { statusCodes, messages } = require('./common/messages');
const login = require('./common/login');
const logger = require('./common/logger')('system');
const express = require('express');
const app = express();

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

app.post('/', (req, res, next) => {
    res.json({ status: 'ok' });
})

app.get('/contacts/:num', (req, res, next) => {
    const num = req.params['num'];
    let fileName;
    num === 'short' ? fileName = 'contacts40.json' : fileName = 'contacts4000.json'
    const path1 = path.join(__dirname, 'data', fileName);
    res.sendFile(path1);
})

// app.post('/genders1', (req, res, next) => {
//     res.json(
//         [{
//             name: 'Male',
//             value: 'M',
//             id: 'male1'
//         }, {
//             name: 'Female',
//             value: 'F',
//             id: 'female1'
//         }, {
//             name: 'Trans',
//             value: 'T',
//             id: 'trans1'
//         }, {
//             name: 'Alien',
//             value: 'A',
//             id: 'alien1'
//         }]);
// })

app.post('/authenticate', (req, res, next) => {
    login.authenticate(req, res, next);
})

//provide urls in the config file for which you want to do authentication
app.use(config.common.authUrls, login.verify);


app.post('/register', (req, res, next) => {
    login.register(req, res, next);
})

app.get('/authenticate', (req, res, next) => {
    res.json('ok');
})

config.routes.forEach(element => {
    app.use(require(element));
});

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

// middleware for error handling
app.use((err, req, res, next) => {
    res.statusCode ? (res.statusCode === 200) && res.status(500) : res.status(500);
    const errorObject = {
        statusCode: res.statusCode,
        message: err.message || messages.errUnknown,
        context: res.locals.message || ''
    };
    logger.doLog('error', messages.errFail, errorObject);
    if (!res.finished) {
        // Object.assign(err,errorObject)
        // res.json(errorObject);
        res.send(errorObject);
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



