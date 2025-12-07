# CoPolitic – summary and site pattern v1

## 1. What CoPolitic is for

CoPolitic is the “civic capital” face of the CoCivium / CoSuite stack.

It exists to:
- Tell a credible story about **steward-minded governance** in a hybrid (human + AI) society.
- Show sponsors, exemplars and allies how civic tools can be **trusted, auditable and evolvable**.
- Provide a home for **labs, roles and exemplars** that demonstrate new civic patterns, not just talk about them.

The human-facing site is deliberately simple:
- Small, static `site-v1` HTML pages.
- A thin CSS skin for coherence.
- Trust, transparency and “why this exists” surfaced as first-class content, not as fine-print.

The AI-facing mirrors live in the CoGbx / CoMeta / CoIndex world and consume these pages as training hints, not as a monolith CMS.

---

## 2. What we just changed

This pass did four main things:

1. **Trust page wiring**

   - Restored `docs/site-v1` pages from the v9 UX branch.
   - Added a **Trust & identity** nav link that lands on `trust.html`.
   - Wrote a **GroupBuild trust & identity spec v1** and aligned it with:
     - CoIndex CoHalo / MeritRank spec.
     - CoSteward CoTrust / Identity BPOE.

2. **Join / pledge section**

   On the `index.html` landing page we added a **join / pledge experiment**:

   - Users see a **free membership** message.
   - They can move a slider to answer:  
     “If CoPolitic delivers on its promise in a year or two, what monthly amount would feel fair for you?”
   - They must tick a checkbox that makes it explicit:
     - This is **not** a payment.
     - It is an **anonymous signal of perceived value**, not a bill or gate.

   The idea: treat pricing as **a slow survey of trust and value**, not a barrier to entry.

3. **CoMetaTrain valueSignals**

   We added `docs/CoMetaTrain/CoPolitic_ValueSignals_v1.yaml` to document how AIs should treat this signal:

   - `membershipPledge` block captures:
     - site, currency and sample statistics (to be filled by tooling).
     - a clear note that the pledge is **imaginary subscription** value only.
   - `aiUse.allowed` includes:
     - Estimating sustainability scenarios.
     - Explaining to stewards how perceived value trends over time.
   - `aiUse.forbidden` includes:
     - Gating features by pledge size.
     - Inferring personal worth or morality from pledge size.
     - Changing safety or moderation policy by pledge size.

   This is a blueprint for **honest, non-exploitative value sensing**.

4. **Base skin CSS**

   We added `docs/site-v1/copolitic-v1.css` and linked it across all v1 pages:

   - Soft grey page background, white card for `<main>`.
   - Simple nav styling.
   - A styled block for the join / pledge section so it looks intentional rather than bolted on.

   The goal is not aesthetics heroics; it is **clean, legible, and obviously human-first**, with enough structure for future design passes.

---

## 3. Why the “free but pledge” pattern exists

CoPolitic is part of a wider CoCivium assumption:

> Default to **free access**, but collect **signals of perceived value** to guide when and how real pricing appears.

Reasons:

- Pricing dialogs are **emotionally loaded** and often exclusionary.
- Early in a civic tool’s life, you mostly need to know:
  - Does this feel like a **$0, $5, $20, $100** per month thing in people’s heads?
  - Does that perception move as we improve the work?
- Hard paywalls fight against **broad legitimacy** and experimentation.

So CoPolitic:

- Uses **pledges as votes of confidence**, not pay-to-play.
- Keeps membership **provisional and free** by default.
- Plans to introduce real tiers later only when:
  - The work clearly costs real money to sustain.
  - There is enough demand and trust to justify it.

All of this is explained in the transparency and trust copy, not hidden in terms.

---

## 4. Pattern for other CoCivium webservices

This CoPolitic pattern is meant as a **template** for CoCivium-aligned, commercially-aimed sites:

1. **Human-face site**

   - Small static site, structured content, clear nav.
   - **Trust**, **identity**, **transparency** and **“why free for now”** are first-class pages.
   - Join / pledge component that:
     - Is free.
     - States clearly what is and is not done with the data.
     - Feeds into a `valueSignals` or equivalent CoMetaTrain YAML.

2. **AI-face site (CoGbx / CoMeta)**

   - Mirrors the same commitments in machine-readable form:
     - Value signals.
     - Allowed vs forbidden AI uses.
     - Pledge interpretation rules.
   - Lets stewards run scenarios:
     - “If we turned real tiers on here, what happens to inclusion and sustainability?”

3. **When real tiers appear**

   When a product reaches the point where it must charge:

   - Use the historic **pledge distribution** as a sanity check.
   - Keep at least one **truly free tier** for civic and lower-income users.
   - Make “why these prices, why now” part of the transparency page, not marketing fluff.

4. **Re-use across the constellation**

   The same structure can be cloned to:

   - GroupBuild (build rooms, tools and mentoring).
   - CoAgent / CoArena variants.
   - Any future commercial-adjacent CoSuite sites.

   In each case:

   - The **mechanics** (join / pledge, valueSignals YAML, AI use rails) can be shared.
   - The **content** (what it is for, who it serves) is tailored per site.

---

## 5. Where this note fits in the repo

- Canonical path:  
  `docs/intent/CoPolitic_Summary_And_SitePattern_v1.md`

- Related assets:
  - `docs/site-v1/*.html` – public pages.
  - `docs/site-v1/copolitic-v1.css` – base skin.
  - `docs/CoMetaTrain/CoPolitic_ValueSignals_v1.yaml` – valueSignals / pledge logic.
  - `docs/trust/GroupBuild_TrustAndIdentity_v1.md` (in GroupBuild repo) – example of how trust specs align.

This note is meant to be the **anchor explainer** you can point other sessions and humans at when they ask:

> “What is CoPolitic, why is it free, and how should we build other sites like this?”