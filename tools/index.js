"use strict";
const tools = require('express').Router();
const catchError = require('rxjs/operators').catchError;
const ibuki = require('../common/ibuki');
// const of = require('rxjs/observable').of;
const of = require('rxjs').of;
// const mailer = require('./mail/mailer');
const messages = require('../common/messages');

tools.get('/tools', (req, res) => {
    console.log('/tools');
    res.json('tools');
});

tools.get('/tools/mail', (req, res, next) => {
    try {
        // const mailData = {
        //     fromId: '',
        //     senderPwd: '',
        //     to: '',
        //     subject: '',
        //     copyTo: '',
        //     body: '',
        //     html: ''
        // };
        const sub = ibuki.filterOn('mail-response:mailer>tools.index')
            .subscribe(d => {
                sub.unsubscribe();
                res.locals.message = messages.messMailSuccess;
                next();
            }, (error) => {
                res.locals.message = messages.messMailFail
                next(error);
            });
        ibuki.emit('send-mail:tools.index>mailer', {
            req: req, res: res, next: next
        });
    } catch (error) {
        res.locals.message = messages.messMailFail;
        next(error);
    }
})

tools.post('/tools/mail', (req, res, next) => {

})

module.exports = tools;

/*format of rxjs messages
functionality:source file>destination file
ex: 'send-mail:tools.index>tools.mail.mailer
functionality = send-mail
source file = tools.index.js
destination file = tools.mail.mailer
*/