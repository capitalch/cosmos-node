const sql = {
    'id:get-contacts-on-name': `
    select * from :table where mname = :mname and :mname <> 'abc'
    and addr2 = :addr2 and :mname <> 'def'
    `

    , 'id:get-all-contacts-on-table-name': `
    select * from contacts;
    `

    , 'id:register-user': `
    insert into "Users"("userName","password", "email") values (:userName, :password, :email)
	ON CONFLICT ("userName") DO
 		UPDATE
			SET "password" = :password;
    `

    , 'id:get-password':`
    select "password", "jRule","jInfo" from "Users" where "userName" = :userName;
    `

    , 'id:total-web-site-hit':`
    select f_total_web_site_hit(:asite_name,:aip_address) as hits;
    `
}

module.exports = sql;