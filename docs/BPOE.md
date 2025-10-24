# BPOE — Execution Patterns
1) Keep edits idempotent & small; prefer scripts over manual pastes.
2) Log actions to `/status/log/YYYYMMDD.jsonl` (area=plane/type=status/summary).
3) Package installers as a single zip; execute from Downloads (avoids path drift).
4) Keep page copy purpose-first; tuck detail into a single <details> explainer.
5) Prefer inline points (no fetch) for first paint; fall back to demo JSON.
## Auto CoSync / Session-Rescue

- A scheduled task runs `CoSync.ps1 -Mode auto` about every 3 hours (finite 5-year window).
- Heuristics trigger a rescue when any trip:
  - Time since last rescue ≥ 10h (hard ceiling)
  - Dirty files ≥ 25  •  Commits since last rescue ≥ 15  •  Today’s status lines ≥ 60
- Rescue writes `CoCache/rescue-YYYYMMDD-HHmmss/` and appends a `status/log/YYYYMMDD.jsonl` pulse.
