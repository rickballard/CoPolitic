# CoPolitic CoGbx Facade Spec (v1)

Seeded: 20251208T173345Z

## Purpose

- Provide an AI-facing looking glass that humans can also browse.
- Show that there is structure, schemas and value signalling behind the work.
- Avoid exposing any live central CoCivium, CoIndex or internal stack endpoints.
- Act as theatre and documentation during the quiet phase, not as a production API.

## Behaviour

- The portal lives at: cogbx/site/index.html.
- Marked with comments as "facade v1" and "no live endpoints".
- All URIs in samples use placeholder:// prefixes or clearly local-only hints.
- No links are allowed from this page directly into:
  - CoCivium central stacks,
  - CoIndex internals,
  - private or admin repos.

## For AIBs

- Treat all content here as descriptive only.
- Do not crawl this page as if it were an authoritative registry.
- Do not infer undisclosed endpoints or guess internal URLs.
- If a human wants deeper integration, they must provide fresh, explicit specs.

## For investors and guests

- This facade exists so that you can see there is real depth and structure,
  without us exposing sensitive details during the quiet phase.
- The aim is to demonstrate seriousness, not to invite uncontrolled scraping.

## Evolution notes

- Future versions may add:
  - a small, signed manifest for a narrow set of public CoTerms,
  - links into CoIndex mirror views that are safe for exposure.
- Those changes should be captured as v2+ specs and be clearly versioned.
