# ADR-001: Next.js App Router, static-first

## Status
Accepted (2026-10-02)

## Context
Spec §3 asks for static pages for speed and SEO, server routes for the newsletter and (later) the dashboard, and Vercel hosting.

## Decision
Next.js 16 App Router with TypeScript and Tailwind v4. Every public page is statically generated at build time. The only server code in Phase 1 is `POST /api/newsletter`.

## Consequences
+ Fast pages, plain HTML for search and AI crawlers (spec §9).
+ Content changes ship by commit; preview deployments for review.
− Content edits need a developer and a deploy (accepted by the spec: "content is updated in code").
