import { describe, it, expect } from "vitest";
import { buildRobots, buildSitemap, AI_CRAWLERS } from "@/lib/crawl";

const SITE = "https://boatbossloans.com";

describe("buildRobots", () => {
  it("blocks every crawler before launch", () => {
    expect(buildRobots(false, SITE)).toEqual({ rules: [{ userAgent: "*", disallow: "/" }] });
  });

  it("after launch, allows search and AI crawlers but never /admin", () => {
    const robots = buildRobots(true, SITE);
    const rules = Array.isArray(robots.rules) ? robots.rules : [robots.rules];
    const agents = rules.map((r) => r.userAgent);
    for (const bot of ["*", ...AI_CRAWLERS]) expect(agents).toContain(bot);
    for (const r of rules) expect(r.disallow).toContain("/admin");
    expect(robots.sitemap).toBe(`${SITE}/sitemap.xml`);
  });
});

describe("buildSitemap", () => {
  it("lists static pages and the given guide pages with lastModified", () => {
    const map = buildSitemap(SITE, [{ slug: "finance-used-boat", updated: "2026-10-02" }]);
    const urls = map.map((e) => e.url);
    expect(urls).toContain(SITE);
    expect(urls).toContain(`${SITE}/guide`);
    expect(map).toContainEqual({ url: `${SITE}/guide/finance-used-boat`, lastModified: "2026-10-02" });
    expect(urls.some((u) => u.includes("/admin"))).toBe(false);
  });
});
