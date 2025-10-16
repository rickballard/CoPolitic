# BPOE (Best Possible Operator Experience): DO Block Conventions

**Goal:** zero-ambiguity, copy/pasteable steps that never mix prose with commands.

## Labels (pick exactly one per block)
- **DO (PS)** — PowerShell to run in a terminal.
- **DO (FILE path)** — exact file contents to write to `path` (bytes-accurate).
- **DO (VERIFY)** — assertions/health checks that print green/red.
- *(optional)* **DO (ROLLBACK)** — the minimal undo for a change.

> Never paste HTML/JS into a **DO (PS)** block. Use **DO (FILE …)** instead.

## Numbering + Time
Prefix each block with a running number and an ISO 8601 UTC stamp, e.g.:
`DO-003 2025-10-16T05:55:12Z (PS)` — helps sequencing and later analysis.

## Commit Hygiene
- One logical change per commit.
- Commit message prefix mirrors the touched area, e.g. `site(hero): …`, `ci(pages): …`, `docs: …`.

## Live Deploy Determinism (Pages)
- Pages **build type**: GitHub Actions.
- Artifact → live marker: `.well-known/served-commit.txt`.
- Verify with `scripts/diag/pages-status.ps1`.
- Optional `pages-smoke.yml` fails fast on stale hero/CTA.

## Example (PS → FILE → VERIFY)
- **DO (PS)** edits text safely with regex + commits.
- **DO (FILE path)** writes HTML/CSS/MD bytes.
- **DO (VERIFY)** curls the live URL, compares served commit vs HEAD, and greps for regressions.

