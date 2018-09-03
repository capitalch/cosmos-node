"use strict";
const tools = require('express').Router();
const ibuki = require('./artifacts/ibuki');
const mailer = require('./artifacts/mailer');

tools.get('/api/tools', (req, res) => {
    console.log('/api/tools');
    res.json('tools');
});

tools.get('/api/tools/mail', (req, res, next) => {
    try {
        // throw new Error('Test error');
        const sub1 = ibuki.filterOn('mail-response:mailer>tools-index').subscribe(d => {
            // try {
            sub1.unsubscribe();
            res.send("OK");
            // } catch (err) {
            //     next(err);
            // }
            // sub1.unsubscribe();
        })
        // .error(err => {
        //     console.log(err);
        // });
        ibuki.emit('send-mail:tools-index>mailer');
    } catch (error) {
        next(error);
    }
    // mailer.sendMail();
    // res.send('ok');
})

module.exports = tools;