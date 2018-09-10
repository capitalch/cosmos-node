"use strict";
const tools = require('express').Router();
const ibuki = require('../common/ibuki');
const messages = require('../common/messages');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/petstore.json');

const options = {
    swaggerUrl: 'http://localhost:3000/tools/swagger'
};

tools.use('/tools/doc', swaggerUi.serve);
tools.use('/tools/doc', swaggerUi.setup(null, options))

// tools.get('/tools/doc', (req, res) => {
//     const options = {
//         swaggerUrl: 'http://localhost:3000/tools/swagger'
//     }
//     // return (swaggerUi.setup(swaggerDocument));
//     return (swaggerUi.setup(null, options));
//     // res.render(f);
// });

tools.get('/tools/swagger', (req, res) => {
    console.log('/tools/swagger');
    const path = __dirname.concat('/', 'swagger/petstore.json');
    res.sendFile(path);
    // res.json('tools');
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