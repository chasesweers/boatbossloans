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

export function loadPage(name: "about" | "disclosures" | "privacy" | "terms"): StaticPage {
  const file = path.join(process.cwd(), "content", "pages", `${name}.mdx`);
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw new Error(`Invalid frontmatter in content/pages/${name}.mdx: ${parsed.error.message}`);
  return { ...parsed.data, body: content };
}
