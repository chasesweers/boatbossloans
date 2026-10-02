// Optional /llms.txt (spec §9): a plain-text map of the site for AI tools.
import { getGuides, groupGuides, isDraft } from "@/lib/content";
import { AUTHOR_NAME, AUTHOR_TITLE, DISCLOSURE, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const groups = groupGuides(getGuides().filter((g) => !isDraft(g)));
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> Boat financing education from ${AUTHOR_NAME}, ${AUTHOR_TITLE}. Financing is arranged through Vantage Recreational Finance.`,
    "",
    DISCLOSURE,
    "",
    "## Financing guide",
    ...groups.flatMap((g) => [
      "",
      `### ${g.label}`,
      ...g.guides.map((q) => `- [${q.title}](${SITE_URL}/guide/${q.slug}): ${q.summary}`),
    ]),
    "",
    "## About",
    `- [${AUTHOR_NAME}, ${AUTHOR_TITLE}](${SITE_URL}/about)`,
    `- [Disclosures](${SITE_URL}/disclosures)`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
