-- Music access and tracking schema

-- 1) Access control for unlocking the 4 songs for selected emails
create table if not exists public.music_access (
  email text primary key,
  granted_at timestamptz default now(),
  granted_by text
);

alter table public.music_access enable row level security;

-- Users can read only their own access flag
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'music_access'
      and policyname = 'user can read own music access'
  ) then
    create policy "user can read own music access"
    on public.music_access for select
    using (email = auth.jwt()->>'email');
  end if;
end $$;

-- 2) Store generated magic links and dispatch metadata
create extension if not exists pgcrypto;

create table if not exists public.magic_link_dispatches (
  id uuid primary key default gen_random_uuid(),
  redirect_id text unique not null,
  email text not null,
  campaign text,
  action_link text not null,
  sent_at timestamptz default now(),
  click_count int default 0,
  first_clicked_at timestamptz,
  last_clicked_at timestamptz
);

alter table public.magic_link_dispatches enable row level security;

-- 3) Per-click logs for the short redirect
create table if not exists public.link_clicks (
  id bigserial primary key,
  redirect_id text not null references public.magic_link_dispatches(redirect_id),
  email text,
  campaign text,
  ip inet,
  user_agent text,
  clicked_at timestamptz default now()
);

alter table public.link_clicks enable row level security;

-- 4) Per-play logs for audio events (play/pause/ended)
create table if not exists public.music_plays (
  id bigserial primary key,
  user_id uuid,
  email text,
  track_src text not null,
  track_title text,
  action text not null check (action in ('play','pause','ended')),
  position_seconds numeric,
  duration_seconds numeric,
  rid text,
  campaign text,
  ip inet,
  user_agent text,
  created_at timestamptz default now()
);

alter table public.music_plays enable row level security;

-- Helpful indexes for reporting
create index if not exists idx_music_plays_email_created on public.music_plays(email, created_at desc);
create index if not exists idx_music_plays_track_created on public.music_plays(track_src, created_at desc);

-- Optional helper to increment counts
create or replace function public.increment_magic_link_click(rid_in text)
returns void language plpgsql as $$
begin
  update public.magic_link_dispatches
  set click_count = coalesce(click_count,0) + 1,
      first_clicked_at = coalesce(first_clicked_at, now()),
      last_clicked_at = now()
  where redirect_id = rid_in;
end;
$$;


