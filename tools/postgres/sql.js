const sql = {
    'id:get-contacts-on-name':`select * from contacts where mname = :mname`
}

module.exports = sql;