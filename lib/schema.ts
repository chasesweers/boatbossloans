// JSON-LD builders (spec §9). Kept as plain functions so they are unit-testable.
import { AUTHOR_NAME, AUTHOR_TITLE, LEGAL_ENTITY, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL_LINKS } from "./site";

const abs = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;
const sameAs = () => SOCIAL_LINKS.map((s) => s.href).filter((h): h is string => Boolean(h));

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: LEGAL_ENTITY,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-white.png`,
    description: SITE_DESCRIPTION,
    founder: { "@id": `${SITE_URL}/about#kim` },
    sameAs: sameAs(),
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/about#kim`,
    name: AUTHOR_NAME,
    jobTitle: AUTHOR_TITLE,
    url: abs("/about"),
    worksFor: { "@id": `${SITE_URL}/#organization` },
    sameAs: sameAs(),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

export function articleSchema(doc: { title: string; summary: string; slug: string; updated: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: doc.title,
    description: doc.summary,
    dateModified: doc.updated,
    mainEntityOfPage: abs(`/guide/${doc.slug}`),
    author: { "@type": "Person", "@id": `${SITE_URL}/about#kim`, name: AUTHOR_NAME, url: abs("/about") },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

// Escape "<" so no string in the payload can close the <script> tag (Next.js JSON-LD guide).
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
