;(() => {
  try {
    const g = window;

    // --- helpers -----------------------------------------------------------
    const num = v => isFinite(+v) ? +v : 0;
    const getWeights = () => {
      // Read from sliders if they exist; else default to 1
      const q = name => document.querySelector(`input[type=range][name="${name}"]`);
      const w = {
        commons : num(q('w-commons') ?.value ?? 1),
        commerce: num(q('w-commerce')?.value ?? 1),
        club    : num(q('w-club')    ?.value ?? 1),
        crown   : num(q('w-crown')   ?.value ?? 1),
      };
      // If all zeros, default to 1s
      if (!w.commons && !w.commerce && !w.club && !w.crown) {
        w.commons = w.commerce = w.club = w.crown = 1;
      }
      return w;
    };

    const computeXY = (scores, w) => {
      const s = scores || {};
      const commons = num(s.commons), commerce = num(s.commerce);
      const club    = num(s.club),    crown   = num(s.crown);
      // Canon axes: X = Commons ←→ Commerce, Y = Club ←→ Crown
      // We model as (Commerce - Commons) and (Crown - Club), each scaled by weights.
      const x = (w.commerce*commerce) - (w.commons*commons);
      const y = (w.crown*crown)       - (w.club*club);
      // Values are in [-1..1] if scores are 0..1 and weights roughly similar.
      return {x, y};
    };

    // Shims so buttons keep working even if app code is minimal
    if (typeof g.encodeState !== 'function') g.encodeState = () => {};
    if (typeof g.equalize   !== 'function') g.equalize = () => {
      try {
        document.querySelectorAll('input[type=range][name^="w-"]')
          .forEach(r => { r.value = '1'; r.dispatchEvent(new Event('input', {bubbles:true})) });
      } catch {}
    };

    // --- draw (fallback) ---------------------------------------------------
    if (typeof g.draw !== 'function') {
      const draw = () => {
        try {
          const c = document.querySelector('canvas'); if (!c) return;
          const dpr = Math.max(1, g.devicePixelRatio || 1);
          const r = c.getBoundingClientRect();
          const wpx = Math.max(820, Math.round(r.width  * dpr) || 820);
          const hpx = Math.max(520, Math.round(r.height * dpr) || 520);
          if (c.width !== wpx || c.height !== hpx) { c.width = wpx; c.height = hpx; }
          const ctx = c.getContext('2d'); if (!ctx) return;

          // background + axes
          ctx.fillStyle = '#0e1726'; ctx.fillRect(0,0,wpx,hpx);
          ctx.strokeStyle = '#223044'; ctx.lineWidth = 1 * dpr;
          ctx.beginPath(); ctx.moveTo(40, hpx/2); ctx.lineTo(wpx-20, hpx/2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(wpx/2, 20); ctx.lineTo(wpx/2, hpx-40); ctx.stroke();

          // pick visible entities
          const vis = g.vis || {};
          let ents = Array.isArray(g.ENTITIES) ? g.ENTITIES.slice() : [];
          const any = vis.countries || vis.parties || vis.modes;
          if (any) {
            ents = ents.filter(e =>
              (e.group==='country' && vis.countries) ||
              (e.group==='party'   && vis.parties)   ||
              (e.group==='mode'    && vis.modes)
            );
          }

          // compute positions using current weights
          const wts = getWeights();
          const pts = (ents.length ? ents : Array.from({length:9}, (_,i)=>({
            // fallback demo grid if no ents
            x:(i%3)/1.0 - 1/3, y:(Math.floor(i/3)/1.0 - 1/3)
          }))).map((e,i) => {
            if (!e.scores) return {x: e.x ?? ((i+1)/(9+1))*2-1, y: e.y ?? 0};
            const p = computeXY(e.scores, wts);
            // keep a copy for explainers
            e.x = p.x; e.y = p.y;
            return p;
          });

          // draw points
          ctx.fillStyle = '#87bdff';
          const pad = 40;
          for (const p of pts) {
            const x = pad + ((p.x + 1) / 2)      * (wpx - 2*pad);
            const y = pad + ((1 - (p.y + 1) / 2)) * (hpx - 2*pad);
            ctx.beginPath(); ctx.arc(x, y, 3*dpr, 0, Math.PI*2); ctx.fill();
          }

          console.log('[safe] drew', pts.length, 'points; weights=', wts);
        } catch (e) { try { console.warn('[safe draw] error', e) } catch {} }
      };

      g.draw = draw;

      // redraw when sliders move
      const rebinder = () => {
        try {
          document.querySelectorAll('input[type=range][name^="w-"]').forEach(r => {
            if (!r.__planeBound) {
              r.__planeBound = true;
              r.addEventListener('input', () => setTimeout(draw, 0), {passive:true});
              r.addEventListener('change', () => setTimeout(draw, 0), {passive:true});
            }
          });
        } catch {}
      };

      const boot = () => { rebinder(); try { draw(); } catch {} };
      (document.readyState === 'loading') ? document.addEventListener('DOMContentLoaded', boot) : boot();
      g.addEventListener('load',   () => setTimeout(boot, 60));
      g.addEventListener('resize', () => setTimeout(draw, 120));
      new MutationObserver(() => rebinder()).observe(document.body, {childList:true, subtree:true});

      console.log('[safe] draw shim active (weight-aware)');
    }
  } catch (e) { try { window._planeSafeErr = e } catch {} }
})();