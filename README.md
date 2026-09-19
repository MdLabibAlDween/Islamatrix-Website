# Islamatrix — Halal Business Solutions Website

Production website for **Islamatrix**, a Halal digital growth agency for Muslim businesses.
Built with Next.js (App Router), Supabase (content + admin), and EmailJS (contact form).
The site renders from Supabase when configured and falls back to built-in content otherwise,
so it works out of the box and lights up fully once env vars are set.

Live: https://labibaldween.com

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Supabase (Postgres, Auth, Storage) via `@supabase/ssr` / `@supabase/supabase-js`
- EmailJS (browser-side contact form delivery, no backend inbox)

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in real values (never commit .env.local)
npm run dev                  # http://localhost:3000
```

## Environment variables

All variables are documented in `.env.example`. Copy it to `.env.local` for local dev,
and set the same values in your hosting provider's dashboard for production.

| Variable | Where | Required | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | browser | yes | Canonical URL. Used for metadata, sitemap, robots. |
| `NEXT_PUBLIC_SUPABASE_URL` | browser | yes | Supabase Dashboard → Settings → API. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser | yes | Public anon key (RLS `public read` policies apply). |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | for seed/audit | Bypasses RLS. Never prefix with `NEXT_PUBLIC_`, never use in browser code. |
| `NEXT_PUBLIC_CALENDLY_URL` | browser | no | Booking link fallback. Overridable in Admin → `calendly_url`. |
| `NEXT_PUBLIC_AGENCY_NAME` | browser | no | Brand fallback. Overridable in Admin → `agency_name`. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | browser | no | Contact fallback. Overridable in Admin → `contact_email`. (`CONTACT_EMAIL` also accepted as a legacy alias.) |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | browser | for contact form | EmailJS dashboard values. Without them the form shows a `mailto:` fallback. |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | browser | for contact form | Template vars: `from_name, from_email, reply_to, business, service, budget, timeline, message`. |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | browser | for contact form | Public key — safe for the browser. |

## Supabase setup (one time)

1. Create an empty Supabase project.
2. Run `supabase/schema.sql` once in Dashboard → SQL Editor (creates tables, public-read RLS, storage buckets).
3. Put the URL + anon key + service-role key in `.env.local`.
4. Seed the starter content:
   ```bash
   npm run seed
   ```
5. Create your admin user in Supabase → Authentication → Users, then sign in at `/admin`.
6. Verify content sync anytime with:
   ```bash
   npm run audit        # read-only check
   npm run audit -- --fix  # repair content gaps only (your edits are safe)
   ```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server. |
| `npm run build` | Production build (used by all hosts). |
| `npm run start` | Serve a production build locally. |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript). |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run seed` | Seed Supabase with starter content (needs `SUPABASE_SERVICE_ROLE_KEY`). |
| `npm run audit` | Verify Supabase content matches the site's expectations. |

## Deploy

Any Next.js host works. Vercel example:

1. Push this repo to GitHub (see below).
2. Import it in Vercel → set the env vars from the table above (production values).
3. Deploy — build command `npm run build`, output is handled by Next automatically.
4. Set the same `NEXT_PUBLIC_SITE_URL` you deploy to so canonical URLs, sitemap, and robots are correct.

## Project structure

```
src/
  app/            # routes: /, /about, /services/[slug], /privacy, /terms, /admin, robots, sitemap
  components/     # UI sections (Hero, BookingSection, ContactForm, Pricing, …)
  lib/            # site defaults, Supabase clients, content layer + fallbacks, theme, types
supabase/
  schema.sql      # one-time DB setup (tables + RLS + storage)
scripts/
  seed.mjs        # starter content seed (service-role, local only)
  audit.mjs       # content sync checker
public/           # logo.png, Favicon.png + static assets
```

Content precedence: **Supabase `site_settings` → `NEXT_PUBLIC_*` env → built-in defaults** in
`src/lib/site.ts`, with hardcoded fallbacks in `src/lib/fallback-data.ts` so pages never go blank.

## Security notes

- `.env.local` (real keys) is git-ignored and never committed. Only `.env.example` (placeholders) is tracked.
- `SUPABASE_SERVICE_ROLE_KEY` is imported only through `src/lib/supabase-server.ts`, which has a
  `server-only` guard so a client-bundle leak fails the build instead of shipping.
- Public Supabase reads go through RLS `public read` (SELECT-only) policies; writes require an
  authenticated admin session. Contact messages are delivered via EmailJS and are not stored in the DB.
- Production headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`) are set in `next.config.ts`, and `X-Powered-By` is disabled.

## Contributing / License

Private project — all rights reserved unless a `LICENSE` file is added.
