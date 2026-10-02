# ADR-004: Newsletter through a provider adapter; we store no subscribers

## Status
Accepted (2026-10-02)

## Context
Spec §7: submit to the provider's API, double opt-in, never store subscribers ourselves. Kim hasn't picked a provider yet (spec §14).

## Decision
`lib/newsletter/provider.ts` defines a `NewsletterProvider` interface. `getNewsletterProvider()` returns the Kit (ConvertKit v4) adapter when `KIT_API_KEY` and `KIT_FORM_ID` are set, otherwise a console provider for dev/CI. The route validates with the same Zod schema as the form, drops honeypot submissions silently, and rate limits per IP (5 per 10 minutes, in memory).

## Consequences
+ Switching to Beehiiv or Mailchimp is one new adapter.
+ No subscriber PII in our infrastructure.
− The in-memory limiter is per serverless instance. If abuse appears, add Cloudflare Turnstile or a shared store (Upstash).
− Double opt-in is a setting on the Kit form; confirm it's on before launch.
