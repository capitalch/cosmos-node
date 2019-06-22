"use strict";
const nodemailer = require('nodemailer');
// const logger = require('../../common/logger')('tools');
const settings = require('./settings.json');
const {messages} = require('../../common/messages');

const mailer = {};
function getTransporter(mailData) {
    const buff = new Buffer(mailData.password || settings.default.password, 'base64');
    const transporter = nodemailer.createTransport({
        service: mailData.service || settings.default.service,
        auth: {
            user: mailData.from || settings.default.from,
            pass: buff.toString('ascii')
        }
    });
    return (transporter);
}

mailer.sendMail = (data) => {
    const mailData = data.req.body;
    const transporter = getTransporter(mailData);
    const mailOptions = {
        from: settings.default.from,
        to: mailData.to || settings.default.to,
        subject: mailData.subject || settings.default.subject,
        text:  (mailData.text) || settings.default.text
    }

    transporter.sendMail(mailOptions, function (error, info) {
        // const to = mailData.to;
        if (error) {
            data.res.locals.message = messages.errMailFail;
            data.next(error);
        } else {
            data.res.locals.status = 'ok';
            data.res.status(200);
            data.res.locals.message = messages.messMailSuccess(mailOptions.to);
            // data.next();
            data.res.end(messages.messMailSuccess(mailOptions.to))
        }
    });
}

module.exports = mailer;

//deprecated