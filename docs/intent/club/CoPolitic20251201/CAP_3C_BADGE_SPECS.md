# CoPolitic – CoCivium 3C Badge Specs (v1)

Session: CoPolitic20251201

---

## 1. Purpose

This document describes the **visual and usage rules** for the **CoCivium 3C Mark**:

- To keep the mark **recognisable** and **hard to co-opt**.
- To ensure it always points back to a **public evidence trail**.
- To make it easy for other CoSuite components (CoIndex, CoAudit, and similar) to recognise and parse.

---

## 2. Core symbol

### 2.1 Shape

- Three **nested, open "C" shapes**, rotated and spaced to suggest:
  - A head and torso in the negative space.
  - A series of concentric civic "rings" around the person.

Interpretation:

- The inner void = the human or hybrid agent.  
- The three Cs = **Commons**, **Covenant**, **Civium** (or similar trio; final semantics can be refined in CoIndex).

### 2.2 Geometry (developer-friendly description)

At a high level:

- Outer C: stroke forming roughly 270 degrees of a circle, open on the right side.
- Middle C: scaled-down version of the outer, following the same orientation.
- Inner C: further scaled-down, most suggestive of a head and torso silhouette in the negative space.

Implementation can start as an **SVG** in the repo, with:

- Parameters for stroke thickness.
- Colour variables (see below).
- Optional text container for level labels.

---

## 3. Colour and styles

To keep the mark neutral and easy to integrate:

- **Default monochrome usage:**

  - Single dark tone on light backgrounds.
  - Single light tone on dark backgrounds.

- **Accent palette (optional):**

  - Pledged: softer, lower-intensity accent.
  - Practicing: mid-intensity accent.
  - Verified: higher-intensity accent.

Constraints:

- No colour combination should mimic:

  - Political party branding in any major jurisdiction.
  - Existing, proprietary certification marks.

The repo should define:

- A **default neutral palette** (for example greys).
- An **optional civic palette** for use on CoCivium / CoPolitic properties only.

---

## 4. Badge compositions

### 4.1 Horizontal composition

- Left: 3C symbol (fixed size).
- Right: text block with:

  - Primary line:

    - CoCivium 3C Mark – Pledged
    - CoCivium 3C Mark – Practicing
    - CoCivium 3C Mark – Verified (vYYYY)

  - Optional secondary line:

    - "See evidence and challenges at CoPolitic.org" (or localised equivalent).

### 4.2 Compact icon

- For constrained UIs, a **standalone symbol** may be used.
- When used standalone:

  - A tooltip or nearby text must clarify the level.
  - The symbol must still **link to the evidence page** when clicked.

---

## 5. Usage rules

These rules apply to **all** uses of the 3C Mark:

1. **Link-back requirement**

   - Any web use must link to the organisation's **CoPolitic registry page**.
   - Offline uses (print) should include a URL or QR code.

2. **Scope clarity**

   - The badge must not be used in a way that suggests:

     - The entire organisation is verified, when only certain products or units are in scope.

   - Where scope is limited, a nearby text snippet should clarify:

     - "Scope: [systems or units]".

3. **No co-branding with pay-to-play seals**

   - The 3C Mark must not be **visually fused** with:

     - Commercial "trust seals".
     - Paid certification products.

   - Visual separation and labelling must remain clear.

4. **No "higher-tier for money"**

   - No commercial offer may imply:

     - "Work with us and we will help you get Verified faster."

   - Consultancy or advisory services may **prepare evidence**, but:

     - Mark decisions are made through CAP processes, not purchase.

5. **Misuse and revocation**

   - Misuse of the mark is grounds for:

     - Public notation on the registry page.
     - Suspension or revocation of the level.

   - Severe misuse (fraudulent or deceptive claims) should trigger:

     - Notification to relevant regulators or civic bodies where appropriate.

---

## 6. Implementation notes

To support CoIndex, CoAudit, and CoGbx:

- Provide a **machine-readable description** of:

  - Badge levels.
  - Badge shapes and CSS class names.
  - Link structure for registry pages.

Potential approach:

- A adges/3c-mark.json file describing:

  - Valid levels.
  - Version tags (v1, v2, and so on).
  - Semantic IDs that align with CoIndex terms.

---

## 7. Icon for "refusal to sell out"

To encode the "middle finger to captured certification" idea in a **subtle** way:

- Optionally include a tiny **"NOT FOR SALE"** or **"NO PAY-TO-PLAY"** string:

  - In the footer of the badge on CoPolitic.org.
  - On the 3C Mark explainer page.

This is more about **cultural signalling** than design:

- The real protection comes from:

  - Public evidence.
  - Open challenges.
  - Hard bans on undisclosed commercial influence.

---
