# boatbossloans.com

Education-first boat financing site for **Kim Sweers, The Boat Boss** (BOAT BOSS Enterprises). Buyers read the guide, then apply with Vantage Recreational Finance. BOAT BOSS is not a lender.

Requirements: `BOATBOSSLOANS SPEC.md` (v1.0, 2026-10-02). Decisions: [`docs/adr/`](docs/adr).

## Status: Phase 1 proof of concept (pre-launch, `noindex`)

Repo: [chasesweers/boatbossloans](https://github.com/chasesweers/boatbossloans), a personal account for now. Move it to a BOAT BOSS Enterprises account before launch (spec §2.1). Day-to-day work happens on the `dev` branch; `main` is prod (see Environments and deploys).

Built: Home, `/guide` + 5 launch guide drafts, `/about`, `/disclosures`, `/privacy`, `/terms`, `/newsletter`, 404, Apply wiring, newsletter signup, analytics events, sitemap, robots, `llms.txt`, JSON-LD, OG images, security headers.

Phase 2 so far: `/calculator` (boat cost of ownership, fully client-side, no loan fields by design).

Not yet: `/media` (Phase 2), `/admin` dashboard (Phase 3).

## Run it

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000 (drafts visible)
```

| Command | What it does |
|---|---|
| `npm test` | Unit + integration tests (Vitest). Includes the compliance scan of all content |
| `npm run test:e2e` | Builds and runs Playwright: golden paths, compliance, axe WCAG AA, noindex, layout, desktop + mobile |
| `npm run typecheck` | Route types + `tsc` |
| `npm run lint` | ESLint |
| `npm run build` | Production build (drafts excluded) |
| `npm run images` | Rebuild `public/images` and brand marks from `assets/source` |

## Environments and deploys

Two Vercel deployments from one project (see [ADR-007](docs/adr/007-dev-and-prod-environments.md)):

| | Local | Dev | Prod |
|---|---|---|---|
| Branch | working tree | `dev` | `main` |
| Vercel environment | none (`next dev`) | Preview, vars scoped to branch `dev` | Production |
| URL | localhost:3000 | boatbossloans-dev.vercel.app | boatbossloans.vercel.app (boatbossloans.com at launch) |
| `DEMO_MODE` | unset | `true` (banner says "Dev preview") | `true` until launch (banner says "Demo preview") |
| `SHOW_DRAFTS` | n/a (dev server always shows drafts) | `true` | ignored |
| `NEXT_PUBLIC_SITE_INDEXABLE` | unset | never set | `true` at launch only |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | unset (canonicals point at prod) | `https://boatbossloans.com` at launch |
| Plausible, Kit | unset | unset (or a Kit test form) | set at launch |
| Indexing | none | always `noindex` (`X-Robots-Tag` on every Preview) | `noindex` until launch |

**Workflow:** commit to `dev`, which redeploys the dev URL. When it's ready, open a PR from `dev` into `main`. CI runs on that PR, and merging redeploys prod. Never push to `main` directly. PRs into `dev` still get their own throwaway preview URLs.

### Vercel setup (one time)

1. vercel.com → Add New → Project → import `chasesweers/boatbossloans`. Framework preset: Next.js (auto). Production branch: `main`.
2. Settings → Domains → add `boatbossloans-dev.vercel.app` and assign it to Git branch `dev`.
3. Settings → Environment Variables:
   - Production: `DEMO_MODE` = `true`
   - Preview (all branches): `SHOW_DRAFTS` = `true`
   - Preview, branch `dev`: `DEMO_MODE` = `true`
4. Settings → Deployment Protection: turn off Vercel Authentication so Kim can open the dev URL without a Vercel login (it protects preview URLs by default). Every non-prod deployment is `noindex` and there are no secrets yet. Revisit once the Phase 3 dashboard exists.

Optional now, required at launch (Production only): `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `KIT_API_KEY` + `KIT_FORM_ID`. Without Kit keys the newsletter form shows its success message but sends nothing.

At launch: add `boatbossloans.com` to Production (optionally `dev.boatbossloans.com` to branch `dev`), set `NEXT_PUBLIC_SITE_INDEXABLE=true` and `NEXT_PUBLIC_SITE_URL` on Production, and remove `DEMO_MODE` from Production (it also switches itself off once the site is indexable).

### CI

`.github/workflows/ci.yml` runs on PRs into `main` (lint, typecheck, unit, build, E2E). Run it manually from the Actions tab with `e2e_base_url` set to a deployed URL (e.g. the dev URL) to test that site instead of a local build.

## Content

- Guide pages: `content/guide/<slug>.mdx`. Frontmatter per spec §7. The question wording and group must match `lib/guideCatalog.ts`.
- **A page only goes live when `published: true` and `compliance_approved: true`.** Set `compliance_approved` only after Vantage compliance signs off on that exact text.
- Kim's insider takes in the drafts are placeholders; each has a comment to replace it with her own story.
- Home copy: `content/home.ts`. About and legal pages: `content/pages/*.mdx` (placeholder text, marked "Pending review").
- Never publish rates, APRs, payments, loan terms, down payment amounts, or "best rate"/"guaranteed approval" claims. `npm test` and the E2E suite fail if they appear.

### Reviewing drafts on a preview URL
`SHOW_DRAFTS=true` is set for the **Preview** environment (the dev URL and PR previews). Preview builds render drafts with a red Draft banner (and send `X-Robots-Tag: noindex`). Production ignores the flag.

## Photos

Curated originals live in `assets/source/`; `npm run images` produces the web versions. Still needed from Kim:
- Original hero sportfish photo (currently using `superyacht-dusk.jpg`).
- `kim.jpg` (Kim beside a superyacht) for the About page and author box (currently a studio-wall placeholder; swap in `components/ui/KimPhoto.tsx`).

Excluded on purpose: the sailfish photo (FB Marine Group cap and Contender shirt, spec §2.2). The studio-wall image is cropped above the "Presented by" sponsor line.

## Environment variables

See [`.env.example`](.env.example).

## Launch gates (spec §13). All required before setting `NEXT_PUBLIC_SITE_INDEXABLE=true`

- [ ] Signed agreement with Vantage
- [x] Vantage tracked application link received (built into `lib/apply.ts`; `NEXT_PUBLIC_APPLY_URL` overrides)
- [ ] Vantage compliance approval of site and launch content (`compliance_approved: true` on approved pages)
- [ ] Disclosures, privacy and terms text final (remove "Pending review" notes, set `draft: false`)
- [ ] Domain registered under BOAT BOSS Enterprises; `www` redirects to apex in Vercel
- [ ] Lighthouse 90+ and accessibility check passed
- [ ] `DEMO_MODE` removed from Vercel
- [ ] Kim's final sign-off (including allowing AI crawlers in robots.txt)

## Open items

Newsletter provider (Kit adapter built), analytics choice (Plausible wired), social handles, contact email/phone, PWC/ATV/auto confirmation from Vantage, UTM parameters confirmation from Vantage.
