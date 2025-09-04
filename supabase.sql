-- Schema and function definitions for Yelp Review Prize Tracker

-- Enable required extensions
create extension if not exists "uuid-ossp" with schema extensions;

-- Table: staff
create table if not exists public.staff (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  active boolean not null default true,
  avatar_url text,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table: reviews
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  staff_id uuid references public.staff(id) on delete set null,
  review_date date not null default current_date,
  yelp_link text,
  notes text,
  recorded_by uuid,
  inserted_at timestamptz not null default now()
);

-- Table: prizes
create table if not exists public.prizes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  quantity integer not null default 0,
  active boolean not null default true,
  "order" integer not null default 0,
  inserted_at timestamptz not null default now()
);

-- Table: redemptions
create table if not exists public.redemptions (
  id uuid primary key default uuid_generate_v4(),
  review_id uuid references public.reviews(id) on delete cascade,
  prize_id uuid references public.prizes(id) on delete set null,
  redeemed_by uuid,
  redeemed_at timestamptz,
  inserted_at timestamptz not null default now()
);

-- Function: get_leaderboard(period text)
-- Returns review counts per staff for different time periods
create or replace function public.get_leaderboard(period text)
returns table (staff_id uuid, full_name text, review_count bigint) language plpgsql as $$
begin
  if period = 'this_week' then
    return query
    select s.id, s.full_name, count(r.id) as review_count
    from public.staff s
    left join public.reviews r on r.staff_id = s.id and r.review_date >= date_trunc('week', current_date)
    where s.active = true
    group by s.id
    order by review_count desc, s.full_name;
  elsif period = 'this_month' then
    return query
    select s.id, s.full_name, count(r.id) as review_count
    from public.staff s
    left join public.reviews r on r.staff_id = s.id and r.review_date >= date_trunc('month', current_date)
    where s.active = true
    group by s.id
    order by review_count desc, s.full_name;
  else
    return query
    select s.id, s.full_name, count(r.id) as review_count
    from public.staff s
    left join public.reviews r on r.staff_id = s.id
    where s.active = true
    group by s.id
    order by review_count desc, s.full_name;
  end if;
end;
$$;

-- RLS: enable row level security
alter table public.staff enable row level security;
alter table public.reviews enable row level security;
alter table public.prizes enable row level security;
alter table public.redemptions enable row level security;

-- Public read access for staff and prizes
create policy if not exists "Public read staff" on public.staff
  for select using (true);
create policy if not exists "Public read prizes" on public.prizes
  for select using (true);

-- Managers and admins can manage staff/prizes/reviews/redemptions
-- Use user metadata role stored in the JWT; assume claim is stored at auth.jwt()["role"]

create or replace function public.has_role(required_role text)
returns boolean language sql as $$
  select coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '') in (required_role, 'admin');
$$;

-- Staff modifications
create policy if not exists "Staff writes by manager" on public.staff
  for all using (public.has_role('manager')) with check (public.has_role('manager'));

-- Reviews modifications
create policy if not exists "Reviews write manager" on public.reviews
  for all using (public.has_role('manager')) with check (public.has_role('manager'));

-- Prizes modifications
create policy if not exists "Prizes write manager" on public.prizes
  for all using (public.has_role('manager')) with check (public.has_role('manager'));

-- Redemptions modifications
create policy if not exists "Redemptions write manager" on public.redemptions
  for all using (public.has_role('manager')) with check (public.has_role('manager'));

-- Grant minimal privileges to anon and authenticated roles
grant usage on schema public to anon, authenticated;
grant select on public.staff, public.prizes to anon, authenticated;
grant insert, update, delete, select on public.staff, public.reviews, public.prizes, public.redemptions to authenticated;

-- Create storage bucket for staff avatars in Supabase dashboard manually or via CLI:
-- Dashboard → Storage → Create bucket → Name: staff-avatars → Public: true
