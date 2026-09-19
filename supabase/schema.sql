-- Islamatrix schema — run once in Supabase Dashboard → SQL Editor on an EMPTY project.
-- Public can READ everything (homepage + service pages are public).
-- Only logged-in admin users (authenticated role) can write.

-- ============================== tables ==============================

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null default '',
  short_desc text not null default '',
  long_desc text not null default '',
  icon_emoji text not null default '✦',
  accent_color text not null default '#a78bfa',
  order_index int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists portfolio_items (
  id uuid primary key default gen_random_uuid(),
  service_slug text not null default '',
  title text not null default '',
  description text not null default '',
  client_name text not null default '',
  image_url text not null default '',
  embed_url text not null default '',
  embed_type text not null default 'image',
  proof_metric text not null default '',
  is_featured boolean not null default false,
  order_index int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists portfolio_items_slug_idx on portfolio_items (service_slug);

-- Founder profile lives here (individual specialists are intentionally not published).
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  role text not null default '',
  service_slug text,
  photo_url text not null default '',
  bio text not null default '',
  specialties text[] not null default '{}',
  email text not null default '',
  whatsapp text not null default '',
  portfolio_url text not null default '',
  order_index int not null default 0,
  is_active boolean not null default true,
  is_founder boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null default '',
  client_role text not null default '',
  client_avatar_url text not null default '',
  quote text not null default '',
  rating int not null default 5,
  service_slug text,
  order_index int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null default '',
  answer text not null default '',
  order_index int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Per-service dedicated-page copy (intro, benefits, deliverables, FAQs, SEO).
create table if not exists service_details (
  service_slug text primary key references services (slug) on delete cascade,
  intro text not null default '',
  benefits text[] not null default '{}',
  deliverables text[] not null default '{}',
  ideal_for text[] not null default '{}',
  faqs jsonb not null default '[]',
  meta_title text not null default '',
  meta_desc text not null default ''
);

-- All site-wide editable text: logo, footer, hero, stats, process, headings.
create table if not exists site_settings (
  key text primary key,
  value text not null default ''
);

-- ============================== RLS ==============================

alter table services enable row level security;
alter table portfolio_items enable row level security;
alter table team_members enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table service_details enable row level security;
alter table site_settings enable row level security;

-- Public read (drop first so the script is re-runnable).
drop policy if exists "public read" on services;
drop policy if exists "public read" on portfolio_items;
drop policy if exists "public read" on team_members;
drop policy if exists "public read" on testimonials;
drop policy if exists "public read" on faqs;
drop policy if exists "public read" on service_details;
drop policy if exists "public read" on site_settings;

create policy "public read" on services for select using (true);
create policy "public read" on portfolio_items for select using (true);
create policy "public read" on team_members for select using (true);
create policy "public read" on testimonials for select using (true);
create policy "public read" on faqs for select using (true);
create policy "public read" on service_details for select using (true);
create policy "public read" on site_settings for select using (true);

-- Admin write (any authenticated user = the admin you create in Authentication).
drop policy if exists "admin write" on services;
drop policy if exists "admin write" on portfolio_items;
drop policy if exists "admin write" on team_members;
drop policy if exists "admin write" on testimonials;
drop policy if exists "admin write" on faqs;
drop policy if exists "admin write" on service_details;
drop policy if exists "admin write" on site_settings;

create policy "admin write" on services for all to authenticated using (true) with check (true);
create policy "admin write" on portfolio_items for all to authenticated using (true) with check (true);
create policy "admin write" on team_members for all to authenticated using (true) with check (true);
create policy "admin write" on testimonials for all to authenticated using (true) with check (true);
create policy "admin write" on faqs for all to authenticated using (true) with check (true);
create policy "admin write" on service_details for all to authenticated using (true) with check (true);
create policy "admin write" on site_settings for all to authenticated using (true) with check (true);

-- ============================== storage ==============================

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true),
       ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

drop policy if exists "public read assets" on storage.objects;
drop policy if exists "admin write assets" on storage.objects;

create policy "public read assets" on storage.objects
  for select using (bucket_id in ('site-assets', 'portfolio-images'));

create policy "admin write assets" on storage.objects
  for all to authenticated using (bucket_id in ('site-assets', 'portfolio-images'))
  with check (bucket_id in ('site-assets', 'portfolio-images'));
