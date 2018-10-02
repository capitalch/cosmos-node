const sql = {
    'id:get-contacts-on-name': `
    select * from :table where mname = :mname and :mname <> 'abc'
    and addr2 = :addr2 and :mname <> 'def'
    `

    , 'id:get-all-contacts-on-table-name': `
    select * from contacts;
    `

    , 'id:register-user': `
    insert into users(username,password) values (:username, :password)
	ON CONFLICT (username) DO
 		UPDATE
			SET password = :password;
    `
    , 'id:get-password':`
    select password, jinfo from users where username = :username;
    `
}

module.exports = sql;