"use strict";
const nodemailer = require('nodemailer');
const ibuki = require('../../common/ibuki');
const settings = require('./settings.json');

const mailer = {};
const sub1 = ibuki.filterOn('send-mail:tools.index>mailer')
    .subscribe(d => {
        try {
            mailer.sendMail(d);
        } catch (err) {
            d.data.error = err;
            ibuki.emit('error:any>handler', d.data);
        }
    }, error => {
        d.data.error = error;
        ibuki.emit('error:any>handler', d.data);
    });

function getTransporter(mailData){
    const buff = new Buffer(mailData.password || settings.default.password, 'base64');
    const transporter = nodemailer.createTransport({
        service: mailData.service || settings.default.service,
        auth: {
            user: mailData.from,
            pass: buff.toString('ascii')
        }
    });
    return(transporter);
}

mailer.sendMail = (d) => {
    const mailData = d.data.req.body.mailData;
    const transporter = getTransporter(mailData);
    const mailOptions = {
        from: mailData.from || settings.default.from,
        to: mailData.to || settings.default.to,
        subject: mailData.subject || settings.default.subject,
        text: mailData.text || settings.default.text
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            d.data.error = error;
            ibuki.emit('error:any>handler', d.data);
        } else {
            ibuki.emit('mail-response:mailer>tools.index');
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