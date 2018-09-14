"use strict";
// const bodyParser = require('body-parser');
const path = require('path');
const config = require('./common/config.json');
const messages = require('./common/messages');
const handler = require('./common/handler');
const mailer = require('./tools/mail/mailer');
const logger = require('./common/logger')('mail');
const express = require('express');
const app = express();

// const pathToSwaggerUi = require('swagger-ui-dist').absolutePath();
// app.use(express.static(pathToSwaggerUi));

// const swPath = require('swagger-ui-dist');
// var SwaggerUIBundle = require('swagger-ui-dist').SwaggerUIBundle
// const ui = SwaggerUIBundle({
//     url: "https://petstore.swagger.io/v2/swagger.json",
//     dom_id: '#swagger-ui',
//     presets: [
//       SwaggerUIBundle.presets.apis,
//       SwaggerUIBundle.SwaggerUIStandalonePreset
//     ],
//     layout: "StandaloneLayout"
//   })

// app.use(express.static(path.join(__dirname, 'tools','swagger')));
// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); 

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', ' GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

config.routes.forEach((element) => {
    app.use(require(element));
});

// app.get('/tools/swagger', (req, res, next) => {
//     const filePath = path.join(__dirname,'tools', 'swagger', 'index1.html');
//     res.sendfile(filePath);
// })

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
app.use((req, res, next) => {
    const successObject = {
        htmlStatusCode: 200,
        status: 'success',
        message: res.locals.message || messages.messSuccess
    };
    logger.doLog('info', messages.messSuccess, successObject);
    res.status(200).json(successObject);
})



