const jwt = require('jsonwebtoken');
const config = require('../../common/config.json');
const util = require('../../common/util');
const { messages, statusCodes } = require('../../common/messages');
const generateToken = require('express').Router();

generateToken.get('/tools/generate-token/:site', (req, res, next) => {
    const site = req.params.site;
    const dirt = req.query.dirt;
    let token;
    try {
        if (dirt === config.jwt.secret) {
            token = jwt.sign(
                {
                    site: site
                }, config.jwt.secret, {
                    
                }
            )
            res.json({ token: token });
        } else {
            util.throw(messages.errNoDirt)
        }
    } catch (e) {
        console.log(e);
        next(e);
    }
})

module.exports = generateToken;

/*
token = jwt.sign(
    {
        userName: userName,
        jRule: jRule
    }, config.jwt.secret, {
        expiresIn: '1h'
    }

*/