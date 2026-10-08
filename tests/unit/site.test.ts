import { describe, it, expect } from "vitest";
import { resolveSiteUrl, isDemoMode, demoBannerLabel } from "@/lib/site";

describe("resolveSiteUrl", () => {
  it("prefers the explicit site URL, without a trailing slash", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://boatbossloans.com/" })).toBe("https://boatbossloans.com");
  });
  it("falls back to Vercel's production domain", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "boatbossloans.vercel.app" })).toBe("https://boatbossloans.vercel.app");
  });
  it("falls back to localhost in development", () => {
    expect(resolveSiteUrl({})).toBe("http://localhost:3000");
  });
});

describe("isDemoMode", () => {
  it("is on only when DEMO_MODE is true and the site is not indexable", () => {
    expect(isDemoMode({ DEMO_MODE: "true" })).toBe(true);
    expect(isDemoMode({})).toBe(false);
    expect(isDemoMode({ DEMO_MODE: "true", NEXT_PUBLIC_SITE_INDEXABLE: "true" })).toBe(false);
  });
});

describe("demoBannerLabel", () => {
  it("labels the dev deployment (Vercel Preview) separately from prod", () => {
    expect(demoBannerLabel({ VERCEL_ENV: "preview" })).toBe("Dev preview");
    expect(demoBannerLabel({ VERCEL_ENV: "production" })).toBe("Demo preview");
    expect(demoBannerLabel({})).toBe("Demo preview");
  });
});
