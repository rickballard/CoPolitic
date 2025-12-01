# CoPolitic – MegaWave Plan (CoPolitic20251201, v1)

Session: CoPolitic20251201  
Created: 20251201T175544Z

## Wave 1 – Discovery and critique (done in prior dialogue)

- Critique current CoPolitic.org site (logo wall, Perspective Plane, independence issues).
- Clarify role of CoPolitic / CAP as:

  - Neutral canopy and public index.
  - Non-commercial club for serious actors.

- Sketch high-level information architecture and footer objectives.

Status: **Done (off-repo, captured in this intent folder).**

---

## Wave 2 – Club, Mark, and Lab specs (this wave)

- Create docs/intent/club/CoPolitic20251201/ as a planning and spec folder.
- Fill:

  - CAP_CLUB_OVERVIEW.md – purpose, membership, independence, promises.
  - CAP_3C_MARK_LEVELS.md – Observed, Pledged, Practicing, Verified ladder.
  - CAP_3C_BADGE_SPECS.md – visual and usage spec for 3C Mark.
  - PERSPECTIVE_LAB_V2.md – Perspective Lab concept as CAP instrument panel.
  - MEGAWAVE_PLAN.md – this file.

- Keep everything non-binding until reviewed, but treat this as v1 intent.

Status: **In progress** (this DO block).

---

## Wave 3 – Site copy and transparency pages

Planned steps:

- Update 	ransparency.html to:

  - Explain CAP, the club, and independence.
  - Link to 3C Mark explainer and Perspective Lab.
  - Expose core promises (no pay-to-play, evidence-first, contestability).

- Update sponsors.html and join.html to:

  - Distinguish "CAP member", "donor", "ally", and "observed exemplar".
  - Make join pathways explicit and non-commercial.

- Keep changes scoped and backed by the specs in this folder.

Status: **Planned.**

---

## Wave 4 – Perspective Lab integration

Planned steps:

- Move existing plane-app into a /lab/ namespace:

  - Add human-first explainer page.
  - Expose filter controls for actor type and 3C Mark level.

- Wire Plane to read from a single JSON feed that includes:

  - Actor metadata.
  - 3C Mark level, if any.
  - Links back to CoPolitic pages.

- Add "View on Plane" hooks from exemplar pages and future registry pages.

Status: **Planned.**

---

## Wave 5 – 3C Mark registry and badges

Planned steps:

- Add a registry section (for example docs/3c-registry/ or similar) to:

  - List all organisations with 3C levels and evidence.
  - Document challenges, suspensions, and revocations.

- Implement badges using:

  - The 3C Mark SVG.
  - CSS classes aligned with CAP_3C_BADGE_SPECS.md.

- Provide embed snippets that organisations can copy, which always link back to their registry page.

Status: **Planned.**

---

## Wave 6 – Branch, PR, and deployment

Planned steps:

- Create a focused branch (for example docs/copolitic-club-and-3cmark-v1).
- Commit this intent folder and targeted site copy changes.
- Open a PR with:

  - Summary of CAP club, 3C Mark, and Perspective Lab v2 intent.
  - Notes on any content that still needs CoIndex integration.
  - A checklist for future waves (especially registry wiring).

- After review, merge and validate that:

  - Site layout remains stable.
  - New CAP framing and promises are visible and coherent.

Status: **Planned.**

---
