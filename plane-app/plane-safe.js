;(() => {
  try {
    const g = window;

    // encodeState shim (no-op) and equalize shim (set sliders to 1)
    if (typeof g.encodeState !== "function") g.encodeState = () => {};
    if (typeof g.equalize   !== "function") g.equalize = () => {
      try {
        document.querySelectorAll('input[type=range][name^=w-]')
          .forEach(r => { r.value = "1"; r.dispatchEvent(new Event("input",{bubbles:true})); });
      } catch {}
    };

    // Only install fallback draw if the app doesn't already provide one
    if (typeof g.draw !== "function") {
      const draw = () => {
        try {
          const c = document.querySelector("canvas"); if (!c) return;
          const dpr = Math.max(1, g.devicePixelRatio || 1);
          const r = c.getBoundingClientRect();
          const w = Math.max(820, Math.round(r.width  * dpr) || 820);
          const h = Math.max(520, Math.round(r.height * dpr) || 520);
          if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
          const ctx = c.getContext("2d"); if (!ctx) return;

          // bg + axes
          ctx.fillStyle = "#0e1726"; ctx.fillRect(0,0,w,h);
          ctx.strokeStyle = "#223044"; ctx.lineWidth = 1 * dpr;
          ctx.beginPath(); ctx.moveTo(40, h/2); ctx.lineTo(w-20, h/2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(w/2, 20); ctx.lineTo(w/2, h-40); ctx.stroke();

          // choose visible entities
          const vis = g.vis || {};
          let ents = Array.isArray(g.ENTITIES) ? g.ENTITIES.slice() : [];
          const anyFlag = vis.countries || vis.parties || vis.modes;
          if (anyFlag) {
            ents = ents.filter(e =>
              (e.group==="country" && vis.countries) ||
              (e.group==="party"   && vis.parties)   ||
              (e.group==="mode"    && vis.modes)
            );
          }

          // default dots if no data
          let pts;
          if (ents.length) {
            pts = ents.map(e => ({
              id:e.id, label:e.label,
              x: (typeof e.x==="number") ? e.x : 0,
              y: (typeof e.y==="number") ? e.y : 0
            }));
          } else {
            pts = Array.from({length:9},(_,i)=>({ x:(i%3)/1.0 - 1/3, y:(Math.floor(i/3)/1.0 - 1/3) }));
          }

          // draw
          ctx.fillStyle = "#87bdff";
          const pad = 40;
          for (const p of pts) {
            const x = pad + ((p.x+1)/2)     * (w - 2*pad);
            const y = pad + ((1-(p.y+1)/2)) * (h - 2*pad);
            ctx.beginPath(); ctx.arc(x, y, 3*dpr, 0, Math.PI*2); ctx.fill();
          }
          console.log("[safe] drew", pts.length, "points (ents:", ents.length, ")");
        } catch (e) { try { console.warn("[safe draw] error", e) } catch {} }
      };

      g.draw = draw;
      const boot = () => { try { draw(); } catch {} };
      (document.readyState==="loading") ? document.addEventListener("DOMContentLoaded", boot) : boot();
      g.addEventListener("load",   () => setTimeout(boot, 60));
      g.addEventListener("resize", () => setTimeout(draw, 120));

      console.log("[safe] draw shim active (filtered)");
    }
  } catch (e) { try { window._planeSafeErr = e; } catch {} }
})();