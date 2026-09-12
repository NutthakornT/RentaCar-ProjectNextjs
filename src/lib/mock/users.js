/**
 * Mock customer profiles, shaped like the `profiles` table plus UI-only
 * fields (email, joined). Unused now that Supabase is wired up.
 * @typedef {import("@/types").UserProfile} UserProfile
 * @type {UserProfile[]}
 */
export const users = [
  {
    id: "u_1001",
    name: "Sophia Nguyen",
    email: "sophia.nguyen@example.com",
    avatar_url: null,
    role: "customer",
    joined: "2025-11-02",
    bookings_count: 4,
  },
  {
    id: "u_1002",
    name: "Marcus Bennett",
    email: "marcus.bennett@example.com",
    avatar_url: null,
    role: "customer",
    joined: "2026-01-14",
    bookings_count: 2,
  },
  {
    id: "u_1003",
    name: "Elena Rossi",
    email: "elena.rossi@example.com",
    avatar_url: null,
    role: "customer",
    joined: "2025-08-21",
    bookings_count: 6,
  },
  {
    id: "u_1004",
    name: "David Okafor",
    email: "david.okafor@example.com",
    avatar_url: null,
    role: "customer",
    joined: "2026-03-09",
    bookings_count: 1,
  },
  {
    id: "u_1005",
    name: "Hannah Schmidt",
    email: "hannah.schmidt@example.com",
    avatar_url: null,
    role: "customer",
    joined: "2026-05-30",
    bookings_count: 3,
  },
  {
    id: "u_1006",
    name: "James Carter",
    email: "james.carter@example.com",
    avatar_url: null,
    role: "customer",
    joined: "2026-06-18",
    bookings_count: 2,
  },
];
