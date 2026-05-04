-- ────────────────────────────────────────────────────────────
-- Portfolio DB schema for Supabase
-- Run this in the Supabase SQL editor to set up all tables.
-- ────────────────────────────────────────────────────────────

-- Profile (single row — enforce via RLS / trigger)
create table if not exists portfolio_profile (
  id          uuid primary key default gen_random_uuid(),
  name        text not null default 'Emmanuel Osei Mensah',
  title       text not null default 'Full-stack engineer',
  location    text not null default 'Accra · remote',
  blurb       text not null default '',
  portrait_url  text not null default '',
  portrait_tone text not null default '#3a4a4a',
  email       text not null default 'emmanuel@osei.dev',
  updated_at  timestamptz not null default now()
);

-- Social links
create table if not exists portfolio_social (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  handle      text not null,
  url         text not null default '#',
  sort_order  int  not null default 0
);

-- Skills — one row per skill, grouped by group_name
create table if not exists portfolio_skills (
  id          uuid primary key default gen_random_uuid(),
  group_name  text not null,
  skill_name  text not null,
  sort_order  int  not null default 0
);

-- Projects
create table if not exists portfolio_projects (
  id          text primary key,
  initials    text not null,
  tone        text not null default '#3a4a4a',
  title       text not null,
  role        text not null,
  year        text not null,
  summary     text not null,
  stack       text[] not null default '{}',
  status      text not null default 'Draft',
  live_url    text not null default '',
  repo_url    text not null default '',
  sort_order  int  not null default 0
);

-- Experience
create table if not exists portfolio_experience (
  id          text primary key,
  company     text not null,
  role        text not null,
  period      text not null,
  note        text not null,
  sort_order  int  not null default 0
);

-- Writing / blog posts
create table if not exists portfolio_writing (
  id          text primary key,
  title       text not null,
  date_display text not null,
  read_time   text not null,
  sort_order  int  not null default 0
);

-- Blog posts (full content, assets, references)
create table if not exists blog_posts (
  id           text primary key,
  slug         text not null unique,
  title        text not null,
  excerpt      text not null default '',
  content      text not null default '',
  date_display text not null default '',
  read_time    text not null default '',
  tags         text[] not null default '{}',
  assets       jsonb not null default '[]',
  refs         jsonb not null default '[]',
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  sort_order   int not null default 0
);

-- ── Row-level security ──────────────────────────────────────
-- Admin password lives in ADMIN_PASSWORD_HASH env var, not the DB.

alter table portfolio_profile   enable row level security;
alter table portfolio_social     enable row level security;
alter table portfolio_skills     enable row level security;
alter table portfolio_projects   enable row level security;
alter table portfolio_experience enable row level security;
alter table portfolio_writing    enable row level security;
alter table blog_posts           enable row level security;

-- Public read on all portfolio tables
-- DROP first so the file is safe to re-run on an existing database
drop policy if exists "public read profile"   on portfolio_profile;
drop policy if exists "public read social"    on portfolio_social;
drop policy if exists "public read skills"    on portfolio_skills;
drop policy if exists "public read projects"  on portfolio_projects;
drop policy if exists "public read exp"       on portfolio_experience;
drop policy if exists "public read writing"   on portfolio_writing;
drop policy if exists "public read blog"      on blog_posts;

create policy "public read profile"   on portfolio_profile   for select using (true);
create policy "public read social"    on portfolio_social     for select using (true);
create policy "public read skills"    on portfolio_skills     for select using (true);
create policy "public read projects"  on portfolio_projects   for select using (true);
create policy "public read exp"       on portfolio_experience for select using (true);
create policy "public read writing"   on portfolio_writing    for select using (true);
create policy "public read blog"      on blog_posts           for select using (published = true);

-- All writes go through the service-role key (used only in API routes)
-- No additional RLS policies needed for writes since we use service role.

-- admin_config is accessible only via service role (no public read)

-- ── Seed initial data ───────────────────────────────────────

insert into portfolio_profile (name, title, location, blurb, portrait_url, portrait_tone, email)
values (
  'Emmanuel Osei Mensah',
  'Full-stack engineer',
  'Accra · remote',
  'I build durable, well-considered web products end-to-end — from data model and API surface to interface and motion. Currently focused on developer-facing tools and quiet interfaces that disappear into the work.',
  '',
  '#3a4a4a',
  'mancuniamoe@gmail.com'
) on conflict do nothing;

insert into portfolio_social (label, handle, url, sort_order) values
  ('GitHub',   'eoseim',      '#', 0),
  ('LinkedIn', 'in/eoseim',   '#', 1),
  ('Read.cv',  'eoseim',      '#', 2)
on conflict do nothing;

insert into portfolio_skills (group_name, skill_name, sort_order) values
  ('Languages', 'TypeScript', 0), ('Languages', 'Python', 1), ('Languages', 'Go', 2),
  ('Languages', 'SQL', 3),        ('Languages', 'Rust', 4),
  ('Frontend',  'React', 0),      ('Frontend', 'Next.js', 1), ('Frontend', 'Svelte', 2),
  ('Frontend',  'Tailwind', 3),   ('Frontend', 'Framer Motion', 4), ('Frontend', 'Vite', 5),
  ('Backend',   'Node.js', 0),    ('Backend', 'FastAPI', 1),  ('Backend', 'PostgreSQL', 2),
  ('Backend',   'Redis', 3),      ('Backend', 'GraphQL', 4),  ('Backend', 'tRPC', 5),
  ('Infra',     'Docker', 0),     ('Infra', 'AWS', 1),        ('Infra', 'Terraform', 2),
  ('Infra',     'GitHub Actions', 3), ('Infra', 'Cloudflare', 4),
  ('Practice',  'Systems design', 0), ('Practice', 'API design', 1),
  ('Practice',  'Design engineering', 2), ('Practice', 'Code review', 3),
  ('Practice',  'Mentoring', 4)
on conflict do nothing;

insert into portfolio_projects (id, initials, tone, title, role, year, summary, stack, status, live_url, repo_url, sort_order) values
  ('p1',  'LD', '#3a4a3f', 'Ledgerly',      'Tech lead',          '2025', 'Multi-tenant accounting ledger with double-entry semantics and an audit-grade event log.',         array['TypeScript','PostgreSQL','Next.js','tRPC','Stripe'],           'Shipping',    'https://ledgerly.example.com',   'https://github.com/eoseim/ledgerly', 0),
  ('p2',  'OR', '#5b3f4a', 'Orbit Routes',  'Founding engineer',  '2025', 'Logistics planner for last-mile delivery teams. Real-time route optimization with offline-first PWAs.', array['React','Go','Mapbox','Redis','AWS'],                           'Active',      'https://orbitroutes.example.com', '', 1),
  ('p3',  'FN', '#3d4a5b', 'Fern Notes',    'Solo build',         '2024', 'Local-first markdown editor with bidirectional links, sync over CRDTs, end-to-end encryption.',   array['Rust','Tauri','Yjs','Svelte'],                                 'Beta',        'https://fernnotes.example.com',  'https://github.com/eoseim/fern', 2),
  ('p4',  'PA', '#4a463a', 'Paloma API',    'Backend engineer',   '2024', 'Public REST/GraphQL gateway for a fintech disbursement platform. SOC2-aligned audit trails.',     array['Python','FastAPI','PostgreSQL','Terraform'],                   'Production',  'https://docs.paloma.example.com', '', 3),
  ('p5',  'QV', '#3a4a4a', 'Quietveil',     'Design engineer',    '2024', 'Privacy-first analytics for indie SaaS. No cookies; first-party only; sub-3kb script.',          array['TypeScript','Cloudflare Workers','ClickHouse'],               'Shipping',    'https://quietveil.example.com',  'https://github.com/eoseim/quietveil', 4),
  ('p6',  'MS', '#4a3a4a', 'Marsh Studio',  'Frontend lead',      '2023', 'Browser-based vector editor with collaborative cursors and a custom rendering pipeline.',         array['WebGL','React','Yjs','WebAssembly'],                           'Acquired',    '', '', 5),
  ('p7',  'TR', '#5b4a3a', 'Tremor',        'Maintainer',         '2023', 'Open-source feature-flag library for Node and edge runtimes. 4k★ on GitHub.',                   array['TypeScript','Node.js','Edge'],                                 'OSS',         'https://tremor.example.com',     'https://github.com/eoseim/tremor', 6),
  ('p8',  'HV', '#3a4a5b', 'Harvest CLI',   'Solo build',         '2023', 'Terminal companion for self-hosted services — health checks, deploys, log tailing.',             array['Go','Bubble Tea'],                                             'OSS',         '', 'https://github.com/eoseim/harvest', 7),
  ('p9',  'AC', '#4a3a3a', 'Atlas Charter', 'Contractor',         '2022', 'Geospatial dashboards for a maritime insurance underwriter. WebGL heatmaps over fleet AIS data.', array['React','Mapbox GL','Python'],                                  'Delivered',   '', '', 8),
  ('p10', 'SF', '#3a5b4a', 'Sift',          'Co-founder',         '2022', 'Email triage tool that learned a writer''s response patterns. Sold to a portfolio company in 2023.', array['Python','React','Postgres'],                                 'Acquired',    '', '', 9),
  ('p11', 'LM', '#5b5b3a', 'Lumen Meter',   'Engineer',           '2021', 'IoT energy meter dashboard for off-grid solar installations across West Africa.',                array['Vue','Django','MQTT'],                                         'Field',       'https://lumen.example.com', '', 10)
on conflict do nothing;

insert into portfolio_experience (id, company, role, period, note, sort_order) values
  ('e1', 'Ledgerly',     'Tech lead',         '2024 — Now',  'Leading platform engineering for a Series A accounting startup. Five engineers.',                           0),
  ('e2', 'Marsh Studio', 'Frontend lead',     '2022 — 2024', 'Owned the rendering pipeline and collaborative editing layer until acquisition.',                          1),
  ('e3', 'Independent',  'Contract engineer', '2020 — 2022', 'Shipped products for fintech, logistics and maritime clients across three continents.',                     2),
  ('e4', 'Paystack',     'Software engineer', '2018 — 2020', 'Payments infrastructure on the disbursements team. First job out of university.',                          3)
on conflict do nothing;

insert into portfolio_writing (id, title, date_display, read_time, sort_order) values
  ('w1', 'On building durable interfaces',             'Mar 2026', '8 min',  0),
  ('w2', 'Local-first is a stance, not a stack',        'Jan 2026', '12 min', 1),
  ('w3', 'Why I rewrote my editor in Rust (and back)',  'Sep 2025', '15 min', 2),
  ('w4', 'Notes on shipping calmly',                   'Jun 2025', '5 min',  3)
on conflict do nothing;

