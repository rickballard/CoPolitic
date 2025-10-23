;(() => {
  const C = id => document.getElementById(id);

  function pxToNorm(canvas, pxX, pxY) {
    // Assume plane spans a centered square region inside the canvas
    const r = canvas.getBoundingClientRect();
    const w = r.width, h = r.height;
    const side = Math.min(w, h);
    const ox = (w - side) / 2;
    const oy = (h - side) / 2;

    // pixel → [-1,1] with origin in middle
    const nx = ((pxX - ox) / side) * 2 - 1;     // left=-1, right=+1
    const ny = -(((pxY - oy) / side) * 2 - 1);  // top=+1 → y=+1
    return { x: nx, y: ny };
  }

  function normToPx(canvas, nx, ny) {
    const r = canvas.getBoundingClientRect();
    const w = r.width, h = r.height;
    const side = Math.min(w, h);
    const ox = (w - side) / 2;
    const oy = (h - side) / 2;

    const pxX = ox + ((nx + 1) / 2) * side;
    const pxY = oy + ((-ny + 1) / 2) * side;
    return { x: pxX, y: pxY };
  }

  async function loadPoints() {
    // If your renderer exposes window.__planePoints (norm space), prefer that.
    if (Array.isArray(window.__planePoints) && window.__planePoints.length) {
      return window.__planePoints;
    }
    // Fallback to demo file
    try {
      const r = await fetch('/plane-app/demo-countries.json', {cache:'no-store'});
      if (r.ok) return await r.json();
    } catch {}
    return [];
  }

  function nearestPoint(canvas, pts, pxX, pxY) {
    let best = null, bestD = Infinity;
    for (const p of pts) {
      const q = normToPx(canvas, p.x, p.y);
      const dx = q.x - pxX, dy = q.y - pxY;
      const d2 = dx*dx + dy*dy;
      if (d2 < bestD) { bestD = d2; best = p; }
    }
    // Require a loose proximity (~18px) so empty clicks don’t select
    return (best && Math.sqrt(bestD) <= 18) ? best : null;
  }

  function emitSelect(detail) {
    try { window.dispatchEvent(new CustomEvent('plane:select', { detail })); } catch {}
  }

  function setup() {
    const c = C('plane-canvas');
    if (!c) return;

    let pts = null;
    loadPoints().then(v => { pts = v; });

    c.addEventListener('click', (e) => {
      const r = c.getBoundingClientRect();
      const px = e.clientX - r.left, py = e.clientY - r.top;
      const norm = pxToNorm(c, px, py);

      // If we have points, snap to nearest; else just report coords
      let detail = { id: 'coord', name: 'Selection', x: norm.x, y: norm.y,
                     meta: 'Demo wiring — replace with real dot data.' };

      if (Array.isArray(pts) && pts.length) {
        const hit = nearestPoint(c, pts, px, py);
        if (hit) {
          detail = { id: hit.id, name: hit.name, x: hit.x, y: hit.y,
                     meta: 'Demo country set (swap for real data).' };
        }
      }
      emitSelect(detail);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();