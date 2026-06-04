-- Western Steel SOP Quiz, Supabase leaderboard table.
-- Run this in Supabase Dashboard, SQL Editor, New query, then Run.
-- This creates a separate `sop_quiz_scores` table so the SOP quiz has
-- its own leaderboard, independent from the Project Spotlights quiz.

create table public.sop_quiz_scores (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  email       text,
  score       integer     not null check (score >= 0),
  total       integer     not null check (total > 0),
  created_at  timestamptz not null default now()
);

create index sop_quiz_scores_created_at_idx
  on public.sop_quiz_scores (created_at desc);

alter table public.sop_quiz_scores enable row level security;

create policy "anyone can insert sop scores"
  on public.sop_quiz_scores
  for insert
  to anon
  with check (true);

create policy "anyone can read sop scores"
  on public.sop_quiz_scores
  for select
  to anon
  using (true);
