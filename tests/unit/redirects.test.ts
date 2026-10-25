import { describe, it, expect } from "vitest";
import { buildRedirects, CANONICAL_ORIGIN, QR_PATH } from "@/lib/redirects";

const LAUNCHED = { VERCEL_ENV: "production", NEXT_PUBLIC_SITE_INDEXABLE: "true" };
const PRE_LAUNCH_ENVS = [
  { VERCEL_ENV: "production" },
  { VERCEL_ENV: "production", NEXT_PUBLIC_SITE_INDEXABLE: "false" },
  { VERCEL_ENV: "preview", NEXT_PUBLIC_SITE_INDEXABLE: "true" },
  { NEXT_PUBLIC_SITE_INDEXABLE: "true" },
];

describe("buildRedirects", () => {
  it("after launch, 308s Production vercel.app hosts to the canonical domain, keeping the path", () => {
    const [qr, r, ...rest] = buildRedirects(LAUNCHED);
    expect(qr.source).toBe(QR_PATH);
    expect(rest).toHaveLength(0);
    expect(r).toMatchObject({ source: "/:path*", destination: `${CANONICAL_ORIGIN}/:path*`, permanent: true });
    expect(CANONICAL_ORIGIN).toBe("https://boatbossloans.com");

    // Next anchors host values as ^value$.
    const host = r.has?.find((h) => h.type === "host");
    const matches = (h: string) => new RegExp(`^${host?.value}$`).test(h);
    expect(matches("boatbossloans-five.vercel.app")).toBe(true);
    expect(matches("boatbossloans-abc123-chase.vercel.app")).toBe(true);
    expect(matches("boatbossloans.com")).toBe(false);
    expect(matches("www.boatbossloans.com")).toBe(false);
    expect(matches("vercel.app.evil.com")).toBe(false);
  });

  it("keeps the demo and Preview deployments on their vercel.app URLs", () => {
    for (const env of PRE_LAUNCH_ENVS) {
      expect(buildRedirects(env).map((r) => r.source)).toEqual([QR_PATH]);
    }
  });

  it("sends QR scans to the home page with UTM tags, in every environment", () => {
    for (const env of [LAUNCHED, ...PRE_LAUNCH_ENVS]) {
      const qr = buildRedirects(env).find((r) => r.source === QR_PATH);
      expect(qr?.permanent).toBe(false);
      const url = new URL(qr!.destination, CANONICAL_ORIGIN);
      expect(url.pathname).toBe("/");
      expect(Object.fromEntries(url.searchParams)).toEqual({
        utm_source: "qr",
        utm_medium: "print",
        utm_campaign: "promo",
      });
    }
  });
});
