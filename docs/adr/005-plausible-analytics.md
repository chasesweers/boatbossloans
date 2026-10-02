# ADR-005: Plausible analytics behind a typed track() wrapper

## Status
Accepted (2026-10-02), pending Kim's confirmation (spec §14 open item)

## Context
Spec §11 needs `apply_click`, `newsletter_signup`, `guide_scroll_75`, `video_play`, `calculator_used`, and prefers to avoid a cookie banner.

## Decision
Plausible, loaded only when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set. All events go through `lib/analytics.ts` `track()`, whose event names and props are typed.

## Consequences
+ No cookies, no consent banner in most cases.
+ Changing providers touches one file.
− Custom event properties must be registered in the Plausible dashboard to appear in reports.
