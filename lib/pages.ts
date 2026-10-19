// Loader for single MDX pages (About, legal). Text is supplied by Kim / her attorney (spec §7 Legal).
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  description: z.string(),
  updated: z.union([z.date(), z.string()]).transform((d) => (d instanceof Date ? d.toISOString().slice(0, 10) : d)),
  // true while the text is placeholder copy awaiting Kim / attorney / Vantage sign-off.
  draft: z.boolean().default(true),
});

export type StaticPage = z.infer<typeof schema> & { body: string };

export const STATIC_PAGES = ["about", "disclosures", "privacy", "terms"] as const;
export type StaticPageName = (typeof STATIC_PAGES)[number];

const PAGES_DIR = path.join(process.cwd(), "content", "pages");

export function parsePage(raw: string, name: string): StaticPage {
  const { data, content } = matter(raw);
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw new Error(`Invalid frontmatter in content/pages/${name}.mdx: ${parsed.error.message}`);
  return { ...parsed.data, body: content };
}

export function loadPage(name: StaticPageName, dir = PAGES_DIR): StaticPage {
  return parsePage(fs.readFileSync(path.join(dir, `${name}.mdx`), "utf8"), name);
}

type Env = Record<string, string | undefined>;

// Why each page can't ship yet: still marked draft, or still showing a <PendingReview> note.
export function findLaunchBlockers(pages: { name: string; page: StaticPage }[]): string[] {
  const blockers: string[] = [];
  for (const { name, page } of pages) {
    const file = `content/pages/${name}.mdx`;
    if (page.draft) blockers.push(`${file} is still draft: true`);
    else if (/<PendingReview\b/.test(page.body)) blockers.push(`${file} still contains a <PendingReview> note`);
  }
  return blockers;
}

// Launch gate for static pages (spec §2.3, §10). Called from next.config.ts on `next build`: an
// indexable build fails while any page is still placeholder text, so draft legal copy can never ship.
export function assertStaticPagesLaunchReady(env: Env = process.env, dir = PAGES_DIR): void {
  if (env.NEXT_PUBLIC_SITE_INDEXABLE !== "true") return;
  const blockers = findLaunchBlockers(STATIC_PAGES.map((name) => ({ name, page: loadPage(name, dir) })));
  if (blockers.length === 0) return;
  throw new Error(
    "NEXT_PUBLIC_SITE_INDEXABLE=true, but these static pages are not ready to launch:\n" +
      blockers.map((b) => `  - ${b}`).join("\n") +
      "\nReplace the placeholder text with the approved copy and set draft: false, or leave the site unindexed.",
  );
}
