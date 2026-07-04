# ChaoRoad — Car Rental

ChaoRoad is a car-rental web app for a **single rental company** in **Bangkok**
(one admin, many customers — not a marketplace). Customers browse the fleet,
book a car for a date range, return it, and leave a review; the admin manages
cars, bookings, and returns from a dedicated console.

Built with **Next.js 16** (App Router), **Tailwind CSS v4**, and **Supabase**
(Postgres + Auth). Data is live from Supabase — not mock.

> **Stack note:** Next.js 16 has breaking changes vs. older versions. See
> `AGENTS.md` — read `node_modules/next/dist/docs/` before changing
> framework-level code.

## What it does

- **Browse & book** — car catalog with filters, detail pages, and a date-based
  booking flow (no payment; pay at pick-up).
- **Auth** — GitHub OAuth + email/password via Supabase Auth.
- **Returns** — a customer requests a return; the admin confirms it, recording
  the actual return date and any late fee ($50/day past the due date), which
  closes out the booking.
- **Reviews** — customers review completed rentals; real reviews power the
  landing page and each car's star rating.
- **Admin console** — add / edit / delete cars (incl. availability), and confirm
  returns or delete bookings. `/admin` is gated to the admin role.

## Getting started

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
```

Copy `.env.local.example` → `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co   # base URL, no path
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon or publishable key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000                   # metadata/sitemap
```

Then, in the Supabase SQL Editor, run `supabase/schema.sql` to create the tables
and RLS policies, and promote your account to admin:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

For GitHub sign-in: create a GitHub OAuth App (callback
`https://<project-ref>.supabase.co/auth/v1/callback`), enable the GitHub provider
in Supabase, and add `http://localhost:3000/auth/callback` to the redirect URLs.

## Pages

**Public** — `/` (landing), `/cars` (listing + filters), `/cars/[id]` (detail +
booking widget), `/login`, `/signup`
**Auth-gated** — `/booking` (checkout + confirmation), `/profile` (bookings,
returns, reviews)
**Admin** — `/admin`, `/admin/cars`, `/admin/bookings`, `/admin/users`

Route access is enforced in `src/lib/supabase/proxy.js`: everything is public
except `/booking`, `/profile`, and `/admin` (session required); `/admin`
additionally requires the admin role.

## Data

Reads and writes go through `src/services/*` (Supabase queries; shapes are
documented in `src/types/index.js`). The database schema — tables `profiles`,
`cars`, `bookings`, `car_returns`, `reviews` plus RLS policies and triggers —
lives in `supabase/schema.sql`.

## Design system

Tailwind v4 theme tokens live in `src/app/globals.css`: a soft-pastel palette —
primary `#2F6FB0` (sky blue), accent `#F0A868` (peach), background `#FCF8DA`
(cream) — with rounded radii and soft shadows. Components are hand-built (no
component library) for full control.

## Project structure

```
src/
  app/
    (site)/          # public shell (Navbar + Footer) — home, cars, booking, auth, profile
    admin/           # admin console — own sidebar shell
    auth/            # OAuth callback route + sign-out server action
    opengraph-image.jsx, sitemap.js, robots.js
  components/        # ui/ primitives + feature folders (home, cars, booking, admin, layout)
  services/          # Supabase data-access layer (cars, bookings, returns, reviews)
  lib/supabase/      # browser/server clients + route-gating proxy
  types/             # JSDoc typedefs for the data shapes
supabase/schema.sql  # full DB schema + RLS
```
