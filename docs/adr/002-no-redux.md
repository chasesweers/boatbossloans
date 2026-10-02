# ADR-002: No Redux in Phase 1

## Status
Accepted (2026-10-02)

## Context
The playbook uses Redux Toolkit for shared client state. This site's client state is tiny: a mobile menu, the newsletter form, and a video facade.

## Decision
Use local React state only. No global store.

## Consequences
+ Smaller bundles, fewer moving parts, better Lighthouse scores.
− Revisit for the Phase 3 dashboard if screens share filters or cached data (ADR to follow).
