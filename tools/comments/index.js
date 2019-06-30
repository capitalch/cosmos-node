'use strict';
const comments = require('express').Router();
const postgres = require('../../common/postgres');
const jwt = require('jsonwebtoken');
const util = require('../../common/util');
const { messages } = require('../../common/messages');
const config = require('../../common/config.json');

comments.get('/tools/comments/:site/:page', async (req, res, next) => {
    try {
        const site = req.params.site;
        const page = req.params.page;
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        token || util.throw(messages.errNoToken);
        const decoded = await jwt.verify(token, config.jwt.secret);
        if (decoded && (decoded.site !== site)) {
            util.throw(messages.errInvalidToken);
        }
        if (site && page) {
            let ret = await postgres.exec({
                database: 'admin',
                text: 'id:get-comments',
                values: {
                    site: site,
                    page: page
                }
            }, { req, res, next }, false)
            // copied tree making code from internet
            const nest = (items, id = null, link = 'parent_id') =>
                items
                    .filter(item => item[link] === id)
                    .map(item => ({ ...item, children: nest(items, item.id) }))

            const result = (ret.rows && ret.rows.length > 0) ? nest(ret.rows) : []
            res.json(result)
        } else {
            util.throw(messages.errMalformedValues)
        }
    } catch (e) {
        console.log(e);
        next(e);
    }
})

comments.post('/tools/comments/:site', async (req, res, next) => {
    try {
        const site = req.query.site || req.params.site;
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        token || util.throw(messages.errNoToken);
        const decoded = await jwt.verify(token, config.jwt.secret);
        if (decoded && (decoded.site !== site)) {
            util.throw(messages.errInvalidToken);
        }
        if (site) {
            const ret = await postgres.exec({
                // database: 'admin',
                text: 'id:delete-comment',
                values: {
                    commentId: req.body.commentId
                }
            }, { req, res, next }, false);
            res.status(200).json({ status: 'ok' });
        } else {
            util.throw(messages.errMalformedValues)
        }
    } catch (e) {
        console.log(e);
        next(e);
    }
})

comments.post('/tools/comments/:site/:page', async (req, res, next) => {
    try {
        const site = req.params.site;
        const page = req.params.page;
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        token || util.throw(messages.errNoToken);
        const decoded = await jwt.verify(token, config.jwt.secret);
        if (decoded && (decoded.site !== site)) {
            util.throw(messages.errInvalidToken);
        }
        const payload = req.body;
        if (site && page && payload && payload.values) {
            (payload.parent_id === '') && (payload.parent_id = null)
            const values = {
                webSite: site
                , page: page
                , ...payload.values
            }
            const ret = await postgres.execCodeBlock(
                {
                    // database: 'admin',
                    text: payload.text,//'id:new-comment',
                    values: values
                },
                { req, res, next }
            );
            res.status(200).json({ status: 'ok' });
        } else {
            util.throw(messages.errMalformedValues)
        }
    } catch (e) {
        console.log(e);
        next(e);
    }
});

module.exports = comments;

/*deployment
                            1. messages.js : errInvalidToken
                            2. In tools generate-token.js
                            3. The main server.js error handling area
                            4. modify index.js from tools folder
                            5. In tools comments folder and index.js
                            6. sql.js change
                            7. Changes in postgres.js file
*/