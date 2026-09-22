create extension if not exists pgcrypto;
create table categories(id uuid primary key default gen_random_uuid(),slug text unique not null,name text not null);
insert into categories(slug,name) values('t-shirts','T-Shirts'),('shirts','Shirts'),('jeans','Jeans'),('trousers','Trousers'),('joggers','Joggers'),('jackets','Jackets');
create table admin_users(user_id uuid primary key references auth.users on delete cascade);
create function is_admin() returns boolean language sql security definer stable as $$ select exists(select 1 from admin_users where user_id=auth.uid()) $$;
create table products(id uuid primary key default gen_random_uuid(),slug text unique not null,name text not null,
 category text not null references categories(slug),price numeric(10,2) not null check(price>=0),color text not null,description text default '',
 sizes text[] not null default '{S,M,L,XL}',stock int not null default 0,is_new boolean default false,is_featured boolean default false,
 published boolean default false,created_at timestamptz default now());
create table product_images(id uuid primary key default gen_random_uuid(),product_id uuid not null references products on delete cascade,
 url text not null,position int not null check(position between 1 and 8),unique(product_id,position));
-- max 8 images enforced by position check; min 4 enforced before a product can be published:
create function enforce_min_images() returns trigger language plpgsql as $$ begin
 if new.published and (select count(*) from product_images where product_id=new.id)<4 then raise exception 'A product needs at least 4 images to be published'; end if; return new; end $$;
create trigger products_min_images before insert or update on products for each row execute function enforce_min_images();
create table customers(id uuid primary key references auth.users on delete cascade,full_name text,phone text,created_at timestamptz default now());
create table wishlist(user_id uuid references auth.users on delete cascade,product_id uuid references products on delete cascade,primary key(user_id,product_id));
create table cart(user_id uuid references auth.users on delete cascade,product_id uuid references products on delete cascade,size text,qty int default 1,primary key(user_id,product_id,size));
create table orders(id uuid primary key,user_id uuid references auth.users,customer_name text not null,email text not null,phone text,address text,city text,state text,pincode text,country text,
 total numeric(10,2) not null,status text not null default 'Pending' check(status in('Pending','Confirmed','Processing','Shipped','Delivered','Cancelled')),
 payment_status text not null default 'Unpaid',created_at timestamptz default now());
create table order_items(id uuid primary key default gen_random_uuid(),order_id uuid references orders on delete cascade,product_id uuid references products,name text,size text,qty int,price numeric(10,2));
alter table categories enable row level security;alter table products enable row level security;alter table product_images enable row level security;alter table admin_users enable row level security;
alter table customers enable row level security;alter table wishlist enable row level security;alter table cart enable row level security;alter table orders enable row level security;alter table order_items enable row level security;
create policy "read cats" on categories for select using(true);create policy "admin cats" on categories for all using(is_admin()) with check(is_admin());
create policy "read published" on products for select using(published or is_admin());create policy "admin products" on products for all using(is_admin()) with check(is_admin());
create policy "read images" on product_images for select using(true);create policy "admin images" on product_images for all using(is_admin()) with check(is_admin());
create policy "self admin row" on admin_users for select using(user_id=auth.uid());
create policy "own profile" on customers for all using(id=auth.uid()) with check(id=auth.uid());create policy "admin sees customers" on customers for select using(is_admin());
create policy "own wishlist" on wishlist for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "own cart" on cart for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "place order" on orders for insert with check(status='Pending' and payment_status='Unpaid');
create policy "read own orders" on orders for select using(user_id=auth.uid() or is_admin());create policy "admin update orders" on orders for update using(is_admin());
create policy "place items" on order_items for insert with check(true);create policy "read items" on order_items for select using(is_admin() or exists(select 1 from orders o where o.id=order_id and o.user_id=auth.uid()));
insert into storage.buckets(id,name,public) values('product-images','product-images',true) on conflict do nothing;
create policy "public read images" on storage.objects for select using(bucket_id='product-images');
create policy "admin upload images" on storage.objects for insert with check(bucket_id='product-images' and is_admin());
create policy "admin delete images" on storage.objects for delete using(bucket_id='product-images' and is_admin());
-- After signing up, make yourself admin:  insert into admin_users select id from auth.users where email='you@example.com';
