import { describe, it, expect } from "vitest";
import { buildRedirects, CANONICAL_ORIGIN } from "@/lib/redirects";

const LAUNCHED = { VERCEL_ENV: "production", NEXT_PUBLIC_SITE_INDEXABLE: "true" };

describe("buildRedirects", () => {
  it("after launch, 308s Production vercel.app hosts to the canonical domain, keeping the path", () => {
    const [r, ...rest] = buildRedirects(LAUNCHED);
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
    expect(buildRedirects({ VERCEL_ENV: "production" })).toEqual([]);
    expect(buildRedirects({ VERCEL_ENV: "production", NEXT_PUBLIC_SITE_INDEXABLE: "false" })).toEqual([]);
    expect(buildRedirects({ VERCEL_ENV: "preview", NEXT_PUBLIC_SITE_INDEXABLE: "true" })).toEqual([]);
    expect(buildRedirects({ NEXT_PUBLIC_SITE_INDEXABLE: "true" })).toEqual([]);
  });
});
