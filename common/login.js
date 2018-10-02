"use strict";
const login = {};
const crypto = require('crypto-js');
const messages = require('./messages');
const postgres = require('./postgres');
const bcrypt = require('bcrypt');

function createToken() {
    return ('my token');
}

login.authenticate = async (req, res, next) => {
    try {
        const auth = req.body.auth;
        const decrypted = crypto.AES.decrypt(auth, 'Secret Passphrase').toString(crypto.enc.Utf8);
        const authArray = decrypted.split(':');
        let userName, pwd, dbPassword, jinfo;
        authArray && Array.isArray(authArray)
            && (authArray.length === 2) && (userName = authArray[0], pwd = authArray[1]);

        let ret = await postgres.exec(
            { text: 'id:get-password', values: { username: userName } }
            , { req, res, next }, false);
        if (ret) {
            Array.isArray(ret.rows) && (
                dbPassword = ret.rows[0]['password']
                , jinfo = ret.rows[0]['jinfo']
            );

            bcrypt.compare(pwd, dbPassword, function (err, result) {
                if (err) {
                    res.locals.message = messages.errAuthentication;
                    next(err);
                } else {
                    result
                        ? res.json({ token: createToken() })
                        : (res.locals.message = messages.errAuthentication,
                            next(err))
                }
            });
        };
    }
    catch (error) {
        res.locals.message = messages.errAuthentication;
        next(error);
    }
    // res.json('ok');
};

login.register = (req, res, next) => {
    const auth = req.body.auth;
    const decrypted = crypto.AES.decrypt(auth, 'Secret Passphrase').toString(crypto.enc.Utf8);
    const authArray = decrypted.split(':');
    let userName, pwd;
    authArray && Array.isArray(authArray)
        && (authArray.length === 2) && (userName = authArray[0], pwd = authArray[1]);

    const saltRounds = 10;
    const doRegister = () => bcrypt.hash(pwd, saltRounds, function (err, hash) {
        err ? ((res.locals.message = err.message), next(err)) :
            postgres.exec(
                {
                    text: 'id:register-user'
                    , values: { username: userName, password: hash }
                }, { req, res, next }, true);
    });

    (userName && pwd)
        ? doRegister()
        : (res.locals.message = messages.errUserNameOrPasswordNotFound, next(new Error()));
}

module.exports = login;