'use strict';
const comments = require('express').Router();
const postgres = require('../../common/postgres');

comments.get(['/tools/comments', '/tools/comments/:site/:page'], async (req, res, next) => {
    try {
        const site = req.query.site || req.params.site;
        const page = req.query.page || req.params.page;
        if (site) {
            const myName = 'sushantagrawal.com';
            const ret = await postgres.exec(
                {
                    database: 'admin',
                    text: 'id:new-comment',
                    values: {},
                    functionParams: 'sushantagrawal.com'
                },
                { req, res, next },
                false
            );
        }
        res.json({ status: 'success' });
    } catch (e) {
        console.log(e);
    }
});

module.exports = comments;