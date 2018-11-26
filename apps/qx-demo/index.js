"use strict";
const path = require('path');
const router = require('./artifacts/router');
let express = require('express');
let app = express();
app.use(router);
router.use(express.static(path.join(__dirname, '/public/neuroshare-questionnaire')));


router.get('/qx', (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, '/public/neuroshare-questionnaire', '/index.html'));
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

module.exports = router;
