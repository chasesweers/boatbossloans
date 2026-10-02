// Runs over the real content/guide files. This is what stops a bad page or a banned claim
// from merging (spec §2.4, §7 build rule, §10).
import { describe, it, expect } from "vitest";
import { loadAllGuides } from "@/lib/content";
import { GUIDE_CATALOG } from "@/lib/guideCatalog";
import { findComplianceViolations } from "@/lib/compliance";
import * as home from "@/content/home";

const guides = loadAllGuides();
const LAUNCH_SLUGS = [
  "credit-score-for-boat-loan",
  "boat-loan-less-than-perfect-credit",
  "private-party-boat-loan",
  "finance-used-boat",
  "get-pre-approved",
];

describe("content/guide", () => {
  it("contains the five launch pages from spec §7", () => {
    const slugs = guides.map((g) => g.slug);
    for (const slug of LAUNCH_SLUGS) expect(slugs).toContain(slug);
  });

  it.each(guides.map((g) => [g.slug, g] as const))("%s matches the catalog question and group", (_, g) => {
    const entry = GUIDE_CATALOG.find((q) => q.slug === g.slug);
    expect(entry, `${g.slug} is not in lib/guideCatalog.ts`).toBeDefined();
    expect(g.title).toBe(entry!.question);
    expect(g.group).toBe(entry!.group);
  });

  it.each(guides.map((g) => [g.slug, g] as const))("%s only relates to questions in the catalog", (_, g) => {
    const catalogSlugs = GUIDE_CATALOG.map((q) => q.slug);
    for (const r of g.related) expect(catalogSlugs).toContain(r);
  });

  it.each(guides.map((g) => [g.slug, g] as const))("%s has no lending ad claims", (_, g) => {
    const text = [g.title, g.summary, g.body].join("\n");
    expect(findComplianceViolations(text)).toEqual([]);
  });

  it("home page copy has no lending ad claims", () => {
    expect(findComplianceViolations(JSON.stringify(home))).toEqual([]);
  });

  it.each(guides.map((g) => [g.slug, g] as const))("%s body is 600 to 1,200 words", (_, g) => {
    const words = g.body.replace(/<[^>]+>|\{\/\*[\s\S]*?\*\/\}/g, " ").split(/\s+/).filter(Boolean).length;
    expect(words).toBeGreaterThanOrEqual(600);
    expect(words).toBeLessThanOrEqual(1200);
  });
});
