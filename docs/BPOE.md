# BPOE — Execution Patterns
1) Keep edits idempotent & small; prefer scripts over manual pastes.
2) Log actions to `/status/log/YYYYMMDD.jsonl` (area=plane/type=status/summary).
3) Package installers as a single zip; execute from Downloads (avoids path drift).
4) Keep page copy purpose-first; tuck detail into a single <details> explainer.
5) Prefer inline points (no fetch) for first paint; fall back to demo JSON.
