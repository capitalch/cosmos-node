"use strict";
const handler = {};

process.on('uncaughtException', function (err) {
    console.log(err);
});

module.exports = handler;