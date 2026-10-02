import { buildRobots } from "@/lib/crawl";
import { SITE_INDEXABLE, SITE_URL } from "@/lib/site";

export default function robots() {
  return buildRobots(SITE_INDEXABLE, SITE_URL);
}
