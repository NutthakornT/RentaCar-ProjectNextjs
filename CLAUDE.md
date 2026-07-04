@AGENTS.md

# CLAUDE.md

# Project

Build a Car Rental MVP.

Goal: deliver a polished frontend in 2 days.

Prioritize UI, speed, clean architecture, and reusable components.

---

# Stack

- Next.js (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- Supabase
- Supabase Auth
- PostgreSQL
- Vercel

---

# Priority

1. Frontend
2. Auth
3. Database
4. Admin CRUD

Until backend exists, use mock data.

---

# Product

Single rental company.

NOT a marketplace.

There is:

- 1 admin
- many customers

Users can only rent cars.

Skip every feature related to multiple vendors.

---

# Pages

Public

- /
- /cars
- /cars/[id]
- /booking
- /login
- /signup
- /profile

Admin

- /admin
- /admin/cars
- /admin/bookings
- /admin/users

Admin pages should be scaffolded now.
Backend comes later.

---

# Landing Page

Sections

1. Hero
2. Search
3. Featured Cars
4. Why Choose Us
5. Testimonials
6. Footer

Keep the same layout as the reference.

Improve the visuals.

---

# Cars

Card contains

- image
- name
- type
- transmission
- fuel
- seats
- price/day
- rating
- CTA

Car Detail

- gallery
- specifications
- description
- features
- rental policy
- booking card
- related cars

---

# Booking

Simple flow

Landing

↓

Cars

↓

Car Detail

↓

Booking

↓

Login (if needed)

↓

Confirmation

No payment.

---

# Authentication

Supabase Auth

Providers

- Email
- GitHub

Frontend first.

---

# Database

Prepare tables only.

profiles

- id
- name
- avatar_url

cars

- id
- name
- brand
- type
- price_per_day
- description
- transmission
- fuel
- seats
- image_url
- available

bookings

- id
- user_id
- car_id
- pickup_date
- return_date
- total_price
- status

---

# Folder Structure

app/

components/

lib/

hooks/

services/

types/

public/

Use feature-based folders when appropriate.

---

# Mock Data

Store in

lib/mock/

Use until Supabase is connected.

---

# Design

Reference layout stays the same.

Modernize it.

Style

- premium
- spacious
- rounded
- soft shadows
- subtle gradients
- smooth hover
- responsive

Inspired by

- Apple
- Airbnb
- Tesla

Primary

#0F4C81

Accent

#F6C445

Background

#F8FAFC

---

# Components

Create reusable components.

Examples

- Navbar
- Hero
- SearchForm
- CarCard
- FilterSidebar
- Pagination
- BookingSummary
- ReviewCard
- Footer
- Skeleton
- EmptyState

Avoid duplicated UI.

---

# Skip

Do NOT build

- payment
- email
- SMS
- maps
- coupons
- live availability
- notifications
- reviews
- wishlist
- analytics
- multi-language
- multi-vendor
- chat

Use placeholders if needed.

---

# SEO

Prepare

- metadata
- OpenGraph
- favicon

---

# Rules

- Prefer Server Components.
- Use Client Components only when required.
- Keep components small.
- Avoid unnecessary abstraction.
- Keep files easy to read.
- Use mock data before backend.
- Make the UI production-quality before implementing features.

When choosing between adding features or improving the UI, always improve the UI.
