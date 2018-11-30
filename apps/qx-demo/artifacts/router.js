"use strict";
const express = require('express');
const moment = require('moment');
const router = express.Router();
const config = require('../config.json');
const pg = require('pg');
const format = require('pg-format');
const sql = require('./sql');

const dbConfig = {
    user: config.db.user, // name of the user account
    database: config.db.database, // name of the database
    password: config.db.password,
    port: config.db.port,
    host: config.db.host,
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};

const pool = new pg.Pool(dbConfig);

router.get('/api/qx', (req, res, next) => {
    try {
        const qxCode = req.query.qx_code || req.query['qx-code'] || req.quesry.code;
        let sqlString = sql['select:patient-details'];
        sqlString = format(sqlString, qxCode); // inject parameters
        pool.query(sqlString).then(result => {
            if (result.rows.length > 0) {
                const r = result.rows[0];
                const appDate = r.appointmentDate && moment(r.appointmentDate).format(config.qx.dateFormat);
                const completedDate = r.completedDate && moment(r.completedDate).format(config.qx.dateFormat);
                const ret = {
                    qx_appt_date: appDate
                    , qx_appt_time: r.appointmentTime
                    , first_name: r.firstName
                    , last_name: r.lastName
                    , clinician_name: r.clinicianName
                    , gender: r.gender
                    , carry_bag: r.carryBag
                    , responses: r.responses
                    , qx_code: r.qxCode
                    , edss_score: r.edssScore
                    , qx_type: r.qxType
                };
                ret.symptoms = "[{\"score\":\"Moderate\",\"title\":\"Cognition\"},{\"score\":\"\",\"title\":\"Fatigue\"},{\"score\":\"Mild\",\"title\":\"Mood\"},{\"score\":\"Mild\",\"title\":\"Sleep\"},{\"score\":\"\",\"title\":\"Vision\"},{\"score\":\"\",\"title\":\"Speech\"},{\"score\":\"\",\"title\":\"Swallowing\"},{\"score\":\"Mild\",\"title\":\"Arm use\"},{\"score\":\"Moderate\",\"title\":\"leg use\"},{\"score\":\"\",\"title\":\"Mobility\"},{\"score\":\"Severe\",\"title\":\"Balance\"},{\"score\":\"\",\"title\":\"Sensory\"},{\"score\":\"Moderate\",\"title\":\"Pain\"},{\"score\":\"Mild\",\"title\":\"Bowel\"},{\"score\":\"Moderate\",\"title\":\"Bladder\"},{\"score\":\"Moderate\",\"title\":\"Sexual\"},{\"score\":\"3\",\"title\":\"Quality of Life\"}]";
                r.completedDate && (ret.qx_completed_at = r.completedDate);
                r.status && (ret.status = r.status);
                res.json(ret);
            } else {
                res.json({ error: 'There is no data against this patient' });
            }
        })
            .catch(
                e => setImmediate(
                    () => {
                        res.status(e.status || 500);
                        res.json({ error: e.message })
                    })
            )

    } catch (error) {
        // let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(error);
    }
});

router.post('/api/qx', (req, res, next) => {
    try {
        const qx = req.body;
        let sqlString;
        const sqlStringNormal = sql['update:patient-details'];
        const sqlStringCompleted = sql['complete:patient-details'];
        if (qx.status === 'completed') {
            sqlString = format(sqlStringCompleted, qx.qx_code);
        } else {
            sqlString = format(sqlStringNormal,
                qx.responses,
                qx.carry_bag,
                qx.status,
                qx.qx_code);
        }
        // pool.query(sqlString).then(result => {
        //     res.status(200).json({
        //         'status': 'ok'
        //     });
        // }).catch(
        //     e => setImmediate(
        //         () => {
        //             res.status(e.status || 500);
        //             res.json({ error: e.message })
        //         })
        // );
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

router.get('/opt-out/:param', (req, res, next) => {
    res.status(200).json("ok");
})

router.get('/api/reset', (req, res, next) => {
    try {
        const qxCode = req.query.qx_code || req.query['qx-code'] || req.query.code;
        const status = req.query.status || null;
        const completedOn = req.query.completedOn || null;
        let sqlString = sql['reset:patient-details:code'];
        sqlString = format(sqlString, completedOn, status, qxCode);
        pool.query(sqlString).then(result => {
            res.json({
                operation: 'success'
                , 'qx_code': qxCode
                , completedOn: completedOn
                , status: status
            });
        }).catch(
            e => setImmediate(
                () => {
                    res.status(e.status || 500);
                    res.json({ error: e.message })
                })
        );
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

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

module.exports = router;

//deprecated
