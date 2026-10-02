# ADR-006: Neon Postgres + Drizzle + own auth for the Phase 3 dashboard

## Status
Accepted (2026-10-02), not yet implemented

## Context
Spec §8: a private referral/payout dashboard with MFA, row-level security, backups and an audit log. The playbook uses SQLite, but Vercel's filesystem doesn't persist.

## Decision
Neon Postgres (registered to BOAT BOSS Enterprises), Drizzle ORM for typed queries and migrations, playbook-style auth (bcrypt password hash + `jose` JWT in an httpOnly cookie) with TOTP MFA, and route protection in `proxy.ts` (Next 16's replacement for middleware) backed by checks in every server route. Local dev uses Docker Postgres.

## Consequences
+ Postgres RLS, point-in-time restore and branching from Neon.
− We own the auth code; it needs careful tests (Phase 3).
