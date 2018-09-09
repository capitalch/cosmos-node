"use strict";
const nodemailer = require('nodemailer');
const ibuki = require('../../common/ibuki');
const settings = require('../settings.json');

const mailer = {};

ibuki.filterOn('send-mail:tools.index>tools.mail.mailer').subscribe(d => {
    mailer.sendMail();
});

const buff = new Buffer(settings.password, 'base64');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: settings.sender,
        pass: buff.toString('ascii')
    }
});

const mailOptions = {
    from: settings.sender,
    to: 'capitalch@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

mailer.sendMail = () => {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        ibuki.emit('mail-response:tools.mail.mailer>tools.index', info);
    });
}

module.exports = mailer;