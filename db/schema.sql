-- ────────────────────────────────────────────────────────────
-- Portfolio DB schema (Postgres / Neon)
-- Run: node scripts/db-setup.mjs   (or paste into the Neon SQL editor)
-- ────────────────────────────────────────────────────────────

-- Profile (single row)
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

