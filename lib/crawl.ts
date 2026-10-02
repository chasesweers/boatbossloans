// robots.txt and sitemap builders, kept pure for unit tests (spec §9).
import type { MetadataRoute } from "next";

export const AI_CRAWLERS = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];

export const STATIC_PATHS = ["/", "/guide", "/calculator", "/about", "/newsletter", "/disclosures", "/privacy", "/terms"];

export function buildRobots(indexable: boolean, siteUrl: string): MetadataRoute.Robots {
  // Launch gate (spec §2.3): block everything until Kim signs off.
  if (!indexable) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
      // Explicitly welcome AI answer engines (spec §9; Kim confirms before launch).
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/admin", "/api/"] })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

export function buildSitemap(siteUrl: string, guides: { slug: string; updated: string }[]): MetadataRoute.Sitemap {
  return [
    ...STATIC_PATHS.map((p) => ({ url: `${siteUrl}${p === "/" ? "" : p}` })),
    ...guides.map((g) => ({ url: `${siteUrl}/guide/${g.slug}`, lastModified: g.updated })),
  ];
}
