const express = require('express');
const graph = express.Router();
const path = require('path');


graph.get(['/', '/api'], (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// graph.get(['/api/graph/:id','/:id'], (req, res,next) => {
//     const page = req.params.id;
//     const file = path.join(__dirname, 'data', page.concat('.json'));
//     try {
//         // res.sendFile(file);
//         setTimeout(() => {
//             res.sendFile(file);
//         }, 0);
//     } catch (error) {
//         res.status('404').send('Data not found');
//     }
// });

graph.put(['/api/graph/put-timeout-test','/put-timeout-test'], function (req, res) {
    res.header("Content-Type", 'application/json');
    setTimeout(() => {
        res.send({ ok: true });
    }, 120000);
});

graph.post(['/api/graph/post-timeout-test', '/post-timeout-test'], function (req, res) {
    res.header("Content-Type", 'application/json');
    setTimeout(() => {
        res.send({ ok: true });
    }, 120000);
});

graph.put(['/api/graph/empty-check', '/empty-check'], function (req, res) {
    // res.header("Content-Type", 'application/json');
    // console.log("success");
    setTimeout(() => {
        res.send();
    }, 100);
});

graph.post(['/api/graph/empty-check', '/empty-check'], function (req, res) {
    // res.header("Content-Type", 'application/json');
    // console.log("success");
    setTimeout(() => {
        res.send();
    }, 100);
});

graph.delete(['/api/graph/empty-check', '/empty-check'], function (req, res) {
    // res.header("Content-Type", 'application/json');
    // console.log("success");
    setTimeout(() => {
        res.send();
    }, 100);
});


graph.put(['/api/graph/relapses', '/relapses', '/api/graph/cds', '/cds'], function (req, res) {
    // console.log("success");
    setTimeout(() => {
        res.send();
    }, 100);
});

graph.post(['/api/graph/relapses', '/relapses', '/api/graph/cds', '/cds' ], function (req, res) {
    // console.log("success");
    setTimeout(() => {
        res.send();
    }, 100);
});

graph.delete(['/api/graph/relapses', '/relapses'], function (req, res) {
    setTimeout(() => {
        res.send();
    }, 100);
});

module.exports = graph;