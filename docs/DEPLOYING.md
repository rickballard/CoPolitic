# Deploying CoPolitic.org (GitHub Pages via Actions)

- Pages Settings → Build and deployment: **GitHub Actions** (not “Deploy from branch”)
- Workflow: `.github/workflows/pages.yml` (has `push` + `workflow_dispatch`)
- Deploy marker: `.well-known/served-commit.txt` contains the 7-char commit shipped.

## One-liner status
`scripts/diag/pages-status.ps1` prints Served vs Local and fails if hero CTA/list reappears.

## Common pitfalls
- If `gh workflow run` returns 422 → `workflow_dispatch` missing; fix workflow file.
- If a run shows “canceled (higher priority waiting request)” → another run superseded it.
  Don’t retrigger repeatedly; wait for one run to complete, then verify `served-commit`.
- Hero CTA/list must be removed in `index.html`. The smoke test enforces this.

See also: **[BPOE](./BPOE.md)** for DO block rules and live determinism.
