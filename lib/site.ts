// Site-wide constants. One place for names and legal text so they stay identical everywhere (spec §9).

export const SITE_NAME = "BOAT BOSS Loans";
export const LEGAL_ENTITY = "BOAT BOSS Enterprises";
export const AUTHOR_NAME = "Kim Sweers";
export const AUTHOR_TITLE = "The Boat Boss";
export const LENDER_NAME = "Vantage Recreational Finance";
// Expertise signals for Kim's Person JSON-LD (spec §9).
export const AUTHOR_AWARDS = [
  "2025 Darlene Briggs Marine Woman of the Year",
  "2023 Mercury Marine International Woman of the Year",
];
export const AUTHOR_CREDENTIAL = "Licensed Florida yacht broker";

type Env = Record<string, string | undefined>;

// Canonical origin: explicit setting, else Vercel's production domain, else local dev.
export function resolveSiteUrl(env: Env = process.env): string {
  if (env.NEXT_PUBLIC_SITE_URL) return env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

// Launch gate (spec §2.3, §13): everything is noindex until this is explicitly turned on.
export const SITE_INDEXABLE = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

// Demo deployments show draft content and a site-wide Demo banner. Switches itself off once the
// site is indexable, so drafts can never be published by forgetting to unset it at launch.
export function isDemoMode(env: Env = process.env): boolean {
  return env.DEMO_MODE === "true" && env.NEXT_PUBLIC_SITE_INDEXABLE !== "true";
}

// Banner label so Kim can tell the dev deployment (Vercel Preview, `dev` branch) from prod.
export function demoBannerLabel(env: Env = process.env): string {
  return env.VERCEL_ENV === "preview" ? "Dev preview" : "Demo preview";
}

export const SITE_DESCRIPTION =
  "Straight answers to boat financing questions from Kim Sweers, The Boat Boss. Learn how boat loans work, then apply with Vantage Recreational Finance.";

// Spec §10. Final wording comes from Vantage compliance and Kim's attorney.
export const DISCLOSURE =
  "BOAT BOSS Loans is a brand of BOAT BOSS Enterprises. BOAT BOSS is not a lender and does not make credit decisions. Financing is arranged through Vantage Recreational Finance, Inc. All loans are subject to credit approval. BOAT BOSS Enterprises receives compensation from Vantage Recreational Finance for referred loans. Content on this site is general education, not financial, legal, or tax advice.";

export const NAV_LINKS = [
  { href: "/guide", label: "Financing guide" },
  { href: "/calculator", label: "Calculator" },
  { href: "/about", label: "About Kim" },
] as const;

export const LEGAL_LINKS = [
  { href: "/disclosures", label: "Disclosures" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

// Kim's profiles. Used in the footer, About, Home, and JSON-LD sameAs (spec §9).
export type SocialNetwork = "Instagram" | "Facebook" | "YouTube";
export const SOCIAL_LINKS: { label: SocialNetwork; href: string }[] = [
  { label: "Instagram", href: "https://www.instagram.com/theboatboss/" },
  { label: "Facebook", href: "https://www.facebook.com/theboatboss/" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCWrEEyBk87dAwQOibwJ4Q2g" },
];
