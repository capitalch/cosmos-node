"use strict";
var express = require('express');
var fs = require('fs');
// var http = require('http');
var router = express.Router();
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var util = require('util');
var def = require('./definitions');
var messages = require('./messages');

router.get('/api/test', (req, res, next) => {
    try {
        res.json({
            'status': 'ok'
        });
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

router.post('/genders1', (req, res, next) => {
    res.json(
        [{
            name: 'Male',
            value: 'M',
            id: 'male1'
        }, {
            name: 'Female',
            value: 'F',
            id: 'female1'
        }, {
            name: 'Trans',
            value: 'T',
            id: 'trans1'
        }, {
            name: 'Alien',
            value: 'A',
            id: 'alien1'
        }]);
})

router.post('/food1', (req, res, next) => {
    res.json(
        [{
            name: 'Main course',
            value: false,
            id: 'main2'
        }, {
            name: 'Desert',
            value: true,
            id: 'desert2'
        }, {
            name: 'beverages',
            value: false,
            id: 'beverages2'
        }, {
            name: 'Marwari food',
            value: false,
            id: 'marvari2'
        }]
    )
})

router.post('/countries', (req, res, next) => {
    try {
        res.json([{
            name: "---select country---",
            value: ""
        }, {
            name: "India",
            value: "in"
        }, {
            name: "USA",
            value: "us"
        }, {
            name: "Japan",
            value: "jp"
        }, {
            name: "SriLanka",
            value: "sl"
        }]);
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

router.post('/states', (req, res, next) => {
    try {
        res.json([{
            name: "---select states---",
            value: ""
        }, {
            name: "Assam",
            value: "as"
        }, {
            name: "Karnataka",
            value: "ka"
        }, {
            name: "Gujrat",
            value: "gu"
        }, {
            name: "West Bengal",
            value: "wb"
        }]);
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

router.post('/form', (req, res, next) => {
    try {
        // res.json({email1:true});
        console.log(req.body);
        res.json(req.body);
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
})

router.post('/email', (req, res, next) => {
    try {
        // res.json({email1:true});
        res.json(null);
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
})

router.post('/group', (req, res, next) => {
    try {
        // res.json({email1:true});
        res.json({
            groupAsyncValidator1: false
        });
        // res.json(null);
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
})
module.exports = router;