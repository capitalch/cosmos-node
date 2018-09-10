"use strict";
const messages = require('./messages');
const ibuki = require('./ibuki');
const handler = {};

ibuki.filterOn('error:any>handler').subscribe(
    d => {
        d.data.res.locals.message = messages.errFail;
        d.data.next(d.data.error || messages.errFail);
    }
)

process.on('uncaughtException', function (err) {
    console.log(err);
});

module.exports = handler;