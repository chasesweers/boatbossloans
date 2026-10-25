// Redirects for next.config.ts, kept pure for unit tests.
import type { NextConfig } from "next";

type Redirect = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>[number];

export const CANONICAL_ORIGIN = "https://boatbossloans.com";

// Printed QR codes encode `${CANONICAL_ORIGIN}${QR_PATH}` (scripts/qr.mjs). The UTM tags let
// Plausible count scans under Campaigns. Temporary (307) so phones don't cache it and the
// destination can change without reprinting.
export const QR_PATH = "/qr";
export const QR_DESTINATION = "/?utm_source=qr&utm_medium=print&utm_campaign=promo";

type Env = Record<string, string | undefined>;

// After launch, Production's *.vercel.app hosts (boatbossloans-five.vercel.app and per-deployment
// URLs) 308 to the real domain so search engines see one canonical host. Before launch, and on
// Preview, the vercel.app URLs keep serving the demo and dev sites.
export function buildRedirects(env: Env = process.env): Redirect[] {
  const qr: Redirect = { source: QR_PATH, destination: QR_DESTINATION, permanent: false };
  if (env.VERCEL_ENV !== "production" || env.NEXT_PUBLIC_SITE_INDEXABLE !== "true") return [qr];
  return [
    qr,
    {
      source: "/:path*",
      has: [{ type: "host", value: ".*\.vercel\.app" }],
      destination: `${CANONICAL_ORIGIN}/:path*`,
      permanent: true,
    },
  ];
}
