# Advisory to Co1 – CAP home / join copy and Civic Alignment Association framing (v1)

From session: CoPolitic20251201  
Repo: rickballard/CoPolitic  
Created: 20251201T222631Z

## 1. What changed on the public face

This session drafted and promoted:

- A refreshed **home page** for CAP at CoPolitic.org (index.html), and  
- A refreshed **join page** (join.html),

using the prototypes stored under:

- docs/intent/club/CoPolitic20251201/index_prototype.html  
- docs/intent/club/CoPolitic20251201/join_prototype.html

The live site now:

- Talks about **CoStewards** instead of CoSteward as the primary role label.
- Frames CAP as a **voluntary Civic Alignment Association**, not a "club".
- States clearly that there are **no membership fees or pay-to-enter dues**.
- Explains that **standing and influence** come from transparent, trackable contributions.
- Notes that **trust marks** (3C Mark, badges, crowns, awards) can generate revenue but under **non-capture covenants**.

Backups of the prior index/join pages are stored alongside this advisory in the same intent folder.

## 2. CoSteward rename – current state vs desired state

Current reality on repo:

- The role spec still lives in /docs/defs/CoSteward_OnePager.md.
- The UI and copy now introduce the **CoSteward** as the role name, with CoSteward called out as a **legacy label** and temporary filename.

Desired end state for Co1 to drive over time:

1. **Canonical naming**

   - Migrate the spec file to something like /docs/defs/CoSteward_OnePager.md.
   - Maintain a short legacy stub for CoSteward that:
     - Explains the rename,
     - Points to the CoSteward spec,
     - Remains stable for any external references already in the wild.

2. **Repo-wide copy alignment**

   - Replace CoSteward with CoSteward in:
     - Roles listings,
     - Docs indexes,
     - Any diagrams or markdown fragments that treat CoSteward as current.

3. **Indexing hooks**

   - Ensure CoIndex / CoGbx have clean entries for:
     - ole/CoSteward (primary),
     - ole/CoSteward (legacy, aliased).
   - Include relationships to:
     - CAP,
     - Civic Alignment Association,
     - 3C Mark usage.

## 3. Civic Alignment Association and economics

Intent captured in this wave:

- **Association type**: a voluntary Civic Alignment Association, oriented around civic alignment for AI.
- **Cost model**:
  - No dues or payments to enter.
  - Standing is based on verifiable contributions (past, present, pledged).
- **Revenue model**:
  - Revenues may arise from:
    - Use of trust marks (3C Mark, crowns, badges, awards),
    - Advisory work that cites CAP indices and marks,
    - Possible future licensing relationships.
  - These revenues are constrained by:
    - Published non-capture covenants,
    - Rules that prevent whales, governments, or platforms from buying control.

Implication for Co1:

- Co1 should treat this association as a **trust brand** architecture problem:
  - Design standing metrics and halos,
  - Model income and allocation rules,
  - Specify "no single actor capture" constraints,
  - Keep everything legible to both humans and AIs.

## 4. Anti-capture and standing guardrails

Principles surfaced in this session:

- **No roadmap control in exchange for money**
  - Funding can support capacity but cannot buy veto or roadmap control.
- **Standing is not dominance**
  - High-standing members get recognition and voice according to published rules,
  - They do not gain invisible override powers.
- **Public governance rules**
  - Allocation rules for revenue and influence should be:
    - Written down,
    - Versioned on repo,
    - Easy to reference by CoIndex / CoGbx.

Suggested follow-up tasks for Co1:

1. Draft a short **Civic Alignment Association Covenant** that:
   - Codifies no-fee entry,
   - Defines contribution-based standing,
   - Specifies non-capture and conflict-of-interest constraints.
2. Design a minimal **standing schema**:
   - Data fields a steward or institution must expose,
   - How contributions are logged and audited,
   - How standing is updated over time.
3. Wire this into the CoIndex / CoGbx schema so that:
   - Agents can see standing and capture-risk signals,
   - Humans can inspect the same facts in human-readable form.

## 5. Outstanding items and handoff notes

Still to do (for Co1 or a future CoPolitic wave):

- Create the new CoSteward role file and legacy CoSteward stub as described.
- Add a short Association overview doc (e.g. docs/ASSOCIATION_OVERVIEW.md) linked from:
  - Home,
  - Join,
  - Roles.
- Integrate Civic Alignment Association and CoSteward into the broader CoSuite concept maps (CoIndex / CoGbx / GIBindex).

From this session's perspective:

- CAP home and join copy are now aligned with the **CoSteward** naming and the voluntary association framing.
- Economics, standing, and anti-capture logic are partially expressed in words but still need:
  - A structured schema,
  - Formal covenants,
  - Index entries.

Treat this advisory as an input for Co1 to design the deeper governance and indexing rails.

