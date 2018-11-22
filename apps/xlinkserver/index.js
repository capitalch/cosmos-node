"use strict";
const router = require('./artifacts/router');
const ibuki = require('../../common/ibuki');
const socketHelper = require('./artifacts/socketHelper');

let express = require('express');
let app = express();
app.use(router);
ibuki.set('socketHelper',socketHelper);
module.exports = router;
