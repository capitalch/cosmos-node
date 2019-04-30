"use strict";
const nodemailer = require('nodemailer');
// const logger = require('../../common/logger')('tools');
const ibuki = require('../../common/ibuki');
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
    const senderMail = mailData.senderMail || '';
    const mailOptions = {
        from: mailData.from || settings.default.from,
        to: mailData.to || settings.default.to,
        subject: mailData.subject || settings.default.subject,
        text:  (senderMail && senderMail.concat('\r\n',mailData.text)) || settings.default.text
    }

    transporter.sendMail(mailOptions, function (error, info) {
        // const to = mailData.to;
        if (error) {
            data.res.locals.message = messages.errMailFail;
            data.next(error);
            // ibuki.emit('error:any>handler', data);
        } else {
            data.res.locals.status = 'ok';
            data.res.status(200);
            data.res.locals.message = messages.messMailSuccess(mailOptions.to);
            data.next();
        }
    });
}

module.exports = mailer;

//deprecated

// const handler = require('../../common/handler');
// const catchError = require('rxjs/operators').catchError;
// const of = require('rxjs').of;
// const throwError = require('rxjs').throwError;
// const of = require('rxjs/observable').of;

// const sub1 = ibuki.filterOn('send-mail:tools.index>mailer')
//     .subscribe(d => {
//         try {
//             mailer.sendMail(d);
//         } catch (err) {
//             d.data.error = err;
//             ibuki.emit('error:any>handler', d.data);
//         }
//     }, error => {
//         d.data.error = error;
//         ibuki.emit('error:any>handler', d.data);
//     });