@AGENTS.md

# Workflow preferences

- After finishing a task that produces commits on the working branch, always
  push to `origin` and open a pull request against `main` without being asked.
- Enable auto-merge (squash) on every PR created from this repo so it merges as
  soon as checks pass. If the PR is already in a clean/mergeable state with no
  required checks, squash-merge it directly instead of waiting.
- GitHub Pages deploys from `main` via `.github/workflows/deploy.yml`, so merging
  is what actually ships to the live site — don't stop at "PR opened".
