"use strict";
const tools = require('express').Router();
const ibuki = require('../common/ibuki');
// const mailer = require('./artifacts/mailer');

tools.get('/tools', (req, res) => {
    console.log('/tools');
    res.json('tools');
});

tools.get('/tools/mail', (req, res, next) => {
    try {
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
        ibuki.emit('send-mail:tools.index>tools.mail.mailer');
    } catch (error) {
        next(error);
    }
    // mailer.sendMail();
    // res.send('ok');
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