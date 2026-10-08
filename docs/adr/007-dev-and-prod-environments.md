# ADR-007: Dev and prod environments from one Vercel project

## Status
Accepted (2026-10-08)

## Context
Every push to `main` redeployed the only deployment, the demo Kim and Vantage review. Unfinished work needs somewhere to land first. Vercel custom environments are a Pro feature; the project is on Hobby.

## Decision
- `dev` branch → Vercel **Preview** environment with `DEMO_MODE=true` (which also shows drafts), served at the stable alias `boatbossloans-five-dev.vercel.app`.
- `main` branch → **Production**, which stays the demo (`DEMO_MODE=true`, `noindex`) until the launch gates clear.
- Promotion is a PR from `dev` into `main`; CI runs on PRs into `main` only.
- The banner reads "Dev preview" on Preview deployments and "Demo preview" in production (`demoBannerLabel` in `lib/site.ts`).
- Dev leaves `NEXT_PUBLIC_SITE_URL` unset so canonicals point at prod; every Preview deployment sends `X-Robots-Tag: noindex`.
- Phase 3: one Neon project with a `main` branch (prod) and a `dev` branch, `DATABASE_URL` set per Vercel environment, migrations applied to dev first.

## Consequences
+ No code paths differ by environment beyond flags that already existed.
+ Moving to Vercel Pro later can move dev to a `dev` custom environment with its own variables, nothing else.
− Dev and PR previews share the Preview environment's general variables; anything dev-only must be scoped to branch `dev`.
− Preview URLs are public if Vercel Authentication is off; acceptable while the site holds no private data, revisit for the Phase 3 dashboard.
