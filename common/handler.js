"use strict";
const handler = {};

// const domain = require('domain');
// handler.domainError = domain.create();

process.on('uncaughtException', function (err) {
    console.log(err);
});

// handler.domainError.on('error', function (err) {
//     console.log('domain error');
// });


module.exports = handler;