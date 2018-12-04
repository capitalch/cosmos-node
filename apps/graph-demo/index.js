"use strict";
const path = require('path');
// const router = require('./router');
let express = require('express');
const router = express.Router();
let app = express();
app.use(router);
router.use(express.static(path.join(__dirname, '/public/graph')));



router.get('/apps/graph', (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, '/public/graph', '/index.html'));
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

router.get(['/api/graph/:id','/:id'], (req, res,next) => {
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

router.put(['/api/graph/put-timeout-test','/put-timeout-test'], function (req, res) {
    res.header("Content-Type", 'application/json');
    setTimeout(() => {
        res.send({ ok: true });
    }, 120000);
});

router.post(['/api/graph/post-timeout-test', '/post-timeout-test'], function (req, res) {
    res.header("Content-Type", 'application/json');
    setTimeout(() => {
        res.send({ ok: true });
    }, 120000);
});

router.put(['/api/graph/empty-check', '/empty-check'], function (req, res) {
    // res.header("Content-Type", 'application/json');
    // console.log("success");
    setTimeout(() => {
        res.send();
    }, 100);
});

router.post(['/api/graph/empty-check', '/empty-check'], function (req, res) {
    // res.header("Content-Type", 'application/json');
    // console.log("success");
    setTimeout(() => {
        res.send();
    }, 100);
});

router.delete(['/api/graph/empty-check', '/empty-check'], function (req, res) {
    // res.header("Content-Type", 'application/json');
    // console.log("success");
    setTimeout(() => {
        res.send();
    }, 100);
});


router.put(['/api/graph/relapses', '/relapses', '/api/graph/cds', '/cds'], function (req, res) {
    // console.log("success");
    setTimeout(() => {
        res.send();
    }, 100);
});

router.post(['/api/graph/relapses', '/relapses', '/api/graph/cds', '/cds' ], function (req, res) {
    // console.log("success");
    setTimeout(() => {
        res.send();
    }, 100);
});

router.delete(['/api/graph/relapses', '/relapses'], function (req, res) {
    setTimeout(() => {
        res.send();
    }, 100);
});

module.exports = router;