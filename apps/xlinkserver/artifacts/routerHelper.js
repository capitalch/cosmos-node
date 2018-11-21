let _ = require('lodash');
let ss = require('socket.io-stream');
let fs = require('fs');
let jwt = require('jsonwebtoken');
let socketHelper = require('./socketHelper');
let userValidation = require('./userValidation');
let messages = require('./messages');
// let config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
let config = require('../config.json');
let routerHelper = {};
routerHelper.getInfo = (req, res, next) => {
    let key = req.body.key;
    let uidObject = userValidation.getUserObject(req.uid);
    let clientsInfoList = _
        .values(socketHelper.io.sockets.sockets)
        .filter(x => x.clientInfo.uid.split('.')[0] == uidObject.tenant)
        .map(x => x.clientInfo);
    // res.json({data: clientsInfoList});
    res.json(clientsInfoList);
};

routerHelper.executeReq = (req, res, options) => {
    let token = userValidation.getToken(req);
    let sourceUid = '';
    // let st = req.headers.host
    let uid = req.body.toUid;// st.substring(0, st.lastIndexOf("."));
    if (!token) {
        res
            .status(403)
            .json({error: messages.errInvalidToken});
        return;
    }
    jwt.verify(token, config.key, (error, decoded) => {
        if (error || (!decoded)) {
            res
                .status(401)
                .json({
                    error: error || messages.errInvalidToken
                });
        } else {
            sourceUid = decoded;
            let connectedTargetSockets = _
                .values(socketHelper.io.sockets.connected)
                .filter(x => x.clientInfo.uid.toLowerCase() == uid.toLowerCase());
            if (connectedTargetSockets.length >= 1) {
                console.log('Sending request to tenant server');
                connectedTargetSockets.forEach(x => {
                    ss(x).emit('sc-msg', options, (err, d) => {
                        if (err) {
                            res
                                .status(500)
                                .json(err);
                        } else {
                            console.log(d);
                            d && d.stream
                                ? d
                                    .stream
                                    .pipe(res)
                                : res.json(d);
                        }
                    });
                });
            } else {
                res
                    .status(400)
                    .json({error: messages.errInvalidAddress});
            }
        }
    });
};
module.exports = routerHelper;
// exports.executeReq = executeReq;