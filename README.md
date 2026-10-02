# boatbossloans.com

Education-first boat financing site for **Kim Sweers, The Boat Boss** (BOAT BOSS Enterprises). Buyers read the guide, then apply with Vantage Recreational Finance. BOAT BOSS is not a lender.

Requirements: `BOATBOSSLOANS SPEC.md` (v1.0, 2026-10-02). Decisions: [`docs/adr/`](docs/adr).

## Status: Phase 1 proof of concept (pre-launch, `noindex`)

Repo: [chasesweers/boatbossloans](https://github.com/chasesweers/boatbossloans), a personal account for now. Move it to a BOAT BOSS Enterprises account before launch (spec §2.1). The CI workflow is manual-only (Actions tab, Run workflow) during the demo phase; run `npm test` and `npm run test:e2e` locally.

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

## Content

- Guide pages: `content/guide/<slug>.mdx`. Frontmatter per spec §7. The question wording and group must match `lib/guideCatalog.ts`.
- **A page only goes live when `published: true` and `compliance_approved: true`.** Set `compliance_approved` only after Vantage compliance signs off on that exact text.
- Kim's insider takes in the drafts are placeholders; each has a comment to replace it with her own story.
- Home copy: `content/home.ts`. About and legal pages: `content/pages/*.mdx` (placeholder text, marked "Pending review").
- Never publish rates, APRs, payments, loan terms, down payment amounts, or "best rate"/"guaranteed approval" claims. `npm test` and the E2E suite fail if they appear.

### Reviewing drafts on a preview URL
On Vercel, set `SHOW_DRAFTS=true` for the **Preview** environment only. Preview builds then render drafts with a red Draft banner (and send `X-Robots-Tag: noindex`). Production ignores the flag.

## Photos

Curated originals live in `assets/source/`; `npm run images` produces the web versions. Still needed from Kim:
- Original hero sportfish photo (currently using `superyacht-dusk.jpg`).
- `kim.jpg` (Kim beside a superyacht) for the About page and author box (currently a studio-wall placeholder; swap in `components/ui/KimPhoto.tsx`).

Excluded on purpose: the sailfish photo (FB Marine Group cap and Contender shirt, spec §2.2). The studio-wall image is cropped above the "Presented by" sponsor line.

## Environment variables

See [`.env.example`](.env.example).

## Launch gates (spec §13). All required before setting `NEXT_PUBLIC_SITE_INDEXABLE=true`

- [ ] Signed agreement with Vantage
- [ ] Vantage tracked application link received and set as `NEXT_PUBLIC_APPLY_URL`
- [ ] Vantage compliance approval of site and launch content (`compliance_approved: true` on approved pages)
- [ ] Disclosures, privacy and terms text final (remove "Pending review" notes, set `draft: false`)
- [ ] Domain registered under BOAT BOSS Enterprises; `www` redirects to apex in Vercel
- [ ] Lighthouse 90+ and accessibility check passed
- [ ] Kim's final sign-off (including allowing AI crawlers in robots.txt)

## Open items

Newsletter provider (Kit adapter built), analytics choice (Plausible wired), social handles, contact email/phone, PWC/ATV/auto confirmation from Vantage, UTM parameters confirmation from Vantage.
