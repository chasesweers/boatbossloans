@AGENTS.md

## Pull requests

- One issue per PR: branch off `dev`, PR into `dev`. `dev` → `main` is the release PR.
- Before opening a PR (and again before pushing more commits to one), run `npm run pr:overlap`. It fails when another open PR into `dev` changes any of the same files. Two open PRs editing one file, `README.md` especially, conflict as soon as the first merges. If it reports an overlap: branch off that PR's branch instead, or wait until it merges, `git merge origin/dev`, and then open yours.
- Leave `README.md` out of a PR unless the README change is the point of it. Batch doc and checklist updates into the PR that needs them, not into several at once.
