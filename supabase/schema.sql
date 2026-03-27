-- Fomo App Schema
-- Run this in your Supabase SQL editor

-- Posts table
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  timer_minutes int not null check (timer_minutes in (5, 15, 60)),
  created_at timestamptz default now() not null,
  expires_at timestamptz not null,
  author_name text not null default 'Anonymous'
);

-- Saves table
create table if not exists public.saves (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  saved_at timestamptz default now() not null,
  unique(user_id, post_id)
);

-- Indexes
create index if not exists idx_posts_expires_at on public.posts(expires_at);
create index if not exists idx_posts_user_id on public.posts(user_id);
create index if not exists idx_saves_user_id on public.saves(user_id);
create index if not exists idx_saves_post_id on public.saves(post_id);

-- Enable RLS
alter table public.posts enable row level security;
alter table public.saves enable row level security;

-- Posts policies
create policy "Anyone can view posts" on public.posts
  for select using (true);

create policy "Authenticated users can create posts" on public.posts
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own posts" on public.posts
  for delete using (auth.uid() = user_id);

-- Saves policies
create policy "Anyone can view saves" on public.saves
  for select using (true);

create policy "Authenticated users can save posts" on public.saves
  for insert with check (auth.uid() = user_id);

create policy "Users can remove their own saves" on public.saves
  for delete using (auth.uid() = user_id);

-- View: post with save count (convenience)
create or replace view public.posts_with_saves as
select
  p.*,
  coalesce(s.save_count, 0) as save_count
from public.posts p
left join (
  select post_id, count(*) as save_count
  from public.saves
  group by post_id
) s on s.post_id = p.id;
