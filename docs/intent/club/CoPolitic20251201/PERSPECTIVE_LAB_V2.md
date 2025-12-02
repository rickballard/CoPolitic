# CoPolitic – Perspective Lab v2 Concept (v1)

Session: CoPolitic20251201

---

## 1. Why the Perspective Lab exists

The Perspective Lab is the **shared instrument panel** for CAP:

- A set of **interactive maps and tools** that:

  - Make power, incentives, and alignment work visible.
  - Help de-polarise debates by focusing on **process and position**, not tribe.

- A way for CAP members and the public to see:

  - **Where actors sit** (for example Commons versus Commerce, Club versus Crown).
  - **How they move over time** as their behaviour changes.

The existing Plane prototype is a good starting point but needs to be:

- Better explained for non-experts.
- Better connected to exemplars, 3C Mark levels, and standards.
- Framed as an **optional lens**, not a gate to understanding the site.

---

## 2. Three layers of the Perspective Lab

### 2.1 Layer 1 – Model explainer (human-first)

A front page for the Lab that answers:

- **What are the axes?**

  - Example:

    - X: Commons ↔ Commerce  
    - Y: Club ↔ Crown

- **What do the quadrants roughly mean?**

  - Commons–Club, Commons–Crown, Commerce–Club, Commerce–Crown.

- **What are the dots?**

  - Organisations, coalitions, standards, or roles.

- **Why this matters for AI governance?**

  - Where capture risk lives.
  - Where civic leverage sits.
  - Where "quiet veto" power accumulates.

This page should be:

- Mostly text and simple diagrams.
- Free of heavy tooltips or keyboard shortcuts.
- Written so a busy regulator or funder can understand it in a few minutes.

### 2.2 Layer 2 – CAP Board / Radar

A "club view" of the Plane where:

- Each **CAP member, exemplar, or watched actor** appears as a dot.
- You can filter by:

  - Actor type (funders, labs, regulators, NGOs, stewards).
  - 3C Mark level (Observed, Pledged, Practicing, Verified).
  - Current status (challenged, suspended, and similar).

Interactions:

- Click a dot → right-hand panel with:

  - Short description.
  - Current 3C Mark level (if any).
  - Evidence stack summary.
  - Quick links to:

    - CoPolitic case note.
    - Evidence page.
    - Challenge or discussion thread.

Over time:

- Allow "timeline mode":

  - See how a dot has moved across the Plane as behaviour changes.

### 2.3 Layer 3 – Standards and Best-Practice Overlay

The Lab should not just show actors, but also **standards and covenants**.

Examples:

- A toggle that overlays:

  - Which actors have **adopted** a given standard.
  - Which are **working toward** it.
  - Which have **explicitly declined** or have no visible stance.

This layer becomes:

> The place where CAP can "splatter" standards, best practices, and vendor alignments  
> across the Plane in a way that is legible and explorable, not just a giant list.

Implementation ideas:

- Each standard appears as:

  - A "field" or contour that highlights actors in or near that standard's cluster.

- Clicking a standard:

  - Shows its definition and source.
  - Shows a list of actors with their status relative to it.

---

## 3. Public explanation versus expert modes

To keep the Lab accessible:

- **Default mode = simple.**

  - Basic axes.
  - A handful of dots.
  - Minimal controls.

- **Advanced mode = full Plane.**

  - More granular dimensions, for example:

    - Open versus closed ecosystems.
    - Civic versus shareholder primacy.

  - Multiple layers and time-series features.
  - Keyboard shortcuts, fine-grained filters, export options.

The UI should make it easy to:

- Start in **simple mode** from the main site.
- Opt into **advanced mode** from within the Lab.

---

## 4. Governance and transparency

Because the Plane can be politically sensitive, CAP must:

1. **Document how positions are assigned.**

   - Criteria and heuristics.
   - Who decided, and when.
   - Links to public discussions.

2. **Surface dissent.**

   - If there is internal disagreement about where an actor sits on the Plane:

     - Show that on the actor's panel.
     - Link to the discussion.

3. **Allow actors to respond.**

   - Any actor listed on the Plane should have a clear path to:

     - Submit corrections.
     - Provide counter-evidence.
     - Request a review.

4. **Align terms with CoIndex.**

   - Axes names, quadrant labels, and actor types should be:

     - Registered as terms in CoIndex / GIBindex.
     - Re-used consistently in other CoSuite tools.

---

## 5. Integration with the rest of the site

From the main CoPolitic site:

- **Home page**:

  - Shows a small preview graphic or "mini-plane".
  - CTA: "Explore the Perspective Lab".

- **Exemplar pages**:

  - Include a small icon or badge:

    - "See this actor on the Plane".

  - Clicking takes you directly to that actor's dot in the Lab.

- **3C Mark pages**:

  - Show how Mark levels correlate with positions on the Plane, where meaningful.
  - Avoid implying simple "up is good, down is bad" logic.

---

## 6. Implementation notes

- The current plane-app code can be:

  - Moved under a /lab/plane/ path.
  - Wrapped with the new explainer and filters.

- The Lab should consume:

  - A **single JSON feed** of actors, their positions, and metadata.

  - That feed should be generated from:

    - The same source of truth used for exemplars and 3C Mark registry.

As CoIndex and CoAudit mature, the Lab can:

- Read from more formal registries.
- Provide exports for research, oversight, and public investigation.

---
