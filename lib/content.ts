// Guide content loader (spec §7). Reads MDX from content/guide at build time, validates frontmatter,
// and enforces the compliance gate: in production only published + compliance_approved pages exist.
// Every consumer (pages, guide index, Home, sitemap, related links) goes through getGuides/getGuide.
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import { GUIDE_GROUPS, catalogIndex, type GuideGroupId } from "./guideCatalog";
import { isDemoMode } from "./site";

const GUIDE_DIR = path.join(process.cwd(), "content", "guide");

const groupIds = GUIDE_GROUPS.map((g) => g.id) as [GuideGroupId, ...GuideGroupId[]];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const frontmatterSchema = z.object({
  title: z.string().min(5),
  slug: z.string().regex(slugPattern),
  group: z.enum(groupIds),
  summary: z.string().min(20).max(320),
  published: z.boolean().default(false),
  // Fail closed: anything other than an explicit `true` is unapproved.
  compliance_approved: z.boolean().default(false),
  // YAML parses bare dates into Date objects; normalize to YYYY-MM-DD.
  updated: z.union([z.date(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]).transform((d) =>
    d instanceof Date ? d.toISOString().slice(0, 10) : d,
  ),
  video_id: z.string().default(""),
  related: z.array(z.string().regex(slugPattern)).max(3).default([]),
});

export type GuideFrontmatter = z.infer<typeof frontmatterSchema>;
export type GuideDoc = GuideFrontmatter & { body: string };

type Env = Record<string, string | undefined>;

export function parseGuide(source: string, filename: string): GuideDoc {
  const { data, content } = matter(source);
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("; ");
    throw new Error(`Invalid frontmatter in content/guide/${filename}: ${issues}`);
  }
  const expected = filename.replace(/\.mdx$/, "");
  if (parsed.data.slug !== expected) {
    throw new Error(`content/guide/${filename}: slug "${parsed.data.slug}" must match the filename "${expected}"`);
  }
  return { ...parsed.data, body: content };
}

// Drafts are visible in dev; on preview deployments that opt in with SHOW_DRAFTS=true (so Kim and
// Vantage compliance can review them); and on a DEMO_MODE deployment. Never once the site is indexable.
export function draftsAllowed(env: Env = process.env): boolean {
  if (env.NODE_ENV !== "production") return true;
  if (env.NEXT_PUBLIC_SITE_INDEXABLE === "true") return false;
  if (isDemoMode(env)) return true;
  return env.SHOW_DRAFTS === "true" && env.VERCEL_ENV !== "production";
}

export function isVisible(doc: Pick<GuideDoc, "published" | "compliance_approved">, env: Env = process.env) {
  return draftsAllowed(env) || (doc.published && doc.compliance_approved);
}

export const isDraft = (doc: GuideDoc) => !(doc.published && doc.compliance_approved);

const byCatalogOrder = (a: GuideDoc, b: GuideDoc) => catalogIndex(a.slug) - catalogIndex(b.slug) || a.title.localeCompare(b.title);

export function loadAllGuides(dir = GUIDE_DIR): GuideDoc[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => parseGuide(fs.readFileSync(path.join(dir, f), "utf8"), f))
    .sort(byCatalogOrder);
}

export function getGuides(env: Env = process.env): GuideDoc[] {
  return loadAllGuides().filter((d) => isVisible(d, env));
}

export function getGuide(slug: string, env: Env = process.env): GuideDoc | undefined {
  return getGuides(env).find((d) => d.slug === slug);
}

export interface GuideGroup {
  id: GuideGroupId;
  label: string;
  guides: GuideDoc[];
}

export function groupGuides(guides: GuideDoc[]): GuideGroup[] {
  return GUIDE_GROUPS.map((g) => ({
    id: g.id,
    label: g.label,
    guides: guides.filter((d) => d.group === g.id).sort(byCatalogOrder),
  })).filter((g) => g.guides.length > 0);
}

// Spec §7.9: three related questions. Use the author's picks that are visible, then fill from the same group.
export function resolveRelated(doc: GuideDoc, visible: GuideDoc[], count = 3): GuideDoc[] {
  const others = visible.filter((d) => d.slug !== doc.slug);
  const picked = doc.related
    .map((slug) => others.find((d) => d.slug === slug))
    .filter((d): d is GuideDoc => Boolean(d));
  const fill = others.filter((d) => d.group === doc.group && !picked.includes(d)).sort(byCatalogOrder);
  const rest = others.filter((d) => !picked.includes(d) && !fill.includes(d));
  return [...picked, ...fill, ...rest].slice(0, count);
}
