"use strict";
const messages = require('./messages');
const ibuki = require('./ibuki');
const handler = {};

ibuki.filterOn('error:any>handler').subscribe(
    d => {
        d.data.res.locals.message = messages.messFail;
        d.data.next(d.data.error || messages.messFail);
    }
)

process.on('uncaughtException', function (err) {
    console.log(err);
});

module.exports = handler;