'use strict';
const comments = require('express').Router();
const postgres = require('../../common/postgres');

comments.get(['/tools/comments', '/tools/comments/:site/:page'], async (req, res, next) => {
    try {
        const site = req.query.site || req.params.site;
        const page = req.query.page || req.params.page;
        if (site) {
            const myName = 'sushantagrawal.com';
            const ret = await postgres.execCodeBlock(
                {
                    database: 'admin',
                    text: 'id:new-comment',
                    values: {webSite:'sushantagrawal.com1'}
                },
                { req, res, next },
                false
            );
        }
        res.json({ status: 'success' });
    } catch (e) {
        console.log(e);
        next(e);
    }
});

module.exports = comments;