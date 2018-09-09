'use strict';
const winston = require('winston');
const fs = require('fs');
const config = require('./config.json');
const moment = require('moment');

const logging = config.logging;
const runMode = config.common.mode; // 'production', 'development', 'debug'
const tsFormat = () => moment().format(logging.timeFormat).trim();
// logging levels are error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 
// for level = debug i.e 4, the error,warn, info and verbose are written to log file against command logger.error(..), logger.warn(...) and so on.
// Basically messages for <= current level are logged.
const runModeMapping = { development: 'info', production: 'warn', debug: 'debug' }
const level = runModeMapping[runMode];
fs.existsSync(logging.dir) || (fs.mkdirSync(logging.dir));

const format = winston.format.combine(
    winston.format.timestamp(tsFormat),
    winston.format.printf(info => {
        return (`{"t":"${tsFormat()}", "mess":"${info.message}", "context":"${info.context}", "meta": ${info.meta}, "level":"${info.level}"}`)
    })
);

const options = {
    file: {
        level: level,
        filename: './logs/' + moment().format('YYYY-MM-DD') + '.log',
        handleExceptions: true,
        json: true,
        timestamp: tsFormat,
        //   maxsize: 5242880, // 5MB
        // maxsize: 5120,
        // maxFiles: 5,
        colorize: false
    },
    console: {
        level: level,
        handleExceptions: true,
        json: false,
        colorize: true
    }
};

const transports = [new winston.transports.File(options.file)];
transports.push(new winston.transports.Console(options.console));

const logger = winston.createLogger({
    transports: transports
    , format: format
});

//In meta you can keep json
logger.doLog = (level, message, context, meta) => {
    logger.log(
        {
            level: level,
            message: message,
            context: context,
            meta: meta && JSON.stringify(meta)
        }
    );
}

module.exports = logger;