"use strict";
const express = require('express');
// const compression = require('compression');
const capital = express.Router();
const server1 = require('./dist1/server');
// capital.get('/api/capital', (req, res) => {
//     res.json("ok");
// })

module.exports = capital;