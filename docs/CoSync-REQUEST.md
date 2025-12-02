# CoSync Improvement Request (for CoPrime session)

## Objective
Harden **CoSync** into a reliable, bloat-aware, self-healing sync/rescue utility that:
- Runs manually or on a schedule.
- Detects session “bloat” heuristically and snapshots state.
- Produces small “handoff” bundles on demand.
- Logs pulses to `status/log/YYYYMMDD.jsonl` for CoEvolution feeds.

## Current state (baseline in repo)
- `scripts/CoSync.ps1` with modes: `auto`, `rescue`, `handoff`, `apply-zip`, `seed`, `bomb`, `release`.
- Auto mode heuristics exist (age, dirty files, commit count, status log lines).
- Scheduler helpers present:  
  `scripts/Register-CoSyncAuto.ps1`, `scripts/Unregister-CoSyncAuto.ps1`.
- Status logging helper inline; JSONL used for pulses.

## Issues / Gaps observed
- Past bug: `$Mode` sometimes unset → guard needed before `switch`.
- “Auto” scheduling required manual scripts in this repo only; needs clearer usage & resilience.
- Logging payload structure is implicit; specify schema + invariants.
- No dry-run; no environment sanity checks; no cross-platform notes.

## Required changes (spec)
1. **Param & Mode guard (idempotent)**
   - `param()` at top:
     - `Mode` default `"auto"`, `ValidateSet("auto","rescue","handoff","bomb","seed","release","apply-zip")`.
   - Immediately before first `switch ($Mode)`:
     - Guard: if Mode missing/empty → `"auto"`.

2. **Auto mode helper**
   - Function `Invoke-CoSyncAuto`:
     - Ensure `CoCache/` and `status/log/` exist.
     - Determine last rescue by reading newest `CoCache/rescue-*/snapshot.json` with fields:
       - `capturedAt` (ISO8601), `git.head`, `git.branch`.
     - Heuristics (configurable variables at top of function):
       - `MinHours = 3`, `MaxHours = 10`
       - Trigger if **any** true (and cadence ≥ MinHours):
         - age since last rescue ≥ `MaxHours`
         - `dirtyCount ≥ 25`
         - `commitsSinceLastRescue ≥ 15`
         - `todayStatusLines ≥ 60`
         - no prior rescue
     - If triggered: call self with `-Mode rescue -WithZip`, then append pulse to `status/log/*`.
     - Else: print no-rescue message with metrics.

3. **Rescue mode**
   - Create `CoCache/rescue-YYYYMMDD-HHmmss/`:
     - `snapshot.json` with:
       - `capturedAt`, `git: {branch, head, status (porcelain), lastCommit}`
       - if `docs/INTENT.json` present, embed as `intentJson` (parsed).
     - `SUMMARY.txt` human-readable with stamp, head, last commit subject.
   - Append JSONL pulse to `status/log` with summary and `data:{path,playbook:'docs/RESCUE-BPOE.md'}`.
   - If `-WithZip`, create `C:\Users\<user>\Downloads\CoPolitic-rescue-<stamp>.zip` with:
     - `plane-app/`, `scripts/`, `docs/`, `data/`, `README.md`, `index.html` (existing only).
     - Add `QUICKSTART.txt` with 3-step apply instructions.

4. **Handoff mode**
   - Bundle the same “live” artifacts to `Downloads\CoPolitic-prime-handoff-<stamp>.zip`.
   - Append JSONL pulse noting created zip path.

5. **Apply-zip mode**
   - `-ZipPath <globOrPath>` → expand to temp, copy into repo root, `git add .; commit; push`.
   - Must work if glob expands to a single file; error if none/multiple.

6. **Status logging helper**
   - Function `LogStatus($summary, $data=@{})`:
     - Guarantees `status/log/`.
     - Appends **one line** JSON per event with shape:  
       `{ts, area, type, summary, data}` where:
       - `ts`: ISO8601 + 'Z'
       - `area`: `"plane"` (default - configurable later)
       - `type`: `"status" | "session" | "ops"`
   - Used by `auto`, `rescue`, `handoff`, `apply-zip`.

7. **Scheduler helpers**
   - `Register-CoSyncAuto.ps1`:
     - Schedules **every ~3h**, finite **5-year duration** to avoid Task XML overflow.
     - Action: `pwsh -NoProfile -File scripts\CoSync.ps1 -Mode auto`
   - `Unregister-CoSyncAuto.ps1` to remove it.
   - Add doc blurb to `docs/BPOE.md` describing cadence & heuristics.

8. **CLI alias (optional)**
   - Add a PowerShell profile function `cosync`:
     - Resolves repo root (via `git rev-parse --show-toplevel` or `~/CoPolitic` fallback).
     - Proxies args to `scripts/CoSync.ps1`.

9. **Dry-run**
   - New switch `-WhatIf` (optional):
     - Print what actions would occur (rescue or not), don’t write to disk, non-zero exit only if parsing fails.

10. **Cross-platform readme note**
   - Add a note to `docs/BPOE.md` that scheduler helper is Windows-Task-Scheduler specific; cron example stub for Linux/macOS is acceptable.

## Acceptance criteria
- `pwsh -File scripts/CoSync.ps1 -Mode auto`:
  - Prints **no-rescue** when thresholds aren’t met.
  - After simulated activity (e.g., `git commit` x16), triggers **rescue** once and logs a pulse.
- `Register-CoSyncAuto.ps1` registers a task; `NextRunTime` is ~3h from now; no XML duration error.
- `rescue` creates `CoCache/rescue-*/{snapshot.json,SUMMARY.txt}`, commits, pushes, and (with `-WithZip`) writes a zip to Downloads.
- `handoff` writes a zip and logs the pulse.
- `apply-zip -ZipPath "<Downloads pattern>"` imports and pushes.
- JSONL pulses are parseable and one JSON object per line.

## Deliverables
- Updated scripts:
  - `scripts/CoSync.ps1`
  - `scripts/Register-CoSyncAuto.ps1`
  - `scripts/Unregister-CoSyncAuto.ps1`
- Docs:
  - `docs/BPOE.md` (Auto CoSync section)
  - `docs/RESCUE-BPOE.md` (playbook stays current)
- Optional: `profile` snippet for `cosync`.

## Test plan (quick)
1. Clean repo; run `-Mode auto` → expect “no rescue”.
2. Create 16 trivial commits; run `-Mode auto` → expect rescue + pulse.
3. Delete `CoCache/*`; run `-Mode auto` → expect rescue (no prior snapshot).
4. Register task; verify `Get-ScheduledTaskInfo` shows future NextRunTime.
5. Trigger `-Mode handoff`; confirm zip & pulse.
6. Apply the zip in a throwaway repo via `apply-zip`; confirm commit + push.
