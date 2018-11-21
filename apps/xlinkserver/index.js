"use strict";
let router = require('./artifacts/router');

let express = require('express');
let app = express();
app.use(router);
module.exports = router;
