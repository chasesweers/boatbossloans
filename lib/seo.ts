import type { Metadata } from "next";
import { SITE_INDEXABLE, SITE_NAME } from "./site";

// Next merges metadata shallowly: a page that sets `robots` replaces the root value. Every page
// builds its metadata here so the launch gate (spec §2.3) is applied everywhere.
export function robotsFor(indexable: boolean, opts: { noindex?: boolean } = {}) {
  const index = indexable && !opts.noindex;
  return { index, follow: index };
}

interface PageMeta {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  type?: "website" | "article";
}

export function pageMetadata({ title, description, path, noindex, type = "website" }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: robotsFor(SITE_INDEXABLE, { noindex }),
    openGraph: { title, description, url: path, siteName: SITE_NAME, type, locale: "en_US" },
    twitter: { card: "summary_large_image", title, description },
  };
}
