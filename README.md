This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), wired up with Supabase Auth (GitHub OAuth) and Tailwind CSS.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy the **Project URL** and **anon public key** into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. Create a GitHub OAuth App at [github.com/settings/developers](https://github.com/settings/developers):
   - Homepage URL: `http://localhost:3000` (add your production URL later)
   - Authorization callback URL: `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. In Supabase, go to **Authentication → Providers → GitHub**, enable it, and paste the GitHub OAuth App's **Client ID** and **Client Secret**.
5. In **Authentication → URL Configuration**, add `http://localhost:3000/auth/callback` (and your deployed equivalent) to **Redirect URLs**.

## How auth is wired up

- `src/lib/supabase/client.js` / `server.js` — browser and server Supabase clients (`@supabase/ssr`).
- `src/proxy.js` + `src/lib/supabase/proxy.js` — refreshes the session on every request and redirects signed-out users to `/login` (everything under `/login` and `/auth` stays public).
- `src/app/login` — GitHub sign-in button.
- `src/app/auth/callback/route.js` — exchanges the OAuth code for a session.
- `src/app/auth/actions.js` — sign-out server action.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
