"use strict";
const tools = require('express').Router();
const path = require('path');

const fs = require('fs');
const express = require('express');
const mailer = require('./mail/mailer');
const config = require('../common/config.json');
const postgres = require('../common/postgres');
const analytics = require('./analytics');

tools.get('/tools', (req, res) => {
    console.log('/tools');
    res.json('tools');
});

//Tools/swagger folder is dist folder of swagger-ui project at github. I have replaced all instances of "./" with "/" in the index.html file, otherwise error occurs.
const pathToSwaggerUi = path.join(__dirname, 'swagger');
tools.use(express.static(pathToSwaggerUi));
tools.use(analytics);

tools.get('/tools/doc/:spec', (req, res, next) => {
    const swaggerFilename = req.params.spec;
    const specUrl = config.common.host.concat(config.swagger.fileUrl, '/', swaggerFilename);
    const filePath = path.join(__dirname, 'swagger', 'index.html');
    const file = fs.readFileSync(filePath, "utf8");
    const newFile = file.split('./').join('/').replace('{{$}}', specUrl); // for global replace in string
    res.send(newFile);
})

//this is private
tools.get('/tools/swagger/:spec', (req, res) => {
    const swaggerFilename = req.params.spec;
    const filePath = path.join(__dirname, 'swagger', 'swagger-files', swaggerFilename.concat('.json'));
    res.sendFile(filePath);
})

tools.get('/tools/sql', (req, res, next) => {
    postgres.exec({req, res, next}, { 
        database:'postgres'
        , text: 'id:get-all-contacts-on-table-name'
        , values: { 
            table: 'contacts'
        } });
})

tools.post('/tools/mail', (req, res, next) => {
    mailer.sendMail({
        req: req, res: res, next: next
    })
})

module.exports = tools;

/* Deprecated

*/