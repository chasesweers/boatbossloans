// Run before opening a PR: lists other open PRs into the same base that touch the same files as
// this branch. Two open PRs editing one file (README.md, most often) conflict as soon as the first
// merges. If any overlap, branch off that PR's branch instead, or wait for it to merge and then
// merge the base in before opening yours.
//
//   npm run pr:overlap              # against dev
//   npm run pr:overlap -- main      # against another base
//
// Exits 1 when there is an overlap. Needs the GitHub CLI (gh), signed in.
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

// prs: [{ number, title, headRefName, files: [{ path }] }] as `gh pr list --json` returns them.
export function findOverlaps(myFiles, myBranch, prs) {
  const mine = new Set(myFiles);
  return prs
    .filter((pr) => pr.headRefName !== myBranch)
    .map((pr) => ({ number: pr.number, title: pr.title, branch: pr.headRefName, files: pr.files.map((f) => f.path).filter((p) => mine.has(p)) }))
    .filter((pr) => pr.files.length > 0);
}

const run = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8" }).trim();

function main() {
  const base = process.argv[2] ?? "dev";
  run("git", ["fetch", "--quiet", "origin", base]);
  const branch = run("git", ["branch", "--show-current"]);
  // Files this branch changed since it left the base, plus uncommitted edits and new files.
  const committed = run("git", ["diff", "--name-only", `origin/${base}...HEAD`]);
  const uncommitted = run("git", ["diff", "--name-only", "HEAD"]);
  const untracked = run("git", ["ls-files", "--others", "--exclude-standard"]);
  const myFiles = [...new Set(`${committed}\n${uncommitted}\n${untracked}`.split("\n").filter(Boolean))];
  if (myFiles.length === 0) {
    console.log(`No changes against origin/${base}.`);
    return;
  }

  const prs = JSON.parse(run("gh", ["pr", "list", "--base", base, "--state", "open", "--limit", "100", "--json", "number,title,headRefName,files"]));
  const overlaps = findOverlaps(myFiles, branch, prs);
  if (overlaps.length === 0) {
    console.log(`No other open PR into ${base} touches the ${myFiles.length} file(s) this branch changes.`);
    return;
  }
  for (const pr of overlaps) console.error(`#${pr.number} ${pr.title} [${pr.branch}] also changes: ${pr.files.join(", ")}`);
  console.error(`\nThese will conflict once one merges. Branch off the other PR's branch, or wait for it to merge and run \`git merge origin/${base}\` first.`);
  process.exit(1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
