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

    , 'id:new-comment': (myName)=>`
    do $$
        declare 
            webSitePageId int;
            webSiteId int;
        begin
            select id into webSiteId from web_site where site_name = '${myName}';
            select id into webSitePageId from web_site_page where web_page = 'test2' and web_site_id = webSiteId ;
            if(webSitePageId is null) then
                insert into web_site_page(web_site_id,web_page) values (webSiteId,'test2') returning id into webSitePageId;
            end if;
            insert into web_site_page_comments(web_site_page_id,email,mname,visitor_web_site,jcomment) values (
                webSitePageId, 'm', 'a', 'wweb', '{"x":"3"}');
        end $$;
    `
    
}

module.exports = sql;