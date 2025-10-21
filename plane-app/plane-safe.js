;(() => {
  try {
    const g = window;

    // Safe encodeState (no-op) if the app doesn't define one
    if (typeof g.encodeState !== 'function') {
      g.encodeState = function(){ try { /* persist UI state here if needed */ } catch{} };
      try { console.log('[safe] encodeState shim active'); } catch{}
    }

    // Only install safe draw if the app doesn't provide one
    if (typeof g.draw !== 'function') {
      const safeDraw = () => {
        try {
          const c = document.querySelector('canvas'); if (!c) return;
          const dpr = Math.max(1, window.devicePixelRatio || 1);
          const r = c.getBoundingClientRect();
          const w = Math.max(820, Math.round(r.width * dpr) || 820);
          const h = Math.max(520, Math.round(r.height * dpr) || 520);
          if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }

          const ctx = c.getContext('2d'); if (!ctx) return;
          // background
          ctx.fillStyle = '#0e1726'; ctx.fillRect(0,0,w,h);

          // axes
          ctx.strokeStyle = '#223044'; ctx.lineWidth = 1 * dpr;
          ctx.beginPath(); ctx.moveTo(40, h/2); ctx.lineTo(w-20, h/2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(w/2, 20); ctx.lineTo(w/2, h-40); ctx.stroke();

          // points
          const ents = Array.isArray(g.ENTITIES) ? g.ENTITIES.slice(0, 40) : null;
          const pts = ents && ents.length
            ? ents.map((e,i) => {
                // Use precomputed e.x/e.y if present, else spread evenly so we see movement
                const ex = (typeof e.x === 'number') ? e.x : ((i+1)/(ents.length+1))*2-1;
                const ey = (typeof e.y === 'number') ? e.y : (0.3 + 0.4*((i*9301+49297)%10000)/10000)*2-1;
                return { id: e.id, label: e.label, x: ex, y: ey };
              })
            : Array.from({length:9}, (_,i) => ({ x: (i%3)/1.0 - 1/3, y:(Math.floor(i/3)/1.0 - 1/3) }));

          ctx.fillStyle = '#87bdff';
          const pad = 40;
          pts.forEach(p => {
            // normalize from [-1..1] into canvas box
            const x = pad + ((p.x+1)/2) * (w - 2*pad);
            const y = pad + ((1-(p.y+1)/2)) * (h - 2*pad);
            ctx.beginPath();
            ctx.arc(x, y, 3*dpr, 0, Math.PI*2);
            ctx.fill();
          });

          try { console.log('[safe] drew', pts.length, 'points'); } catch{}
        } catch (e) {
          try { console.warn('[safe draw] error', e) } catch{}
        }
      };

      g.draw = safeDraw;
      try { console.log('[safe] draw shim active'); } catch{}

      // draw on load for visibility
      const boot = () => { try { safeDraw(); } catch{} };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
      window.addEventListener('load', () => setTimeout(boot, 60));
      window.addEventListener('resize', () => setTimeout(safeDraw, 120));
    }
  } catch (e) {
    try { window._planeSafeErr = e } catch {}
  }
})();