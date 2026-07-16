-- ============================================================
-- Cliché Marketing Digital — Prospects Table
-- Run this in your Supabase SQL editor
-- ============================================================

create extension if not exists "pgcrypto";

create type lead_status as enum (
  'new',
  'contacted',
  'qualified',
  'proposal_sent',
  'won',
  'lost',
  'nurturing'
);

create type lead_origin as enum (
  'nfc',
  'qr',
  'web',
  'referral',
  'social',
  'other'
);

create table if not exists prospects (
  id               uuid primary key default gen_random_uuid(),

  -- Contact info
  name             text not null check (char_length(name) >= 2),
  business         text not null check (char_length(business) >= 2),
  whatsapp         text not null,
  email            text not null,

  -- Consent & legal
  consent          boolean not null default false,
  consent_text     text,

  -- Lead metadata
  status           lead_status not null default 'new',
  origin           lead_origin not null default 'nfc',
  notes            text,

  -- Delivery tracking
  catalog_sent     boolean not null default false,
  catalog_sent_at  timestamptz,
  whatsapp_sent    boolean not null default false,
  whatsapp_sent_at timestamptz,

  -- Analytics & attribution
  ip_hash          text,
  user_agent       text,
  utm_source       text,
  utm_medium       text,
  utm_campaign     text,
  utm_content      text,
  utm_term         text,
  referrer         text,

  -- Timestamps
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Prevent duplicate emails
create unique index if not exists prospects_email_unique on prospects (lower(email));

-- Indexes for common queries
create index if not exists prospects_status_idx on prospects (status);
create index if not exists prospects_origin_idx on prospects (origin);
create index if not exists prospects_created_at_idx on prospects (created_at desc);
create index if not exists prospects_whatsapp_idx on prospects (whatsapp);

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger prospects_updated_at
  before update on prospects
  for each row
  execute procedure update_updated_at_column();

-- Row Level Security
alter table prospects enable row level security;

-- Service role has full access (used by the API)
create policy "service_role_all" on prospects
  for all
  using (true)
  with check (true);

-- Anon users can only INSERT (not read other records)
create policy "anon_insert_only" on prospects
  for insert
  to anon
  with check (consent = true);
