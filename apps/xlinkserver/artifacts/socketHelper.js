//uid is tenant:client:terminal
let Rx = require('rxjs');

let fs = require('fs');
let config = require('../config.json');
// JSON.parse(fs.readFileSync('config.json', 'utf8'));
let jwt = require('jsonwebtoken');
let _ = require('lodash');
let messages=require('./messages');
// let events = require('events'); let eventEmitter = new events.EventEmitter();

// let pubsub = require('./pubsub');
// let dbHelper = require('./dbHelper');
let userInfo = require('./userInfo');
let userValidation = require('./userValidation');

let socketHelper = {};
socketHelper.init = (server) => {
    socketHelper.io = require('socket.io').listen(server);
    socketHelper.io.set('transports', ['websocket', 'polling']);
    socketHelper.io.on('connection', (socket) => {
        let token = socket.handshake.query.token;
        let clientInfo = socket.handshake.query.clientInfo;
        if ((!token) || (!clientInfo)) {
            socket.disconnect();
            return;
        }
        validateToken(socket, token, clientInfo);
        setSocketEvents(socket);
    });
}

function validateToken(socket, token, clientInfo) {
    jwt.verify(token, config.key, (error, decoded) => {
        let uid = decoded;
        let isValidToken = (!Boolean(error)) && Boolean(uid);
        if (isValidToken) {
            deleteConnectedSockets(uid);
            clientInfo = JSON.parse(clientInfo);
            clientInfo.uid = uid;
            socket.clientInfo = clientInfo;
            socket.uid = uid;
            let allUsers = Object
                .keys(socketHelper.io.sockets.connected)
                .length;
            socketHelper.io
                .sockets
                .emit('allUsers', {count: allUsers});
            console.log('Users:', allUsers);

        } else {
            socket.emit('sc-error',messages.errInvalidToken);
            socket.disconnect();
            return;
        }
    });
};

function setSocketEvents(socket) {
    socket.on('cc-msg', (d, fn) => {
        let connectedTargetSockets = _
            .values(socketHelper.io.sockets.connected)
            .filter(x => x.clientInfo.uid == d.toUid);
        connectedTargetSockets.forEach(x => {
            x.emit('cc-msg', d, fn);
        });
    });

    socket.on('disconnect', d => {
        publishAllUsers();
    });

    socket.on('error', d => {
        console.log('Error:' + d);
    })

    // let serverActions = {
    //     'get:connected:users': (tenant, fn) => {
    //         let users = _
    //             .values(io.sockets.sockets)
    //             .map(x => x.clientInfo.uid)
    //             .filter(x => x.split(':')[0] == tenant);
    //         fn(users);
    //     },
    //     'get:clients:info:list': (tenant, fn) => {
    //         let clientsInfoList = _
    //             .values(io.sockets.sockets)
    //             .filter(x => x.clientInfo.uid.split(':')[0] == tenant)
    //             .map(x => x.clientInfo);
    //         fn(clientsInfoList);
    //     }
    // };

    // socket.on('cs-msg', (d, fn) => {
    //     let tenant = d
    //         .uid
    //         .split(':')[0];
    //     serverActions[d.innerData.action](tenant, fn);
    // });

}

function publishAllUsers() {
    let allUsers = Object
        .keys(socketHelper.io.sockets.connected)
        .length;
    console.log('Users:', allUsers);
    socketHelper.io
        .sockets
        .emit('allUsers', {count: allUsers});
}

function deleteConnectedSockets(uid) {
    let connectedSockets = _.values(socketHelper.io.sockets.connected);
    connectedSockets = connectedSockets && connectedSockets.filter(x => {
        let ret = Boolean(x.clientInfo) && (x.clientInfo.uid == uid)
        return (ret);
    });
    connectedSockets && connectedSockets.forEach((soc) => {
        soc.removeAllListeners();
        soc.disconnect();
    });
};

module.exports = socketHelper;