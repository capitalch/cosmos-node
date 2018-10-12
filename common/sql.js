const sql = {
    'id:get-contacts-on-name': `
    select * from :table where mname = :mname and :mname <> 'abc'
    and addr2 = :addr2 and :mname <> 'def'
    `

    , 'id:get-all-contacts-on-table-name': `
    select * from contacts;
    `

    , 'id:register-user': `
    insert into "Users"("userName","password") values (:userName, :password)
	ON CONFLICT ("userName") DO
 		UPDATE
			SET "password" = :password;
    `

    , 'id:get-password':`
    select "password", "jRule","jInfo", "weight" from "Users" where "userName" = :userName;
    `
}

module.exports = sql;