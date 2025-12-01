# PRIME START  -  Make the Plane alive (handoff)
- Use `scripts/Generate-PlanePoints.ps1 -InputJson data/points.json`.
- Inline points load via `plane-app/points-inline.js`; demo file: `plane-app/demo-countries.json`.
- Clicks → `plane-app/plane-hit.js` dispatches `plane:select`; inspector shows details.
- Layer label live count: `plane-app/plane-layers.js`; a11y: `plane-app/plane-a11y.js`.
- Start from `data/points.example.json` → copy to `data/points.json` and edit x/y (−1..1) and `meta`.

