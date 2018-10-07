"use strict";
const {messages} = require('./messages');
const logger = require('./logger')('system');
const ibuki = require('./ibuki');
const handler = {};

// ibuki.filterOn('error:any>handler').subscribe(
//     d => {
//         d.data.next(d.data.error || messages.errFail);
//     }
// )

// process.on('uncaughtException', function (err) {
//     logger.doLog('error', err.message, { message1: messages.errUncaught, message2: messages.messShutDown });
//     console.log(err);
// });

module.exports = handler;