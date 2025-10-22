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
          const pad = 48;
          // dynamic dot radius (≈0.8% of min side, clamped 4..9) scaled by devicePixelRatio
          const DOT_R = Math.max(4, Math.min(9, Math.round(Math.min(wpx,hpx)*0.018))) * dpr;
    // scale knob (set window.PLANE_UI_SCALE from console if you want): default 1.6
    const __UIS = (typeof window.PLANE_UI_SCALE === "number" ? window.PLANE_UI_SCALE : 1.6);
    const DOT_R_SCALED = DOT_R * __UIS;
          for (const p of pts) {
            const x = pad + ((p.x + 1) / 2)      * (wpx - 2*pad);
            const y = pad + ((1 - (p.y + 1) / 2)) * (hpx - 2*pad);
            ctx.beginPath(); ctx.arc(x,y,DOT_R_SCALED, 0, Math.PI*2); ctx.fill();
           // subtle outline for contrast
           ctx.lineWidth = Math.max(1.25, 1.25*dpr); ctx.strokeStyle = "#dbe7ff33"; ctx.stroke();
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
/* === selection + explain === */
(() => {
  const g = window;
  function pxToPlane(c, x, y) {
    const pad = 40, w=c.width, h=c.height;
    const nx = ((x - pad) / Math.max(1,(w-2*pad))) * 2 - 1;
    const ny = (1 - ((y - pad) / Math.max(1,(h-2*pad)))) * 2 - 1;
    return {x:nx, y:ny};
  }
  function nearestEntity(c, x, y) {
    const ents = Array.isArray(g.ENTITIES)?g.ENTITIES:[];
    if (!ents.length) return null;
    const pt = pxToPlane(c,x,y);
    let best=null, bestD=1e9;
    for (const e of ents) {
      if (typeof e.x!=='number'||typeof e.y!=='number') continue;
      const dx=e.x-pt.x, dy=e.y-pt.y, d2=dx*dx+dy*dy;
      if (d2<bestD) { bestD=d2; best=e; }
    }
    return best && { entity:best, dist2:bestD };
  }
  function renderExplain(e){
    const box = document.querySelector('#plane-explain,[data-plane-explain]') ||
                document.querySelector('.explanation,.notes,#explain');
    if (!box) return;
    const m   = (g.PLANE_META && e && e.id && g.PLANE_META[e.id]) || {};
    const s   = e?.scores || {};
    const q   = n => +document.querySelector(`input[name="${n}"]`)?.value || 1;
    const w   = { commons:q('w-commons'), commerce:q('w-commerce'), club:q('w-club'), crown:q('w-crown') };
    const contrib = [
      ['Commons',  -(w.commons  * (+s.commons||0))],
      ['Commerce', +(w.commerce * (+s.commerce||0))],
      ['Club',     -(w.club     * (+s.club   ||0))],
      ['Crown',    +(w.crown    * (+s.crown  ||0))]
    ].map(([k,v])=>`<li>${k}: <code>${(+v).toFixed(3)}</code></li>`).join('');
    const sources = Array.isArray(m.sources)?m.sources:[];
    const srcHtml = sources.length
      ? `<ul>${sources.map(x=>`<li><a href="${x.url}" target="_blank" rel="noopener">${x.title||x.url}</a>${x.date?` · <small>${x.date}</small>`:''}</li>`).join('')}</ul>`
      : `<p><em>No citations yet — treat as provisional.</em></p>`;
    box.innerHTML = `
      <div style="font-weight:600;margin-bottom:6px">${e?.label||'Selection'}</div>
      <div style="opacity:.85;margin-bottom:8px">${m.summary||'Modeled position from weighted domains.'}</div>
      <div style="margin-bottom:8px">
        <div style="font-weight:600;margin-bottom:4px">Per-domain contributions</div>
        <ul style="margin:0 0 4px 18px">${contrib}</ul>
        <div><small>Weights: cmmns=${w.commons}, cmrc=${w.commerce}, club=${w.club}, crwn=${w.crown}</small></div>
      </div>
      <div><div style="font-weight:600;margin-bottom:4px">Sources</div>${srcHtml}</div>
    `;
  }
  function drawSelectionOverlay(c,e){
    if(!c||!e) return; const ctx=c.getContext('2d'); if(!ctx) return;
    const pad=40,w=c.width,h=c.height,dpr=Math.max(1,devicePixelRatio||1);
    const x = pad + ((e.x+1)/2)*(w-2*pad);
    const y = pad + ((1-(e.y+1)/2))*(h-2*pad);
    ctx.strokeStyle = "#3da5ff"; const SEL_R = Math.max(8, Math.min(14, Math.round(Math.min(w,h)*0.028))) * dpr;
    const SEL_R_SCALED = SEL_R * __UIS;
     ctx.lineWidth = 5*dpr; ctx.beginPath(); ctx.arc(x,y,SEL_R_SCALED,0,Math.PI*2); ctx.stroke();
  }
  const bootSelect=()=> {
    const c=document.querySelector('canvas'); if(!c||c.__planeClickWired) return;
    c.__planeClickWired=true;
    c.addEventListener('click',ev=>{
      const r=c.getBoundingClientRect();
      const hit=nearestEntity(c, ev.clientX-r.left, ev.clientY-r.top); if(!hit) return;
      g.PLANE_SELECTED=hit.entity;
      try{ g.draw?.(); }catch{}
      drawSelectionOverlay(c, hit.entity);
      renderExplain(hit.entity);
    },{passive:true});
  };
  (document.readyState==='loading')?document.addEventListener('DOMContentLoaded',bootSelect):bootSelect();
  new MutationObserver(bootSelect).observe(document.body,{childList:true,subtree:true});
})();

/* === rendered hit-test === */
(() => {
  const g = window;
  function pxToPlane(c, x, y) {
    const pad = 40, w=c.width, h=c.height;
    const nx = ((x - pad) / Math.max(1,(w-2*pad))) * 2 - 1;
    const ny = (1 - ((y - pad) / Math.max(1,(h-2*pad)))) * 2 - 1;
    return {x:nx, y:ny};
  }
  function nearestRendered(c, x, y) {
    const list = Array.isArray(g.PLANE_RENDERED) ? g.PLANE_RENDERED : [];
    if (!list.length) return null;
    const pt = pxToPlane(c, x, y);
    let best=null, bestD=1e9;
    for (const it of list) {
      const dx = it.x - pt.x, dy = it.y - pt.y, d2 = dx*dx + dy*dy;
      if (d2 < bestD) { bestD = d2; best = it; }
    }
    return best; // {x,y, entity|null}
  }
  function drawSelectionOverlay(c, x, y){
    if(!c) return; const ctx=c.getContext('2d'); if(!ctx) return;
    const pad=40,w=c.width,h=c.height,dpr=Math.max(1,devicePixelRatio||1);
    const sx = pad + ((x+1)/2)*(w-2*pad);
    const sy = pad + ((1-(y+1)/2))*(h-2*pad);
    ctx.strokeStyle='#3da5ff'; ctx.lineWidth=2*dpr;
    ctx.beginPath(); ctx.arc(sx, sy, 6*dpr, 0, Math.PI*2); ctx.stroke();
  }
  function renderExplain(e){
    const box = document.querySelector('#plane-explain,[data-plane-explain]') ||
                document.querySelector('.explanation,.notes,#explain');
    if (!box) return;
    if (!e) {
      box.innerHTML = '<em>No data for this point.</em>';
      return;
    }
    const s = e.scores || {};
    const q = n => +document.querySelector(`input[name="${n}"]`)?.value || 1;
    const w = { commons:q('w-commons'), commerce:q('w-commerce'), club:q('w-club'), crown:q('w-crown') };
    const contrib = [
      ['Commons',  -(w.commons  * (+s.commons||0))],
      ['Commerce', +(w.commerce * (+s.commerce||0))],
      ['Club',     -(w.club     * (+s.club   ||0))],
      ['Crown',    +(w.crown    * (+s.crown  ||0))]
    ].map(([k,v])=>`<li>${k}: <code>${(+v).toFixed(3)}</code></li>`).join('');
    box.innerHTML = `
      <div style="font-weight:600;margin-bottom:6px">${e.label||'Selection'}</div>
      <div style="margin-bottom:8px">
        <div style="font-weight:600;margin-bottom:4px">Per-domain contributions</div>
        <ul style="margin:0 0 4px 18px">${contrib}</ul>
      </div>`;
  }

  const boot = () => {
    const c = document.querySelector('canvas'); if (!c || c.__planeHitWired) return;
    c.__planeHitWired = true;
    c.addEventListener('click', ev => {
      const r=c.getBoundingClientRect();
      const hit = nearestRendered(c, ev.clientX - r.left, ev.clientY - r.top);
      if (!hit) return;
      // refresh draw, then overlay at the exact rendered location
      try { window.draw?.(); } catch {}
      drawSelectionOverlay(c, hit.x, hit.y);
      // explain only if this point represents a real entity
      renderExplain(hit.entity || null);
      if (hit.entity) window.PLANE_SELECTED = hit.entity;
    }, {passive:true});
  };
  (document.readyState==='loading') ? document.addEventListener('DOMContentLoaded', boot) : boot();
  new MutationObserver(boot).observe(document.body,{childList:true,subtree:true});
})();
