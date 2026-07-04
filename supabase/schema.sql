-- ============================================================
-- DriveLux — Supabase schema
-- Run once in Supabase Dashboard → SQL Editor → New query
-- Safe to re-run: tables/policies/triggers are dropped/recreated idempotently.
--
-- Tables: profiles, cars, bookings, reviews, car_returns
-- ============================================================

create extension if not exists pgcrypto; -- for gen_random_uuid()

-- ------------------------------------------------------------
-- profiles — one admin, many customers (created automatically on sign-up)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text,
  avatar_url text,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per authenticated user; created automatically on sign-up.';

-- ------------------------------------------------------------
-- cars — rental fleet inventory
-- id is a readable slug (e.g. "tesla-model-3"), matching the app's /cars/[id] routes
-- rating / reviews_count are kept in sync from the reviews table by a trigger below
-- ------------------------------------------------------------
create table if not exists public.cars (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  brand text not null,
  type text not null check (type in ('Sedan', 'SUV', 'Sports', 'Luxury', 'Electric', 'Compact')),
  price_per_day numeric(10, 2) not null check (price_per_day >= 0),
  description text,
  transmission text not null check (transmission in ('Automatic', 'Manual')),
  fuel text not null check (fuel in ('Petrol', 'Diesel', 'Electric', 'Hybrid')),
  seats integer not null check (seats > 0),
  doors integer,
  year integer,
  image_url text,
  available boolean not null default true,
  tagline text,
  features text[] not null default '{}',
  rating numeric(2, 1) not null default 0 check (rating between 0 and 5),
  reviews_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.cars is 'Rental fleet inventory.';

create index if not exists idx_cars_type on public.cars (type);
create index if not exists idx_cars_available on public.cars (available);

-- ------------------------------------------------------------
-- car_returns — one return record per booking
-- Customer requests a return; an admin confirms it (actual return date,
-- condition, and any late fee) and closes out the booking.
-- ------------------------------------------------------------
create table if not exists public.car_returns (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  status text not null default 'requested' check (status in ('requested', 'completed')),
  requested_at timestamptz not null default now(),
  returned_at timestamptz,
  condition_notes text,
  late_days integer not null default 0 check (late_days >= 0),
  late_fee numeric(10, 2) not null default 0 check (late_fee >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (booking_id)
);

comment on table public.car_returns is 'One return record per booking: requested by the customer, confirmed by an admin.';

create index if not exists idx_car_returns_status on public.car_returns (status);

-- ------------------------------------------------------------
-- bookings — customer rentals
-- ------------------------------------------------------------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  car_id text not null references public.cars (id) on delete restrict,
  pickup_date date not null,
  return_date date not null check (return_date > pickup_date),
  total_price numeric(10, 2) not null check (total_price >= 0),
  pickup_location text,
  phone text,
  notes text,
  status text not null default 'confirmed' check (status in ('confirmed', 'active', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.bookings is 'Customer rental bookings.';

create index if not exists idx_bookings_user_id on public.bookings (user_id);
create index if not exists idx_bookings_car_id on public.bookings (car_id);
create index if not exists idx_bookings_status on public.bookings (status);

-- ------------------------------------------------------------
-- reviews — real customer reviews (replaces hardcoded landing-page testimonials)
-- one review per booking; car_id is denormalized from the booking for easy querying
-- ------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  car_id text not null references public.cars (id) on delete cascade,
  booking_id uuid references public.bookings (id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  reviewer_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (booking_id)
);

comment on table public.reviews is 'Customer reviews for a car.';

create index if not exists idx_reviews_car_id on public.reviews (car_id);
create index if not exists idx_reviews_user_id on public.reviews (user_id);

-- ------------------------------------------------------------
-- updated_at maintenance
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_cars_updated_at on public.cars;
create trigger set_cars_updated_at
before update on public.cars
for each row execute function public.set_updated_at();

drop trigger if exists set_car_returns_updated_at on public.car_returns;
create trigger set_car_returns_updated_at
before update on public.car_returns
for each row execute function public.set_updated_at();

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

drop trigger if exists set_reviews_updated_at on public.reviews;
create trigger set_reviews_updated_at
before update on public.reviews
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- auto-create a profile row on sign-up (covers GitHub OAuth and email/password)
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'user_name',
      split_part(new.email, '@', 1)
    ),
    new.email,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- helper: is the current user an admin?
-- security definer so it can read profiles regardless of the caller's RLS
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ------------------------------------------------------------
-- guard: only an admin can change someone's role (blocks self-promotion)
-- ------------------------------------------------------------
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_profile_role on public.profiles;
create trigger guard_profile_role
before update on public.profiles
for each row execute function public.prevent_role_escalation();

-- ------------------------------------------------------------
-- keep cars.rating / cars.reviews_count in sync with the reviews table
-- ------------------------------------------------------------
create or replace function public.refresh_car_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_car_id text := coalesce(new.car_id, old.car_id);
begin
  update public.cars
  set
    rating = coalesce(
      (select round(avg(rating)::numeric, 1) from public.reviews where car_id = v_car_id),
      0
    ),
    reviews_count = (select count(*) from public.reviews where car_id = v_car_id)
  where id = v_car_id;
  return coalesce(new, old);
end;
$$;

drop trigger if exists refresh_car_rating_on_review on public.reviews;
create trigger refresh_car_rating_on_review
after insert or update or delete on public.reviews
for each row execute function public.refresh_car_rating();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.cars enable row level security;
alter table public.car_returns enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;

-- profiles: a user sees/edits their own row; admins see/edit all
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select"
on public.profiles for select
using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update"
on public.profiles for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

-- cars: readable by everyone, including signed-out visitors; writable by admins only
drop policy if exists "cars_select" on public.cars;
create policy "cars_select"
on public.cars for select
using (true);

drop policy if exists "cars_insert" on public.cars;
create policy "cars_insert"
on public.cars for insert
with check (public.is_admin());

drop policy if exists "cars_update" on public.cars;
create policy "cars_update"
on public.cars for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "cars_delete" on public.cars;
create policy "cars_delete"
on public.cars for delete
using (public.is_admin());

-- car_returns: a customer sees/creates returns for their own bookings; an
-- admin sees all and confirms (updates) or deletes them
drop policy if exists "car_returns_select" on public.car_returns;
create policy "car_returns_select"
on public.car_returns for select
using (
  public.is_admin()
  or exists (
    select 1 from public.bookings b
    where b.id = booking_id and b.user_id = auth.uid()
  )
);

drop policy if exists "car_returns_insert" on public.car_returns;
create policy "car_returns_insert"
on public.car_returns for insert
with check (
  public.is_admin()
  or exists (
    select 1 from public.bookings b
    where b.id = booking_id and b.user_id = auth.uid()
  )
);

drop policy if exists "car_returns_update" on public.car_returns;
create policy "car_returns_update"
on public.car_returns for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "car_returns_delete" on public.car_returns;
create policy "car_returns_delete"
on public.car_returns for delete
using (public.is_admin());

-- bookings: a user sees/creates/cancels their own; admins manage all
drop policy if exists "bookings_select" on public.bookings;
create policy "bookings_select"
on public.bookings for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "bookings_insert" on public.bookings;
create policy "bookings_insert"
on public.bookings for insert
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "bookings_update" on public.bookings;
create policy "bookings_update"
on public.bookings for update
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "bookings_delete" on public.bookings;
create policy "bookings_delete"
on public.bookings for delete
using (public.is_admin());

-- reviews: readable by everyone; a user creates/edits/deletes their own; admins manage all
-- insert requires the booking (if given) to actually belong to the reviewer
drop policy if exists "reviews_select" on public.reviews;
create policy "reviews_select"
on public.reviews for select
using (true);

drop policy if exists "reviews_insert" on public.reviews;
create policy "reviews_insert"
on public.reviews for insert
with check (
  auth.uid() = user_id
  and (
    booking_id is null
    or exists (
      select 1 from public.bookings b
      where b.id = booking_id and b.user_id = auth.uid()
    )
  )
);

drop policy if exists "reviews_update" on public.reviews;
create policy "reviews_update"
on public.reviews for update
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "reviews_delete" on public.reviews;
create policy "reviews_delete"
on public.reviews for delete
using (auth.uid() = user_id or public.is_admin());

-- ------------------------------------------------------------
-- grants (RLS above still restricts rows on top of these)
-- ------------------------------------------------------------
grant select on public.cars to anon, authenticated;
grant insert, update, delete on public.cars to authenticated;

grant select, insert, update, delete on public.car_returns to authenticated;

grant select, update on public.profiles to authenticated;

grant select, insert, update, delete on public.bookings to authenticated;

grant select on public.reviews to anon, authenticated;
grant insert, update, delete on public.reviews to authenticated;
