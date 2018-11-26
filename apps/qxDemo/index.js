"use strict";
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./artifacts/router');
let express = require('express');
let app = express();
app.use(router);
const config = require('./config.json');
app.use(express.static(path.join(__dirname, '/public/neuroshare-questionnaire')));
// app.use(express.static(path.join(__dirname, '/public/neuroshare-questionnaire')));
// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/qx', (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, '/public/neuroshare-questionnaire', '/index.html'));
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

module.exports = router;



// var path = require('path');
// const config = require('./config.json');
// const bodyParser = require('body-parser');
// const router = require('./artifacts/router');
// var express = require('express');
// var app = express();

// app.use(express.static(path.join(__dirname, '/public/neuroshare-questionnaire')));
// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// var allowCrossDomain = function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.header('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, Authorization, Content-Length, X-Requested-With, A' +
//         'ccess-Control-Allow-Origin,x-access-token');
//     if ('OPTIONS' == req.method) {
//         res.sendStatus(200);
//     } else {
//         next();
//     }
// };
// app.use(allowCrossDomain);

// app.get('/qx', (req, res, next) => {
//     try {
//         res.sendFile(path.join(__dirname, '/public/neuroshare-questionnaire', '/index.html'));
//     } catch (error) {
//         let err = new def.NError(500, messages.errInternalServerError, error.message);
//         next(err);
//     }
// });
// app.use(router);

// var server = app.listen(process.env.PORT || config.port, function () {
//     console.log('server running', ' at port: ', config.port);
// });
