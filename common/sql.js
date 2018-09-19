const sql = {
    'id:get-contacts-on-name':`
    select * from :table where mname = :mname and :mname <> 'abc'
    and addr2 = :addr2 and :mname <> 'def'
    `,
    'id:get-all-contacts-on-table-name':`
    select * from contacts;
    `

}

module.exports = sql;