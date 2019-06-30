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

    , 'id:get-password': `
    select "password", "jRule","jInfo" from "Users" where "userName" = :userName;
    `

    , 'id:total-web-site-hit': `
    select f_total_web_site_hit(:asite_name,:aip_address) as hits;
    `

    , 'id:new-comment': ({ webSite, page, mname, email, visitorSite, comment, parentId }) => `
    do $$
        declare 
            pageId int;
            siteId int;
        begin
            select id into siteId from web_site where site_name = '${webSite}';
            if(siteId is null) then
                raise exception 'web site ${webSite} not found';
            end if;
            select id into pageId from pages where page = '${page}' and web_site_id = siteId;
            if(pageId is null) then
                insert into pages(web_site_id,page) values (siteId,'${page}') returning id into pageId;
            end if;
            insert into comments(page_id,email,mname,visitor_web_site,comment, parent_id) values (
                pageId, '${email}', '${mname}', '${visitorSite}', '${comment}', NULLIF('${parentId}','null')::integer );
        end $$;
    `

    , 'id:delete-comment': `
        delete from comments where id = :commentId;
    `

    , 'id:get-comments':`
        --select count(*) from comments;
        --select id, parent_id, mname, comment, commented_on from comments order by id desc;
        select c.id, c.parent_id, mname, comment, commented_on 
		from web_site w 
			inner join pages p 
				on w.id = p.web_site_id
			inner join comments c
				on p.id = c.page_id
			where site_name=:site and page = :page and isapproved = true
			order by id desc;
    `

}

module.exports = sql;