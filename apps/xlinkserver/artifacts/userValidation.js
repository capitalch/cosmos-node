let crypto = require('crypto');
let messages = require('./messages');
let fs = require('fs');
// let config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
let userInfo = require('./userInfo');

let getUserObject = (uid) => {
    let userObject;
    let setUserObject = () => {
        let uidArray = uid.split('.');
        if (uidArray.length == 3) {
            userObject = {
                tenant: uidArray[0],
                client: uidArray[1],
                terminal: uidArray[2]
            };
        }
        return (userObject);
    }
    Boolean(uid) && setUserObject()
    return (userObject);
};
exports.getUserObject = getUserObject;

let getPwd = (uid) => {
    let ret = false,
        userObject,
        tenant,
        client,
        terminal,
        pwd;
    let f_userObject = () => {
        let uidArray = uid.split('.');
        if (uidArray.length == 3) {
            userObject = {
                tenant: uidArray[0],
                client: uidArray[1],
                terminal: uidArray[2]
            };
        }
        return Boolean(userObject);
    };
    let f_tenant = () => {
        tenant = userInfo
            .tenants
            .find((x) => x.name === userObject.tenant);
        return Boolean(tenant);
    };

    let f_client = () => {
        client = userInfo
            .clients
            .find((x) => (x.name == userObject.client) && (x.tenantId == tenant.id));
        return Boolean(client);
    };

    let f_terminal = () => {
        terminal = userInfo
            .terminals
            .find((x) => (x.name == userObject.terminal) && (x.clientId == client.id));
        pwd = terminal && terminal.pwd;
        return Boolean(terminal);
    };

    ret = Boolean(uid) && f_userObject() && f_tenant() && f_client() && f_terminal();
    //Validation is success if pwd has some value
    return (pwd);
}

exports.getPwd = getPwd;

let getToken = (req) => {
    let bearerToken = (req.body && req.body.token) || (req.query && req.query.token) || (req.headers['Authorization'] || req.headers['authorization']);
    let tokenArray = bearerToken && bearerToken.split(' ');
    let token = tokenArray && (tokenArray[1] || tokenArray[0]);
    return (token);
};
exports.getToken = getToken;
