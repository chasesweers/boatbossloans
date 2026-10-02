import { buildSitemap } from "@/lib/crawl";
import { getGuides, isDraft } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

// Drafts never appear in the sitemap, even on preview builds that render them.
export default function sitemap() {
  return buildSitemap(SITE_URL, getGuides().filter((g) => !isDraft(g)));
}
