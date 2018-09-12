"use strict";
const tools = require('express').Router();
const ibuki = require('../common/ibuki');
const messages = require('../common/messages');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/petstore.json');

var options = {
    swaggerUrl: 'http://localhost:3000/tools/swagger'
};

var docName = "";

tools.use('/tools/doc/:id', swaggerUi.serve);
tools.use('/tools/doc/:id', (req, res, next) => {
    docName = req.params.id;
    next();
},
    swaggerUi.setup(null, options))

tools.get('/tools/swagger', (req, res) => {
    const filePath = __dirname.concat('/swagger/', docName.concat('.json')); //'swagger/petstore.json');
    res.sendFile(filePath);
});

tools.get('/tools', (req, res) => {
    console.log('/tools');
    res.json('tools');
});

tools.get('/tools/mail', (req, res, next) => {
    try {
        const sub = ibuki.filterOn('mail-response:mailer>tools.index')
            .subscribe(d => {
                sub.unsubscribe();
                res.locals.message = messages.messMailSuccess;
                next();
            }, (error) => {
                res.locals.message = messages.errMailFail
                next(error);
            });
        ibuki.emit('send-mail:tools.index>mailer', {
            req: req, res: res, next: next
        });
    } catch (error) {
        res.locals.message = messages.errMailFail;
        next(error);
    }
})

tools.post('/tools/mail', (req, res, next) => {
    try {
        const sub = ibuki.filterOn('mail-response:mailer>tools.index')
            .subscribe(d => {
                sub.unsubscribe();
                res.locals.message = messages.messMailSuccess;
                next();
            }, (error) => {
                res.locals.message = messages.errMailFail
                next(error);
            });
        ibuki.emit('send-mail:tools.index>mailer', {
            req: req, res: res, next: next
        });
    } catch (error) {
        res.locals.message = messages.errMailFail;
        next(error);
    }
})

// tools.get('/tools/docs', (req, res, next) => {

// })

module.exports = tools;

/* Deprecated
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