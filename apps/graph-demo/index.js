"use strict";
const path = require('path');
// const router = require('./router');
let express = require('express');
const router1 = express.Router();
let app = express();
app.use(router1);
router1.use(express.static(path.join(__dirname, '/public/graph')));



router1.get('/', (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, '/public/graph', '/index.html'));
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

router1.get(['/api/graph/:id','/:id'], (req, res,next) => {
    const page = req.params.id;
    const file = path.join(__dirname, 'data', page.concat('.json'));
    try {
        // res.sendFile(file);
        setTimeout(() => {
            res.sendFile(file);
        }, 0);
    } catch (error) {
        res.status('404').send('Data not found');
    }
});

router1.put(['/api/graph/put-timeout-test','/put-timeout-test'], function (req, res) {
    res.header("Content-Type", 'application/json');
    setTimeout(() => {
        res.send({ ok: true });
    }, 120000);
});

router1.post(['/api/graph/post-timeout-test', '/post-timeout-test'], function (req, res) {
    res.header("Content-Type", 'application/json');
    setTimeout(() => {
        res.send({ ok: true });
    }, 120000);
});

router1.put(['/api/graph/empty-check', '/empty-check'], function (req, res) {
    // res.header("Content-Type", 'application/json');
    // console.log("success");
    setTimeout(() => {
        res.send();
    }, 100);
});

router1.post(['/api/graph/empty-check', '/empty-check'], function (req, res) {
    // res.header("Content-Type", 'application/json');
    // console.log("success");
    setTimeout(() => {
        res.send();
    }, 100);
});

router1.delete(['/api/graph/empty-check', '/empty-check'], function (req, res) {
    // res.header("Content-Type", 'application/json');
    // console.log("success");
    setTimeout(() => {
        res.send();
    }, 100);
});


router1.put(['/api/graph/relapses', '/relapses', '/api/graph/cds', '/cds'], function (req, res) {
    // console.log("success");
    setTimeout(() => {
        res.send();
    }, 100);
});

router1.post(['/api/graph/relapses', '/relapses', '/api/graph/cds', '/cds' ], function (req, res) {
    // console.log("success");
    setTimeout(() => {
        res.send();
    }, 100);
});

router1.delete(['/api/graph/relapses', '/relapses'], function (req, res) {
    setTimeout(() => {
        res.send();
    }, 100);
});

module.exports = router1;