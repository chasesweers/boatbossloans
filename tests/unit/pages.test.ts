import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, describe, it, expect } from "vitest";
import { assertStaticPagesLaunchReady, findLaunchBlockers, parsePage, STATIC_PAGES } from "@/lib/pages";

const page = (draft: string | null, body = "Final approved text.\n") =>
  `---\ntitle: "Terms"\ndescription: "Terms."\nupdated: 2026-10-02\n${draft === null ? "" : `draft: ${draft}\n`}---\n\n${body}`;

const PENDING = "<PendingReview>Placeholder outline.</PendingReview>\n\n## Using this site\n";

describe("parsePage", () => {
  it("defaults draft to true when the frontmatter leaves it out", () => {
    expect(parsePage(page(null), "terms").draft).toBe(true);
    expect(parsePage(page("false"), "terms").draft).toBe(false);
  });
});

describe("findLaunchBlockers", () => {
  it("flags draft pages and non-draft pages that still show a PendingReview note", () => {
    expect(
      findLaunchBlockers([
        { name: "about", page: parsePage(page("true"), "about") },
        { name: "privacy", page: parsePage(page("false", PENDING), "privacy") },
        { name: "terms", page: parsePage(page("false"), "terms") },
      ]),
    ).toEqual([
      "content/pages/about.mdx is still draft: true",
      "content/pages/privacy.mdx still contains a <PendingReview> note",
    ]);
  });
});

describe("assertStaticPagesLaunchReady", () => {
  let dir: string;
  const writePages = (contents: Partial<Record<(typeof STATIC_PAGES)[number], string>>) => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "pages-"));
    for (const name of STATIC_PAGES) fs.writeFileSync(path.join(dir, `${name}.mdx`), contents[name] ?? page("false"));
  };
  afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

  it("fails an indexable build and names every page that is not ready", () => {
    writePages({ disclosures: page("true", PENDING), terms: page("false", PENDING) });
    expect(() => assertStaticPagesLaunchReady({ NEXT_PUBLIC_SITE_INDEXABLE: "true" }, dir)).toThrow(
      /content\/pages\/disclosures\.mdx is still draft: true\n.*content\/pages\/terms\.mdx still contains a <PendingReview> note/,
    );
  });

  it("passes an indexable build once every page is final", () => {
    writePages({});
    expect(() => assertStaticPagesLaunchReady({ NEXT_PUBLIC_SITE_INDEXABLE: "true" }, dir)).not.toThrow();
  });

  it("does not block builds while the site is unindexed", () => {
    writePages({ privacy: page("true", PENDING) });
    expect(() => assertStaticPagesLaunchReady({}, dir)).not.toThrow();
    expect(() => assertStaticPagesLaunchReady({ NEXT_PUBLIC_SITE_INDEXABLE: "false" }, dir)).not.toThrow();
  });
});
