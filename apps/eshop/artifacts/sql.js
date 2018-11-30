let sqls = {
  'post:query:cart': `
      select s.id, product_id, qty, mdate, p.name,model,images,product_info, list_price, offer_price, b.name as brand, get_product_label(p.product_info)::json as label
      from shopping_cart s
        join product p
          on s.product_id = p.id
        left join brand b
          on b.id = p.brand_id
      where s.isactive and user_id = %s order by s.id;`

  , 'post:place:order:from:cart':`
      do $$
      declare 
        morder_id bigint;
        mamount numeric(12,2);
        muser_id integer;
      begin
        select %s into muser_id;
        insert into morder (user_id) values (muser_id) returning id into morder_id;
        insert into order_details (order_id,product_id,qty,price)
          select (select morder_id), product_id, qty, offer_price
            from shopping_cart s join product p
              on s.product_id = p.id
                where user_id = muser_id;
        select sum(qty*price) into mamount 
          from order_details where order_id = morder_id;
        update morder
          set amount = mamount
            where id = morder_id;
        delete from shopping_cart
          where user_id = muser_id;
      end $$
  `

  , 'post:add:sub:cart': `
      do $$
      declare _qty integer := 0;
      begin
          if exists(select 0 from {{tableName}} where user_id = {{user_id}} and product_id = {{product_id}}) then
            with u as (update {{tableName}} set qty = qty + {{qty}} where user_id = {{user_id}} and product_id = {{product_id}} returning qty) 
            select qty into _qty from u;
            if _qty <= 0 then
              delete from {{tableName}} where user_id = {{user_id}} and product_id = {{product_id}};
            end if;
          else
            _qty := {{qty}};
            if _qty >= 0 then
              insert into {{tableName}} ({{fields}}) values({{{values}}});
            end if;
          end if;
      end $$;
      select qty as productQty from shopping_cart where user_id = {{user_id}} and product_id = {{product_id}};
      select sum(qty) as totalQty from shopping_cart where user_id = {{user_id}};
      select s.id, product_id, qty, mdate, p.name,model,images,product_info, list_price, offer_price, b.name as brand, get_product_label(p.product_info)::json as label
      from shopping_cart s
        join product p
          on s.product_id = p.id
        left join brand b
          on b.id = p.brand_id
      where s.isactive and user_id = {{user_id}} order by s.id;
    `
    
  , 'post:reset:cart': `
      delete from shopping_cart where user_id = %s;
    `

  , 'post:delete:item:in:cart':`
      delete from shopping_cart where id = %s;
      select s.id, product_id, qty, mdate, p.name,model,images,product_info, list_price, offer_price, b.name as brand, get_product_label(p.product_info)::json as label
      from shopping_cart s
        join product p
          on s.product_id = p.id
        left join brand b
          on b.id = p.brand_id
      where s.isactive and user_id = %s order by s.id;
    `

  , 'post:query:product:details:on:id': `select *, get_product_label(p.product_info)::json as label            
      from product p where id = %s;
      select q.id, q.content, q.likes, q.product_id, q.is_approved, q.user_id, q.mdate , array_to_json(array_agg(to_json(a))) as answers
      from question q left join lateral (select id, mdate, content, likes, user_id, is_approved from answer a where a.question_id = q.id ) a
      on true where q.product_id =%s
      group by q.id
      order by q.id;
      select r.id, r.user_id, r.product_id, r.mdate, r.rating, r.images, r.content, r.is_approved, r.likes, r.title, array_to_json(array_agg(to_json(a))) as responses
      from review r left join lateral (select id, user_id, review_id, content, likes, mdate, is_approved from response a where a.review_id = r.id ) a
      on true where r.product_id = %s
        group by r.id
          order by r.id`

  , 'post:query:products:on:category': `with recursive cte1 as (
      select id,label, parent_id
      from category where id::text like %L
      union
        select c1.id, c1.label, c1.parent_id
          from category c1 inner join cte1 c2
            on c1.parent_id = c2.id
      )
      select 
      p.id, p.name, list_price, product_code,descr,  offer_price, model, images[1] as image,
      get_product_label(p.product_info)::json as label
      --(select a->'values' from jsonb_array_elements(p.product_info) as a where a->>'name' = 'label' limit 1 ) as label
      from product p 		  
      where cat_id in (
          select id from cte1 --where id not in( select parent_id from cte1 where parent_id is not null)
      )  order by p.id offset %s limit %s;`

  , 'post:query:categories:with:count': `with recursive cte1 as(
      select c.id,c.label, c.parent_id, count(0) as product_cnt, true as leaf
        from category c inner join product p
          on p.cat_id = c.id
            group by c.id, c.parent_id 
      union all
        select c.id,c.label, c.parent_id, cte1.product_cnt, false as leaf
          from category c join cte1
            on c.id = cte1.parent_id
      ), cte2 as (select id, label, parent_id, sum(product_cnt) as product_cnt, leaf
      from cte1
        group by id, parent_id, label, leaf
            order by id, parent_id)
        select id, label || ' (' || product_cnt || ')' as label, 
          parent_id, product_cnt, leaf from cte2 order by id`

  , 'post:search:products:on:criteria': `select p.id, p.name, list_price, product_code,descr, b.name as brand, offer_price, model, images[1] as image,
        ts_rank_cd(tsv,query,32) as rank
      from product p left join brand b 
        on p.brand_id = b.id, plainto_tsquery('english',%L) query
      where 
        cat_id::text LIKE %L and 
        tsv @@ query
      order by rank DESC,id offset %s limit %s;`

  , 'post:search:products:categories:on:criteria': `with cte0 as (    
      select id, name as label, cat_id
      from product
          where tsv @@ plainto_tsquery('english', %L)    
      )
      , cte1 as (
  	  select 0 as id, 'All categories' as label, null::int as parent_id, (select count(0) from cte0)::int as product_cnt, false as leaf
      union
        select c1.id, c1.label, 0::int as parent_id, count(0), true as leaf
    	  from category c1 inner join cte0 c2
      		on c1.id = c2.cat_id
      			group by c1.id, c1.label
      ) select id, label || ' (' || product_cnt || ')' as label, parent_id, product_cnt, leaf from cte1
        order by id`
  
  , 'post:search:products:on:criteria1': `select p.id, p.name, list_price, product_code,descr, b.name as brand, offer_price, model, images[1] as image
        from product p left join brand b 
          on p.brand_id = b.id
        where 
          cat_id::text LIKE %L and 
          tsv @@ plainto_tsquery('english',%L)
          order by p.id offset %s limit %s;`
}

module.exports = sqls;