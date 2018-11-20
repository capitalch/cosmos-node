let r = require('rethinkdb');
let pubsub = require('./pubsub');
let connection = null;

// r.connect({
//     host: 'localhost',
//     port: 28015
// }, (err, conn) => {
//     if (err) {
//         throw(err);
//     }
//     console.log('RethinkDB connected');
//     connection = conn;
// });

function isUserExists(uid) {
    let tenantName = uid.split(':')[0];
    let userName = uid.split(':')[1];
    tenant = 'capital';
    user = 'sushant';
    r.db('LinkDB').table('Tenants').filter(tenant=>tenant('name').eq(tenantName))
        .filter((tenant) => 
            tenant('users').contains(user=>user('name').eq(userName))
        )
        .count()
        .run(connection, (err, result) => {
            if (err) {
                throw(err);
            } else {
                pubsub.emit('is:user:exists', (result > 0));
            }
        });
    
};

exports.isUserExists = isUserExists;