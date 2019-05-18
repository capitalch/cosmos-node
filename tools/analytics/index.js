"use strict";
const analytics = require('express').Router();
const postgres = require('../common/postgres');

analytics.get('/tools/analytics/hitcount',(req,res,next)=>{
    res.end('ip address hit count')
})

module.exports = analytics;