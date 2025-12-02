# CoPolitic Labs Catalog v2

Version: 2
Session: CoPolitic20251201

This catalog is written for internal stewards (Co1, CoCivium maintainers, InSeed).  
The public-facing version lives in `docs/site-v1/labs.html`.

## Lab 1 – Perspective Plane Lab

**Goal:**  
Help mixed groups (different political tribes, roles, or orgs) see their stories on a shared map without forcing agreement.

**Inputs:**

- 6–20 participants from at least two distinct "tribes" (e.g., left/right, tech/policy, center/periphery).
- One or two contentious but concrete questions (e.g., AI in classrooms, automated welfare decisions).
- A facilitator brief that:
  - Explains the perspective plane in plain language.
  - Stresses that the map is about systems and narratives, not about judging individuals.

**Moves:**

1. Collect 2–3 short stories from each participant:
   - Where is AI already shaping your life or work?
   - What feels most at risk if things go wrong?
   - What would "better" look like?

2. As a group, place stories on a simplified plane:
   - Core vs edge influence.
   - Stewardship vs extraction.
   - Evidence-based vs narrative-only decision making.

3. Use an AI partner (e.g., CoAgent-style prompts) to:
   - Suggest patterns that appear across tribes.
   - Surface questions that no single tribe can answer alone.

4. Close with each participant writing:
   - One thing they understand better about another tribe.
   - One question they want to carry into a guardrail conversation.

**Outputs:**

- A rough map of stories (could be digital or on paper).
- A short writeup of cross-tribal patterns and open questions.
- Candidate prompts and framing for future CoGuard / CoCache pilots.

## Lab 2 – Guardrail Jam

**Goal:**  
Prototype visible, testable guardrails for a concrete AI use case, with edge stakeholders in the room.

**Inputs:**

- A specific decision area (e.g., city housing eligibility, university admissions triage, content moderation policy).
- 4–12 participants including:
  - At least one steward (regulator / institutional decision-maker).
  - At least one person affected by the decision.
  - At least one technologist with access to the systems in question (or a close proxy).
- Any existing policy docs, model cards, or decision logs.

**Moves:**

1. Map current reality:
   - Who currently has override power?
   - Where does evidence live, and who can see it?
   - What is the fastest path for a harmed person to be heard?

2. Use AI tools to:
   - Translate policies into human-readable test cases.
   - Generate example edge cases and failure modes.

3. Co-design candidate guardrails:
   - What must always be logged?
   - What red lines trigger human review?
   - Where must affected people have a say?

4. Draft a minimal "guardrail charter":
   - 1–2 pages, plain language.
   - Includes a sketch of how CoCache/CoGuard/CoIndex could support it, but does not require them.

**Outputs:**

- A draft guardrail charter.
- A list of metrics or traces that would make the guardrails auditable.
- A backlog of implementation options (including low-tech ones) that does not depend on any single vendor.

## Lab 3 – Civic Twin Sprint

**Goal:**  
Help a small institution (e.g., a school, a city department, a newsroom) imagine and cost out a path from core-controlled to edge-balanced AI use.

**Inputs:**

- 3–8 participants who understand the institution from different angles (ops, leadership, frontline, impacted community).
- Minimal data about current tooling:
  - What software is in use.
  - What data is collected.
  - Where AI or automation is already in play.
- 1–2 half-day blocks or 3–4 shorter sessions.

**Moves:**

1. Snapshot the current attractor:
   - How centralized are decisions?
   - How visible are the data flows?
   - Where are people already overriding the system informally?

2. With AI assistance, sketch 2–3 future snapshots:
   - "Default" (let platforms continue to centralize).
   - "Edge-balanced" (stewarded, auditable, reversible).
   - "Failure" (what happens if nothing is done).

3. Choose one edge-balanced snapshot and run a short sprint:
   - Identify 3–5 concrete changes that move the institution toward that snapshot.
   - Classify each as policy, tooling, or practice.
   - Estimate rough cost and political friction.

4. Prepare a short narrative deck or memo:
   - Before / After stories.
   - Risks of inaction.
   - The minimal pilot that could be run in 3–6 months.

**Outputs:**

- A simple civic "twin" narrative for the institution.
- A ranked list of interventions.
- An invitation for external partners (including CoCivium contributors) to support or critique the path.

## Operating principles

Across all labs:

- We do not ask participants to adopt CoCivium vocabulary to benefit.
- We prefer small, honest experiments over grand declarations.
- We keep ownership of data and narratives as close to the edge as possible.
- We treat all lab writeups as candidates for public sharing, but redact safely.

## Implementation notes

- Early labs may run under InSeed's operational umbrella.
- Over time, CoCivium contributors can fork these labs and run them in other cities and sectors.
- Every lab should produce:
  - A short public summary (for CoPolitic.org or allied venues).
  - A more detailed internal note (for CoCivium / Co1 / CoCache / CoGuard design).