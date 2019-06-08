'use strict';
const comments = require('express').Router();
const postgres = require('../../common/postgres');
const jwt = require('jsonwebtoken');
const util = require('../../common/util');
const { messages, statusCodes } = require('../../common/messages');
const config = require('../../common/config.json');

comments.get(['/tools/comments', '/tools/comments/:site/:page'], async (req, res, next) => {
    try {
        const site = req.query.site || req.params.site;
        const page = req.query.page || req.params.page;
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        token || util.throw(messages.errNoToken);
        const decoded = await jwt.verify(token, config.jwt.secret);
        if (decoded && (decoded.site !== site)) {
            util.throw(messages.errInvalidToken);
        }

        if (site) {
            // const myName = 'sushantagrawal.com';
            const ret = await postgres.execCodeBlock(
                {
                    database: 'admin',
                    text: 'id:new-comment',
                    values: {
                        webSite: 'sushantagrawal.com'
                        , page: 'blog1'
                        , mname: 'Anshuman'
                        , email: 'ans@gmail.com'
                        , visitorSite: 'www.abc.com'
                        , comment: {
                            text: 'superb',
                            replies: ['abc', 'def']
                        }
                    }
                },
                { req, res, next },
                false
            );
        }
        res.status(200).json({status:'ok'});
    } catch (e) {
        console.log(e);
        next(e);
    }
});

module.exports = comments;

/*deployment
1. messages.js : errInvalidToken
2. In tools generate-token.js
*/