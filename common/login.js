"use strict";
const login = {};
const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const util = require('./util');
const config = require('./config.json');
const { messages, statusCodes } = require('./messages');
const postgres = require('./postgres');

login.verifyToken = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        token || util.throw(messages.errNoToken);
        const decoded = await jwt.verify(token, config.jwt.secret);
        req.decoded = decoded;
        next();
    } catch (error) {
        res.locals.message = messages.errAuthentication;
        res.status(statusCodes.unAuthorized);
        next(error);
    }
}

login.authenticate = async (req, res, next) => {
    try {
        const auth = req.body.auth;
        const decrypted = crypto.AES.decrypt(auth, 'Secret Passphrase').toString(crypto.enc.Utf8);
        const authArray = decrypted.split(':');
        let userName, pwd, dbPassword, jInfo, jRule, weight;
        authArray && Array.isArray(authArray)
            && (authArray.length === 2) && (userName = authArray[0], pwd = authArray[1]);

        let ret = await postgres.exec(
            { text: 'id:get-password', values: { userName: userName } }
            , { req, res, next }, false);
        ret || util.throw(messages.errQuery);

        Array.isArray(ret.rows) && (
            dbPassword = ret.rows[0]['password']
            , jRule = ret.rows[0]['jRule']
            , jInfo = ret.rows[0]['jInfo']
            , weight = ret.rows[0]['weight']
        );
        const result = await bcrypt.compare(pwd, dbPassword);
        let token;
        result ?
            (token = jwt.sign(
                {
                    userName: userName,
                    jRule: jRule
                }, config.jwt.secret, {
                    expiresIn: '1h'
                }
            ),
                res.json({ "token": token, "jInfo": jInfo, "weight": weight })
            )
            : util.throw(messages.errUserNameOrPasswordNotFound)
    }
    catch (error) {
        res.locals.message = messages.errAuthentication;
        res.status(statusCodes.unAuthorized);
        next(error);
    }
};

login.register = async (req, res, next) => {
    try {
        const auth = req.body.auth;
        const decrypted = crypto.AES.decrypt(auth, 'Secret Passphrase').toString(crypto.enc.Utf8);
        const authArray = decrypted.split(':');
        let userName, pwd;
        authArray && Array.isArray(authArray)
            && (authArray.length === 2) && (userName = authArray[0], pwd = authArray[1]);

        if ((!userName) || (!pwd)) {
            util.throw(messages.errUserNameOrPasswordNotFound);
        }
        const saltRounds = 10;
        const hash = await bcrypt.hash(pwd, saltRounds);
        hash && postgres.exec(
            {
                text: 'id:register-user'
                , values: { userName: userName, password: hash }
            }, { req, res, next }, true, { message: messages.messSuccess });

    } catch (error) {
        res.locals.message = messages.errRegisterUserPwd;
        res.status(statusCodes.badRequest);
        next(error);
    }
}

module.exports = login;