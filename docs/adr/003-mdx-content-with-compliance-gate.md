# ADR-003: MDX content with a code-enforced compliance gate

## Status
Accepted (2026-10-02)

## Context
Spec §7: a guide page with `compliance_approved: false` must not render in production. Spec §10 lists lending ad claims that must never be published, and calls them "the rule most likely to be broken by accident."

## Decision
- Guide pages live in `content/guide/*.mdx`, rendered with `next-mdx-remote/rsc` (JS expressions blocked).
- `lib/content.ts` validates frontmatter with Zod (invalid files fail the build) and is the only way pages, the guide index, Home, the sitemap and related links read content.
- In production only `published && compliance_approved` pages exist. Drafts show in dev, and on preview builds that set `SHOW_DRAFTS=true` (never when `VERCEL_ENV=production`) with a red Draft banner, so Kim and Vantage can review them on a preview URL.
- `lib/compliance.ts` is a pattern net for banned claims (rates, APR, percentages, payments, terms, down payments, "best rates", "guaranteed approval"...). It runs over content files in unit tests and over the rendered text of every page in E2E.
- `lib/guideCatalog.ts` fixes the 20 questions' wording, groups and order.

## Consequences
+ The review gate cannot be skipped by forgetting a step; CI fails first.
− The compliance net is deliberately strict (any "%" fails). If Vantage approves a specific figure, adjust the rule with a test that names the approval.
− `SHOW_DRAFTS` relies on `VERCEL_ENV`; if hosting moves off Vercel, revisit `draftsAllowed`.
