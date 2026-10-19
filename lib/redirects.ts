// Redirects for next.config.ts, kept pure for unit tests.
import type { NextConfig } from "next";

type Redirect = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>[number];

export const CANONICAL_ORIGIN = "https://boatbossloans.com";

type Env = Record<string, string | undefined>;

// After launch, Production's *.vercel.app hosts (boatbossloans-five.vercel.app and per-deployment
// URLs) 308 to the real domain so search engines see one canonical host. Before launch, and on
// Preview, the vercel.app URLs keep serving the demo and dev sites.
export function buildRedirects(env: Env = process.env): Redirect[] {
  if (env.VERCEL_ENV !== "production" || env.NEXT_PUBLIC_SITE_INDEXABLE !== "true") return [];
  return [
    {
      source: "/:path*",
      has: [{ type: "host", value: ".*\.vercel\.app" }],
      destination: `${CANONICAL_ORIGIN}/:path*`,
      permanent: true,
    },
  ];
}
