"use strict";
const tools = require('express').Router();
const path = require('path');

const fs = require('fs');
const express = require('express');
const mailer = require('./mail/mailer');
const ibuki = require('../common/ibuki');
const messages = require('../common/messages');
const config = require('../common/config.json');
const postgres = require('./postgres/postgres');

// tools.use(bodyParser);
// tools.use(bodyParser.urlencoded({ extended: false }))
// tools.use(bodyParser.json())

tools.get('/tools', (req, res) => {
    console.log('/tools');
    res.json('tools');
});

//Tools/swagger folder is dist folder of swagger-ui project at github. I have replaced all instances of "./" with "/" in the index.html file, otherwise error occurs.
const pathToSwaggerUi = path.join(__dirname, 'swagger');
tools.use(express.static(pathToSwaggerUi));

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
    postgres.exec({ req: req, res: res, next: next }, '');
})

tools.post('/tools/mail', (req, res, next) => {
    mailer.sendMail({
        req: req, res: res, next: next
    })
    // try {
    //     const sub = ibuki.filterOn('mail-response:mailer>tools.index')
    //         .subscribe(d => {
    //             sub.unsubscribe();
    //             res.locals.message = messages.messMailSuccess;
    //             next();
    //         }, (error) => {
    //             res.locals.message = messages.errMailFail
    //             next(error);
    //         });
    //     ibuki.emit('send-mail:tools.index>mailer', {
    //         req: req, res: res, next: next
    //     });
    // } catch (error) {
    //     res.locals.message = messages.errMailFail;
    //     next(error);
    // }
})

module.exports = tools;

/* Deprecated

// tools.get('/tools/mail', (req, res, next) => {
//     try {
//         const sub = ibuki.filterOn('mail-response:mailer>tools.index')
//             .subscribe(d => {
//                 sub.unsubscribe();
//                 res.locals.message = messages.messMailSuccess;
//                 next();
//             }, (error) => {
//                 res.locals.message = messages.errMailFail
//                 next(error);
//             });
//         ibuki.emit('send-mail:tools.index>mailer', {
//             req: req, res: res, next: next
//         });
//     } catch (error) {
//         res.locals.message = messages.errMailFail;
//         next(error);
//     }
// })

// tools.use(express.static(path.join(__dirname, 'swagger')));
// tools.use(bodyParser.json()); // for parsing application/json
// tools.use(bodyParser.urlencoded({ extended: true }));

// const options = {
//     swaggerUrl: 'http://localhost:3000/tools/swagger'
// };

// let swaggerFileName = "";

// tools.use(config.swagger.apiUrl.concat('/:id'), swaggerUi.serve);
// tools.use(config.swagger.apiUrl.concat('/:id'), (req, res, next) => {
//     swaggerFileName = req.params.id;
//     next();
// })

// tools.get(config.swagger.apiUrl.concat('/:id'), swaggerUi.setup(null, options))

// tools.get(config.swagger.fileUrl, (req, res) => {
//     const fName = res.locals.swaggerFileName;
//     const filePath = path.join(__dirname, 'swagger', swaggerFileName.concat('.json'));
//     res.sendFile(filePath);
// });

const catchError = require('rxjs/operators').catchError;
const of = require('rxjs/observable').of;
*/
/*format of rxjs messages
functionality:source file>destination file
ex: 'send-mail:tools.index>tools.mail.mailer
functionality = send-mail
source file = tools.index.js
destination file = tools.mail.mailer
*/