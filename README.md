# VELORA

## Local setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill in your Supabase URL and anon/publishable key (Project Settings → API in Supabase). Never commit `.env` — it's gitignored.
3. `npm run dev`

## Database
The schema already lives in your connected Supabase project (tables, RLS policies, storage buckets, and the `place_order` function that prices orders server-side). `supabase/schema.sql` is a reference copy for a fresh project — run it in the SQL editor only if you're setting up a new Supabase project from scratch.

## First admin
In Supabase, create a user under Authentication → Users, then in the SQL editor:
```sql
insert into admin_users select id from auth.users where email='you@example.com';
```
Sign in at `/admin/login`.

## Adding products
Use Admin → Products (needs 4–6 images per product before it can publish) rather than the table editor directly, so images and stock stay consistent.

## WhatsApp ordering
Set your store's WhatsApp number in Admin → WhatsApp (digits with country code, e.g. `919876543210`). Orders are saved as pending/unpaid and the customer sends a prefilled WhatsApp message to you to confirm and pay — there is no payment gateway wired in.

## Deploy (Vercel)
1. Push this repo to GitHub, then import it in Vercel.
2. Add the two env vars from `.env` in Vercel's project settings.
3. `vercel.json` already has the SPA rewrite so client-side routes work.
4. In Supabase → Authentication → URL Configuration, set Site URL to your live domain.
