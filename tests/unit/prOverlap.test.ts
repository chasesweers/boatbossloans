import { describe, it, expect } from "vitest";
import { findOverlaps } from "@/scripts/pr-overlap.mjs";

const pr = (number: number, headRefName: string, paths: string[]) => ({
  number,
  title: `PR ${number}`,
  headRefName,
  files: paths.map((path) => ({ path })),
});

describe("findOverlaps", () => {
  it("reports other open PRs that change the same files, listing only the shared ones", () => {
    const prs = [pr(11, "approve-guides", ["README.md", "content/guide/a.mdx"]), pr(13, "calculator", ["app/calculator/page.tsx"])];
    expect(findOverlaps(["README.md", "content/pages/privacy.mdx"], "finalize-pages", prs)).toEqual([
      { number: 11, title: "PR 11", branch: "approve-guides", files: ["README.md"] },
    ]);
  });

  it("ignores this branch's own PR", () => {
    expect(findOverlaps(["README.md"], "finalize-pages", [pr(12, "finalize-pages", ["README.md"])])).toEqual([]);
  });
});
