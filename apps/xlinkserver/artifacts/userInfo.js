let tenants = [
    {
        id: 1,
        name: 'capital'
    }, {
        id: 2,
        name: 'rancelab'
    }
];
exports.tenants = tenants;

let clients = [
    {
        id: 1,
        name: 'nav',
        tenantId: 1
    }, {
        id: 2,
        name: 'kush',
        tenantId: 1
    }, {
        id: 3,
        name: 'chow',
        tenantId: 1
    }, {
        id: 4,
        name: 'netwoven',
        tenantId: 1
    }, {
        id: 5,
        name: 'mobile',
        tenantId: 1
    }, {
        id: 6,
        name: 'chitta',
        tenantId: 1
    }
];
exports.clients = clients;

let terminals = [
    {
        id: 1,
        name: 'navServer',
        clientId: 1,
        pwd: '12345'
    }, {
        id: 2,
        name: 'kushServer',
        clientId: 2,
        pwd: '12345'
    }, {
        id: 3,
        name: 'chowServer',
        clientId: 3,
        pwd: '12345'
    }, {
        id: 4,
        name: 'netwovenServer',
        clientId: 4,
        pwd: '12345'
    }, {
        id: 5,
        name: 'sushant',
        clientId: 5,
        pwd: '12345'
    }, {
        id: 6,
        name: 'kamal',
        clientId: 5,
        pwd: '12345'
    }, {
        id: 7,
        name: 'ujjal',
        clientId: 5,
        pwd: '12345'
    }, {
        id: 8,
        name: 'client1',
        clientId: 6,
        pwd: '12345'
    }
];
exports.terminals = terminals;

// let getUserInfo = (uid) => {     let uidArray = uid.split('.');     let
// userInfo = {         tenant: uidArray[0],         client: uidArray[1],
// terminal: uidArray[2]     };     return (userInfo); } exports.getUserInfo =
// getUserInfo;