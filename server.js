"use strict";
const config = require('./common/config.json');
const messages = require('./common/messages');
const express = require('express');
const app = express();

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', ' GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

config['api-routes'].forEach(element => {
    const apiRoot = config['api-root'];
    app.use(require(apiRoot.concat('/',element)));
});

const server = app.listen(process.env.PORT || config.port, () => {
    console.log(messages.messServerRunningAtPort);
});