"use strict";
const login = {};
const crypto = require('crypto-js');
const postgres = require('./postgres');
const bcrypt = require('bcrypt');

login.authenticate = (req, res, next) => {
    const auth = req.body.auth;
    const decrypted = crypto.AES.decrypt(auth, 'Secret Passphrase').toString(crypto.enc.Utf8);
    const authArray = decrypted.split(':');
    let userName, pwd;
    authArray && Array.isArray(authArray)
        && (authArray.length === 2) && (userName = authArray[0], pwd = authArray[1]);

    postgres.exec({req,res,next},{text:'id:get-password', values:{username:userName}})

    bcrypt.compare(myPlaintextPassword, hash, function (err, res) {
        // res == true
    });

    res.json('ok');
};

login.register = (req, res, next) => {
    const auth = req.body.auth;
    const decrypted = crypto.AES.decrypt(auth, 'Secret Passphrase').toString(crypto.enc.Utf8);
    const authArray = decrypted.split(':');
    let userName, pwd;
    authArray && Array.isArray(authArray)
        && (authArray.length === 2) && (userName = authArray[0], pwd = authArray[1]);

    const saltRounds = 10;
    bcrypt.hash(pwd, saltRounds, function (err, hash) {
        postgres.exec({ req, res, next }
            , {
                text: 'id:register-user'
                , values: { username: userName, password: hash }
            }, 'post');
    });
}

module.exports = login;