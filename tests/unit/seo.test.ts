import { describe, it, expect } from "vitest";
import { pageMetadata, robotsFor } from "@/lib/seo";
import {
  organizationSchema,
  personSchema,
  faqSchema,
  articleSchema,
  breadcrumbSchema,
  serializeJsonLd,
} from "@/lib/schema";

describe("robotsFor (launch gate, spec §2.3)", () => {
  it("is noindex, nofollow until the site is explicitly made indexable", () => {
    expect(robotsFor(false)).toEqual({ index: false, follow: false });
  });
  it("allows indexing after launch", () => {
    expect(robotsFor(true)).toEqual({ index: true, follow: true });
  });
  it("keeps a page noindex when asked, even after launch", () => {
    expect(robotsFor(true, { noindex: true })).toEqual({ index: false, follow: false });
  });
});

describe("pageMetadata", () => {
  const meta = pageMetadata({
    title: "Can I finance a used boat?",
    description: "Yes. Used boats are financed every day.",
    path: "/guide/finance-used-boat",
  });

  it("sets a unique title, description and canonical URL", () => {
    expect(meta.title).toBe("Can I finance a used boat?");
    expect(meta.description).toBe("Yes. Used boats are financed every day.");
    expect(meta.alternates?.canonical).toBe("/guide/finance-used-boat");
  });

  it("always carries the robots gate so a page can't accidentally override it", () => {
    expect(meta.robots).toBeDefined();
  });

  it("sets Open Graph and Twitter cards", () => {
    expect(meta.openGraph).toMatchObject({ title: "Can I finance a used boat?", url: "/guide/finance-used-boat" });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });
});

describe("JSON-LD", () => {
  it("describes the organization and Kim consistently", () => {
    expect(organizationSchema()).toMatchObject({ "@type": "Organization", name: "BOAT BOSS Loans" });
    expect(personSchema()).toMatchObject({ "@type": "Person", name: "Kim Sweers", jobTitle: "The Boat Boss" });
    expect(personSchema().sameAs).toContain("https://www.instagram.com/theboatboss/");
    expect(personSchema().award).toContain("2025 Darlene Briggs Marine Woman of the Year");
    expect(personSchema().hasCredential).toMatchObject({ name: "Licensed Florida yacht broker" });
    expect(organizationSchema().sameAs).toHaveLength(3);
  });

  it("builds FAQPage from question/answer pairs", () => {
    const s = faqSchema([{ question: "Q?", answer: "A." }]);
    expect(s["@type"]).toBe("FAQPage");
    expect(s.mainEntity[0]).toMatchObject({
      "@type": "Question",
      name: "Q?",
      acceptedAnswer: { "@type": "Answer", text: "A." },
    });
  });

  it("builds Article with Kim as author and the updated date", () => {
    const s = articleSchema({ title: "T?", summary: "S.", slug: "t", updated: "2026-10-02" });
    expect(s).toMatchObject({ "@type": "Article", headline: "T?", dateModified: "2026-10-02" });
    expect(s.author).toMatchObject({ "@type": "Person", name: "Kim Sweers" });
  });

  it("builds BreadcrumbList with positions", () => {
    const s = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Guide", path: "/guide" },
    ]);
    expect(s.itemListElement.map((i: { position: number }) => i.position)).toEqual([1, 2]);
  });

  it("escapes < so content can't break out of the script tag", () => {
    expect(serializeJsonLd({ x: "</script><script>alert(1)</script>" })).not.toContain("</script>");
  });
});
