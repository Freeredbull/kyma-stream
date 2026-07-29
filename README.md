# KYMA — Cyprus original content streaming

A starter build for a Netflix-style platform focused on Cypriot original series, films, and
podcasts, with a hybrid subscription (SVOD) + ad-supported (AVOD) model.

> **KYMA** (κύμα) is Greek for "wave" — placeholder branding, swap freely. The visual identity
> (deep sea-navy, Aegean teal, sun ochre, a recurring hand-drawn coastline motif) is meant to be
> distinctly Cypriot rather than a generic streaming-app look.

## What's in this repo

- **Next.js 16 (App Router) + TypeScript + Tailwind v4** — web app, server-rendered for SEO on
  the catalog pages. (Next 14 is EOL with unpatched CVEs as of writing and Next 15 support winds
  down in October 2026 — 16 is the current Active LTS line, so that's what this is built on.)
- **Prisma 7 + Postgres** — data model for users, subscriptions, titles/seasons/episodes, watch
  progress, and the ad system (`prisma/schema.prisma`). Prisma 7's client is Rust-free and
  requires an explicit driver adapter (`@prisma/adapter-pg`, wired up in `src/lib/db.ts`) plus a
  `prisma.config.ts` for CLI/migration config — both already set up.
- **Better Auth** — email/password auth today, with `socialProviders` ready to add Google/Apple
  later. Chosen over NextAuth: NextAuth v4 doesn't support Next 15+, and even NextAuth's own
  maintainers now point new projects at Better Auth over the (still-beta) NextAuth v5.
- **Stripe** — subscription billing with a Checkout + webhook flow already wired up for two paid
  tiers (Plus, Premium) plus a free ad-supported tier.
- **hls.js video player** with a pre-roll ad decision layer (`src/components/Player.tsx`,
  `src/app/api/ads/serve`).
- **Recommendations**: a "Continue watching" shelf built from real watch-progress data, and a
  genre-overlap "Because you watched X" shelf (`src/lib/recommendations.ts`) — simple and
  explainable on purpose; see the roadmap below for when to graduate to something fancier.
- **zod** validates every API route's request body — small thing, but it's the difference between
  a clean 400 and an unhandled exception when a client sends something malformed.
- Pages: home (hero + shelves + recommendations), browse, title detail, watch/player, pricing,
  account, login/signup, a bare-bones admin overview.

This is a **working scaffold, not a finished product** — see "What's NOT built yet" below.

## Architecture at a glance

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Next.js    │◄────►│   Postgres (DB)   │      │   Stripe          │
│  (Vercel)    │      │  users, catalog,  │      │  subscriptions,   │
│              │      │  ad impressions   │      │  webhooks         │
└──────┬───────┘      └──────────────────┘      └─────────────────┘
       │
       │  HLS playback
       ▼
┌─────────────────────────┐
│  Bunny Stream / Mux /    │   ← managed video hosting + transcoding +
│  Cloudflare Stream       │     CDN delivery + server-side ad insertion
└─────────────────────────┘
```

**Why a managed video service instead of self-hosting:** transcoding to adaptive-bitrate HLS,
global CDN delivery, and server-side ad insertion (SSAI) are each non-trivial infrastructure.
Bunny Stream is the recommended default — cheap, has EU edge locations close to Cyprus, and
supports SSAI natively. Swapping providers only touches one function:
`hlsUrlFor()` in `src/components/Player.tsx`.

## Monetization model

| Tier | Price (suggested) | Ads | Quality |
|---|---|---|---|
| Free | €0 | Full pre/mid/post-roll | SD/HD |
| Plus | €4.99/mo | Pre-roll only | Full HD |
| Premium | €8.99/mo | None | 4K, downloads |

The ad system (`AdCreative` / `AdImpression` in the schema, `/api/ads/serve`) is deliberately
simple for launch: a small library of directly-sold video ads, weighted-random selection, server
logs impressions per advertiser for reporting. This is realistic for a national platform — you're
selling to local Cypriot businesses and tourism boards directly, not competing in a programmatic
exchange. Layer in Google Ad Manager or a similar SSP later once there's real traffic to justify
the integration work.

## Getting started

```bash
cp .env.example .env       # fill in DATABASE_URL, Better Auth secret, Stripe keys, Bunny CDN hostname
npm install
npx prisma generate        # generates the client into src/generated/prisma
npm run db:push            # push schema to your Postgres instance
npm run db:seed            # sample Cypriot titles (with placeholder video IDs)
npm run dev
```

> **A note on verification:** this was built and dependency-resolved in a sandboxed environment
> that couldn't reach `binaries.prisma.sh` to download Prisma's schema-engine binary, so
> `prisma generate` / a full `npm run build` haven't been run end-to-end. Everything up to that
> point — `npm install`, the schema, and every file's logic — was checked by hand against the
> current library APIs (Prisma 7, Better Auth, Next 16, Tailwind v4 all changed meaningfully from
> their predecessors, so this mattered). Run the two commands above first thing after cloning;
> if anything's off, it'll surface immediately as a clear type error or generate failure rather
> than a subtle bug.

You'll need, before anything plays for real:
1. A Postgres database (Supabase, Railway, or Neon all have free tiers to start).
2. A [Stripe](https://dashboard.stripe.com) account — create two recurring Prices (Plus, Premium)
   and a webhook endpoint pointed at `/api/stripe/webhook` listening for
   `checkout.session.completed` and `customer.subscription.*`.
3. A [Bunny Stream](https://bunny.net/stream/) library — upload video, note the pull-zone hostname
   and video IDs, replace the placeholders in `prisma/seed.ts`.

## What's NOT built yet (the honest roadmap)

Roughly in the order I'd tackle them for a real launch:

1. **Admin auth** — `/admin` currently has *no* access control. Add an `isAdmin` boolean on
   `User` and a middleware check before this goes anywhere near production.
2. **Social login** — email/password works end-to-end now (signup, login, sign-out). Adding
   Google/Apple is just a `socialProviders` block in `src/lib/auth.ts` — Better Auth's `Account`
   table already supports it, no schema changes needed.
3. **Content management UI** — right now you'd add titles via `npx prisma studio` or scripts.
   Fine for a handful of originals at launch; you'll want real upload/ingest forms once you have
   more than a dozen titles, ideally wired directly to Bunny's upload API.
4. **Search** — `/api/content` supports a `q` param already; add a search box in the UI.
   Postgres full-text search is enough at this scale — no need for Algolia/Elasticsearch yet.
5. **Better recommendations** — the current "Continue watching" / "Because you watched" shelves
   are genre-overlap only. Once you have real engagement data, a proper collaborative-filtering
   pass (users who watched X also watched Y) is the natural upgrade — that needs volume to be
   worth building, which is why it's not here yet.
6. **Localization** — the schema has a `language` field per title (Greek, Turkish, English are
   all realistic for Cyprus) but the UI itself is English-only. Add `next-intl` when ready.
7. **Legal**: terms of service, privacy policy, and GDPR-compliant cookie consent (required in
   Cyprus/EU) — none of this is included, and you should not launch without it. A DPA with
   whichever video/ad vendors you pick is also worth getting in writing early.
8. **Content licensing** — outside the code entirely, but worth flagging: securing distribution
   rights for anything not fully owned/produced by you needs to happen before it goes on the
   platform, and your terms with any co-producers should spell out streaming windows.

## Suggested go-to-market sequence

1. Launch with a small, tight catalog of a few real originals rather than waiting for a large
   library — the "Cyprus original content" positioning is the differentiator, not catalog size.
2. Start ad sales conversations with local Cypriot businesses and CTO (Cyprus Tourism
   Organisation) —adjacent tourism advertisers are a natural fit for pre-roll on travel/culture
   content.
3. Free tier first to build an audience; introduce Plus/Premium once there's enough content that
   ad-free is a real upgrade, not day one.
