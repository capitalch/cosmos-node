"use strict";
let express = require('express');
let fs = require('fs');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let router = express.Router();
let userInfo = require('./userInfo');
// let config = JSON.parse(fs.readFileSync('../config.json', 'utf8'));
let config = require('../config.json');
let userValidation = require('./userValidation');
let def = require('./definitions');
let messages = require('./messages');
let routerHelper = require('./routerHelper');

router.get('/api/xlinkserver/test', (req, res, next) => {
    res.json({ status: 'success' });
})

router.post('/api/validate/user', (req, res, next) => {
    try {
        let uid,
            uidPwdHash1,
            result = {},
            userObject,
            token,
            auth,
            pwd,
            isValid = false;
        let f_auth = () => {
            auth = req.body.auth;
            return (auth)
        };

        let credentials = () => {
            let temp1 = new Buffer(auth, 'base64')
            temp1 = temp1.toString();

            let temp2 = temp1.split(':');
            uid = temp2[0];
            uidPwdHash1 = temp2[1];
            let ret = Boolean(uid) && Boolean(uidPwdHash1);
            return (ret);
        };
        let isUserExists = () => {
            pwd = userValidation.getPwd(uid);
            return (Boolean(pwd));
        };
        let validate = () => {
            let uidPwd = uid.concat(':', pwd);

            let hash = crypto.createHash('sha256');
            let uidPwdUpdate = hash.update(uidPwd, 'utf-8');
            let uidPwdHash2 = uidPwdUpdate.digest('hex');
            if (uidPwdHash1 === uidPwdHash2) {
                console.log('Pwd verified');
                token = jwt.sign(uid, config.key);
                isValid = true;
            }
            return (token);
        };
        f_auth() && credentials() && isUserExists() && validate();
        let ret = {
            isValid: isValid,
            token: token
        };
        res.json(ret);
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

router.use(function (req, res, next) {
    // implementation for token verification
    var token = userValidation.getToken(req); // req.body.token || req.query.token || req.headers['x-access-token'];
    try {
        if (token) {
            jwt
                .verify(token, config.key, function (error, decoded) {
                    if (error) {
                        let err = new def.NError(400, messages.errInvalidToken, error.message);
                        next(err);
                    } else {
                        req.uid = decoded;
                        next();
                    }
                });
        } else { //no token provided
            let err = new def.NError(400, messages.errNoTokenProvided, messages.messProvideToken);
            next(err);
        }
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

router.post('/api/info', (req, res, next) => {
    //to get clientInfo information look for key='clientInfo' in the body
    try
    {
        let proceed = () => {
            routerHelper.getInfo(req, res, next);
        };
        let showError = () => {
            let error = new def.NError(500, messages.errReqParams, messages.errType);
            next(error);
        };
        req.body && req.body.key
            ? proceed()
            : showError();

    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

/*
For web request options={type:'web',url:'webUrl',method:'get/post',json:true/false}
Fpr sql query options={type:'sql', sqlKey:'sqlKey',args:{name value pairs for sql args}}
sql query will only be available for post
*/
router.post('/api/tunnel', (req, res, next) => {
    try
    {
        let options;
        let proceed = () => {
            if (req.body.type == 'web') {
                options = {
                    url: req.body.url,
                    method: req.body.method || 'GET',
                    json: req.body.json || false
                }
            } else if (req.body.type == 'sql') {
                let args = {};
                req.body.args && (args = req.body.args);
                options = {
                    sqlKey: req.body.sqlKey,
                    args: args,
                    dbName: req.body.dbName,
                    type: 'sql'
                }
            }
            console.log('Tunnel request received from user');
            routerHelper.executeReq(req, res, options);
        };
        let showError = () => {
            let error = new def.NError(500, messages.errReqParams, messages.errType);
            next(error);
        };
        req.body && req.body.type
            ? proceed()
            : showError();

    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

/*
For get calls options is not required. Query parameters are used instead.
*/
router.get('/api/tunnel', (req, res, next) => {
    try
    {
        let url = req.query && req.query.url;
        let method = (req.query && req.query.method) || 'GET';
        let json = (req.query && req.query.json) || false;
        let type = (req.query && req.query.type) || 'web';
        if (url && method) {
            let options = {
                url: url,
                method: method,
                json: json,
                type: type
            }
            routerHelper.executeReq(req, res, options);
        } else {
            res
                .status(404)
                .json({error: messages.errReqParams});
        }
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

router.post('/api/tunnel/static', (req, res, next) => {
    try
    {    
        let sqlKey = req.body.sqlKey;  
        res.header("Content-Type",'application/json');
        switch(sqlKey)
        {
            case "tunnel:get:business:health":
                res.send(getData('data/health.json'));
                break;
            case "tunnel:get:todays:sale":
                res.send(getData('data/sales.json'));
                break;
            case "tunnel:get:sale:details:product":
                res.send(getData('data/detailed-sales.json'));
                break;
            case "tunnel:get:sale:details1":
                res.send(getData('data/sale-details-1.json'));
                break;
            case "tunnel:get:sale:details2":
                res.send(getData('data/sale-details-2.json'));
                break;
            case "tunnel:get:orders":
                res.send(getData('data/orders.json'));
                break;
            case "tunnel:get:order:details":
                res.send(getData('data/order-details.json'));
                break;
            case "tunnel:get:cheque:payments":
                res.send(getData('data/cheque-payments.json'));
                break;
            case "tunnel:get:cash:payments":
                res.send(getData('data/cash-payments.json'));
                break;
            case "tunnel:get:debit:credit:notes":
                res.send(getData('data/debit-credit-notes.json'));
                break;
            case "tunnel:get:banks":
                res.send(getData('data/banks.json'));
                break;
            case "tunnel:get:bank:recon:details":
                res.send(getData('data/bank-details.json'));
                break;
            case "tunnel:get:jakar:on:days":
                res.send(getData('data/jakar.json'));
                break;
        }          
        res.end();
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

var getData = function (file){
    let obj = JSON.parse(fs.readFileSync(file, 'utf8'));
    let output = JSON.stringify(obj,null,4);
    return output;
}

module.exports = router;