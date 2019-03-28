"use strict";
const express = require('express');
const path = require('path');
const rxForms2 = express.Router();

rxForms2.use(express.static(path.join(__dirname, 'build')));

rxForms2.get('/apps/rx', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

module.exports = rxForms2;