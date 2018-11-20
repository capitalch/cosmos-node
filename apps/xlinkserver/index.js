"use strict";
let fs = require('fs');
// let http = require('http');
let bodyParser = require('body-parser');
// let config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
// let def = require('./artifacts/definitions');
// let messages = require('./artifacts/messages');
// let socketHelper = require('./artifacts/socketHelper');
let router = require('./artifacts/router');

let express = require('express');
let app = express();
// let server = http.createServer(app);
// server.listen(config.port, function () {
//     console.log("Server listening on: %s:%s", config.host, config.port);
//     socketHelper.init(server);
// });

// process.env.NODE_ENV = config.env;
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(router);
module.exports = router;
