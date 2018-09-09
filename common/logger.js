'use strict';
const winston = require('winston');
const stackTrace = require('stack-trace');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const config = require('./config.json');
const moment = require('moment');

const logging = config.logging;
const runMode = config.common.mode;
const tsFormat = () => moment().format(logging.timeFormat).trim();
// logging levels are error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 
// for level = debug i.e 4, the error,warn, info and verbose are written to log file against command logger.error(..), logger.warn(...) and so on.
// Basically messages for <= current level are logged.
const runModeMapping = { development: 'info', production: 'warn', debug: 'debug' }
const level = runModeMapping[runMode];

let moduleName = 'general';

const format = winston.format.combine(
    winston.format.timestamp(tsFormat),
    winston.format.printf(info => {
        return (`{"t":"${tsFormat()}", "message":"${info.message}", "file":"${info.file}", "line":"${info.line}", "method":"${info.method}" "meta": ${info.meta}, "level":"${info.level}"},`)
    })
);

const constructor = (_moduleName) => {
    _moduleName && (moduleName = _moduleName);
    fs.existsSync(logging.dir) || (fs.mkdirSync(logging.dir));
    const moduleDir = logging.dir.concat('/', moduleName);
    fs.existsSync(moduleDir) || (fs.mkdirSync(moduleDir));
    return (getLogger());
};

function getLogger() {
    const fileOption = () => {
        const fileName = path.join('.', logging.dir, moduleName, moment().format('YYYY-MM-DD').concat('.log'));
        const file = {
            level: level,
            filename: fileName,
            handleExceptions: true,
            json: true,
            timestamp: tsFormat,
            //   maxsize: 5242880, // 5MB
            // maxsize: 5120,
            // maxFiles: 5,
            colorize: false
        };
        return (file);
    };

    const transports = [new winston.transports.File(fileOption())];
    const logger = winston.createLogger({
        transports: transports
        , format: format
    });

    logger.doLog = (level, message, meta) => {
        const trace = stackTrace.get()[1];
        logger.log(
            {
                level: level,
                message: message,
                file: path.basename(trace.getFileName()),
                line: trace.getLineNumber(),
                method: trace.getMethodName(),
                meta: meta && JSON.stringify(meta)
            }
        );
    }
    return (logger);
}

module.exports = constructor;