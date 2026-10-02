import { describe, it, expect } from "vitest";
import {
  parseGuide,
  isVisible,
  draftsAllowed,
  groupGuides,
  resolveRelated,
  type GuideDoc,
} from "@/lib/content";

const OMIT = "__omit__";

const fm = (overrides: Record<string, string> = {}) => {
  const fields: Record<string, string> = {
    title: '"What credit score do I need for a boat loan?"',
    slug: "credit-score-for-boat-loan",
    group: "credit-and-approval",
    summary: '"Most boat lenders look for good credit. A lending specialist can tell you where you stand."',
    published: "true",
    compliance_approved: "true",
    updated: "2026-10-15",
    video_id: '""',
    related: "[boat-loan-less-than-perfect-credit, boat-down-payment, get-pre-approved]",
    ...overrides,
  };
  const yaml = Object.entries(fields)
    .filter(([, v]) => v !== OMIT)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  return `---\n${yaml}\n---\n\nBody text.\n`;
};

const prod = { NODE_ENV: "production" };
const dev = { NODE_ENV: "development" };

describe("parseGuide", () => {
  it("parses valid frontmatter and body", () => {
    const doc = parseGuide(fm(), "credit-score-for-boat-loan.mdx");
    expect(doc.title).toBe("What credit score do I need for a boat loan?");
    expect(doc.group).toBe("credit-and-approval");
    expect(doc.updated).toBe("2026-10-15");
    expect(doc.related).toHaveLength(3);
    expect(doc.body.trim()).toBe("Body text.");
  });

  it("throws, naming the file, when required fields are missing", () => {
    expect(() => parseGuide(fm({ summary: OMIT }), "broken.mdx")).toThrow(/broken\.mdx/);
  });

  it("rejects an unknown group", () => {
    expect(() => parseGuide(fm({ group: "misc" }), "credit-score-for-boat-loan.mdx")).toThrow();
  });

  it("requires the slug to match the filename", () => {
    expect(() => parseGuide(fm(), "other-name.mdx")).toThrow(/slug/i);
  });

  it("treats compliance_approved as false unless it is explicitly true", () => {
    const doc = parseGuide(fm({ compliance_approved: OMIT }), "credit-score-for-boat-loan.mdx");
    expect(doc.compliance_approved).toBe(false);
  });
});

describe("draftsAllowed", () => {
  it("allows drafts in development", () => {
    expect(draftsAllowed(dev)).toBe(true);
  });
  it("blocks drafts in a production build", () => {
    expect(draftsAllowed(prod)).toBe(false);
  });
  it("allows drafts on preview builds that opt in", () => {
    expect(draftsAllowed({ NODE_ENV: "production", SHOW_DRAFTS: "true", VERCEL_ENV: "preview" })).toBe(true);
  });
  it("never allows drafts on the Vercel production deployment, even if opted in", () => {
    expect(draftsAllowed({ NODE_ENV: "production", SHOW_DRAFTS: "true", VERCEL_ENV: "production" })).toBe(false);
  });
  it("allows drafts on a production demo deployment while the site is still noindex", () => {
    expect(draftsAllowed({ NODE_ENV: "production", VERCEL_ENV: "production", DEMO_MODE: "true" })).toBe(true);
  });
  it("ignores demo mode once the site is indexable, so drafts can never go live at launch", () => {
    expect(
      draftsAllowed({ NODE_ENV: "production", VERCEL_ENV: "production", DEMO_MODE: "true", NEXT_PUBLIC_SITE_INDEXABLE: "true" }),
    ).toBe(false);
    expect(
      draftsAllowed({ NODE_ENV: "production", VERCEL_ENV: "preview", SHOW_DRAFTS: "true", NEXT_PUBLIC_SITE_INDEXABLE: "true" }),
    ).toBe(false);
  });
});

describe("isVisible", () => {
  const doc = (published: boolean, approved: boolean) =>
    ({ published, compliance_approved: approved }) as GuideDoc;

  it("requires published AND compliance_approved in production", () => {
    expect(isVisible(doc(true, true), prod)).toBe(true);
    expect(isVisible(doc(true, false), prod)).toBe(false);
    expect(isVisible(doc(false, true), prod)).toBe(false);
  });
  it("shows everything when drafts are allowed", () => {
    expect(isVisible(doc(false, false), dev)).toBe(true);
  });
});

describe("groupGuides", () => {
  const g = (slug: string, group: GuideDoc["group"]) => ({ slug, group, title: slug }) as GuideDoc;

  it("returns non-empty groups in spec order, guides in catalog order", () => {
    const groups = groupGuides([
      g("private-party-boat-loan", "the-deal"),
      g("boat-loan-less-than-perfect-credit", "credit-and-approval"),
      g("credit-score-for-boat-loan", "credit-and-approval"),
      g("get-pre-approved", "getting-started"),
    ]);
    expect(groups.map((x) => x.id)).toEqual(["getting-started", "credit-and-approval", "the-deal"]);
    expect(groups[1].guides.map((x) => x.slug)).toEqual([
      "credit-score-for-boat-loan",
      "boat-loan-less-than-perfect-credit",
    ]);
    expect(groups[0].label).toBe("Getting started");
  });
});

describe("resolveRelated", () => {
  const g = (slug: string, group: GuideDoc["group"], related: string[] = []) =>
    ({ slug, group, related, title: slug }) as GuideDoc;
  const all = [
    g("a", "the-deal", ["b", "missing", "c"]),
    g("b", "the-deal"),
    g("c", "the-boat"),
    g("d", "the-deal"),
    g("e", "the-boat"),
  ];

  it("keeps visible related pages in order and fills to three from the same group", () => {
    expect(resolveRelated(all[0], all).map((x) => x.slug)).toEqual(["b", "c", "d"]);
  });

  it("never includes the page itself", () => {
    const self = g("b", "the-deal", ["b"]);
    expect(resolveRelated(self, all).map((x) => x.slug)).not.toContain("b");
  });
});
