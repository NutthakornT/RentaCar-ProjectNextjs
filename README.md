# DriveLux — Car Rental MVP

A polished car-rental frontend for a **single rental company** (one admin, many
customers — not a marketplace). Built with Next.js (App Router), Tailwind CSS
v4, and Supabase Auth. UI runs on mock data until the backend is connected.

> **Stack note:** this repo pins **Next.js 16**, which has breaking changes vs.
> older versions. See `AGENTS.md` — read `node_modules/next/dist/docs/` before
> changing framework-level code.

## Getting started

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
```

## Environment

Copy `.env.local.example` → `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co   # base URL, no path
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon or publishable key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000                   # used by metadata/sitemap
```

Auth uses GitHub OAuth + email/password. To enable GitHub sign-in, create a
GitHub OAuth App (callback `https://<project-ref>.supabase.co/auth/v1/callback`),
enable the GitHub provider in Supabase, and add `http://localhost:3000/auth/callback`
to the Supabase redirect URLs.

## Pages

**Public** — `/` (landing), `/cars` (listing + filters), `/cars/[id]` (detail +
booking widget), `/login`, `/signup`
**Auth-gated** — `/booking` (checkout + confirmation), `/profile`
**Admin** — `/admin`, `/admin/cars`, `/admin/bookings`, `/admin/users`

Route access is enforced in `src/lib/supabase/proxy.js`: everything is public
except `/booking`, `/profile`, and `/admin`, which require a session (admin role
checks come with the backend).

## Project structure

```
src/
  app/
    (site)/          # public shell (Navbar + Footer) — home, cars, booking, auth, profile
    admin/           # admin console — own sidebar shell, mock-data tables
    auth/            # OAuth callback route + sign-out server action
    opengraph-image.jsx, sitemap.js, robots.js
  components/
    ui/              # design-system primitives (Button, Card, Field, Rating, icons, …)
    layout/          # Navbar, Footer, Logo
    home/            # landing sections (Hero, SearchForm, FeaturedCars, …)
    cars/            # CarCard, FilterSidebar, Pagination, CarGallery, BookingCard
    booking/ reviews/ admin/
  services/          # data-access layer (async, mock-backed — swap for Supabase later)
  lib/
    mock/            # cars, bookings, users, testimonials (shapes mirror the DB plan)
    supabase/        # browser/server clients + proxy session refresh
    utils.js, constants.js
  types/             # JSDoc typedefs for the data shapes
```

## Design system

Tailwind v4 theme tokens live in `src/app/globals.css`:
primary `#0F4C81`, accent `#F6C445`, background `#F8FAFC`, plus rounded radii and
soft shadows. Components are hand-built (no component library) for full control.

## From mock data to Supabase

Every read goes through `src/services/*`, which currently returns data from
`src/lib/mock/*`. The planned tables are `profiles`, `cars`, and `bookings`
(shapes documented in `src/types/index.js`). To go live, replace the bodies of
the service functions with Supabase queries — call sites don't change. Admin
write actions (add/edit/delete) are scaffolded and disabled until then.

## Car images

Cars render a designed gradient placeholder (`CarThumb`) so the UI is
self-contained and always renders. Each car keeps an `image_url`; drop real
photos at those paths (or switch `CarThumb` to `next/image`) when available.
