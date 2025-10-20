;(() => {
  try {
    const g = window;

    // ---- helpers -----------------------------------------------------------
    const safe = f => { try { return typeof f === 'function' ? f : null } catch { return null } };
    const api  = {
      draw        : g.draw        || g.PLANE?.draw,
      total       : g.total       || g.PLANE?.total,
      equalize    : g.equalize    || g.PLANE?.equalize,
      encodeState : g.encodeState || g.PLANE?.encodeState,
    };
    const ensureVis = () => { g.vis = g.vis || { countries:false, parties:false, modes:false } };
    const redraw = () => { try { safe(api.encodeState)?.(); } catch {} try { safe(api.draw)?.(); } catch {} };

    // ---- robust click wiring via delegation -------------------------------
    const clickHandler = (ev) => {
      const el = ev.target.closest('button, input[type=button], a, *[role=button]');
      if (!el) return;

      const text = (el.textContent || el.value || '').toLowerCase();
      const act = (
        text.includes('equalize')       ? 'equalize' :
        text.includes('reset')          ? 'reset'    :
        text.includes('toggle countr')  ? 'countries':
        text.includes('toggle us part') ? 'parties'  :
        text.includes('toggle cociv')   ? 'modes'    :
        null
      );

      if (!act) return;
      ev.preventDefault();

      if (act === 'equalize') { try { safe(api.equalize)?.(); } catch {} redraw(); return; }
      if (act === 'reset') {
        try { document.querySelectorAll('input[type=range][name^=w-]').forEach(r => { r.value='0'; r.dispatchEvent(new Event('input',{bubbles:true})) }); } catch {}
        redraw(); return;
      }
      // toggles
      ensureVis();
      g.vis[act] = !g.vis[act];
      redraw();
    };

    document.addEventListener('click', clickHandler, true);

    // ---- hotkeys -----------------------------------------------------------
    g.addEventListener('keydown', (ev) => {
      const k = ev.key.toLowerCase();
      if (k === 'e') { ev.preventDefault(); try { safe(api.equalize)?.(); } catch {} redraw(); }
      if (k === '1') { ev.preventDefault(); ensureVis(); g.vis.countries = !g.vis.countries; redraw(); }
      if (k === '2') { ev.preventDefault(); ensureVis(); g.vis.parties   = !g.vis.parties;   redraw(); }
      if (k === '3') { ev.preventDefault(); ensureVis(); g.vis.modes     = !g.vis.modes;     redraw(); }
    });

    // ---- boot: ensure at least one visible group + draw -------------------
    const boot = () => {
      try {
        ensureVis();
        if (!(g.vis.countries || g.vis.parties || g.vis.modes)) g.vis.modes = true;
        try { if (safe(api.total) && safe(api.equalize)) { const t = api.total(); if (!t || t === 0) api.equalize(); } } catch {}
        redraw();
      } catch (e) { try { g._planeUXBootErr = e } catch {} }
    };

    (document.readyState === 'loading') ? document.addEventListener('DOMContentLoaded', boot) : boot();
    g.addEventListener('load', () => setTimeout(boot, 50));

    // ---- resize redraw (throttled) ----------------------------------------
    let resizeTick = 0;
    g.addEventListener('resize', () => {
      clearTimeout(resizeTick);
      resizeTick = setTimeout(redraw, 120);
    });

    // ---- optional debug panel (?debug=1) ----------------------------------
    if (/\bdebug=1\b/i.test(g.location.search)) {
      const box = document.createElement('div');
      box.style.cssText = 'position:fixed;right:10px;bottom:10px;z-index:9999;background:#0d1422;color:#9fb0c6;border:1px solid #233047;border-radius:8px;padding:8px;max-width:320px;font:12px/1.3 system-ui, sans-serif';
      box.innerHTML = '<b>Plane debug</b><div id="dbg"></div>';
      document.body.appendChild(box);

      const dbg = () => {
        const entsLen = Array.isArray(g.ENTITIES) ? g.ENTITIES.length : null;
        const vis = JSON.stringify(g.vis || {});
        const flags = ['draw','total','equalize','encodeState'].map(k => `${k}:${typeof g[k]}`).join(' ');
        document.getElementById('dbg').textContent = `ENTITIES=${entsLen}  vis=${vis}  ${flags}`;
      };
      setInterval(dbg, 500);
      dbg();
    }
  } catch (e) { try { window._planeUXErr = e } catch {} }
})();
/* === ID-FIRST WIRING & CLICK FLASH === */
(function(){
  try{
    const g=window;
    const safe=f=>{try{return typeof f==='function'?f:null}catch{return null}};
    const api={draw:g.draw||g.PLANE?.draw,total:g.total||g.PLANE?.total,equalize:g.equalize||g.PLANE?.equalize,encodeState:g.encodeState||g.PLANE?.encodeState};
    const ensureVis=()=>{g.vis=g.vis||{countries:false,parties:false,modes:false}};
    const redraw=()=>{try{safe(api.encodeState)?.()}catch{} try{safe(api.draw)?.()}catch{}};
    const flash=(el)=>{try{el?.classList?.add('plane-flash'); setTimeout(()=>el?.classList?.remove('plane-flash'),180);}catch{}};

    // add flash style once
    if(!document.getElementById('plane-flash-style')){
      const s=document.createElement('style'); s.id='plane-flash-style';
      s.textContent='.plane-flash{outline:2px solid #3da5ff; transition:outline .18s ease}';
      document.head.appendChild(s);
    }

    const handlers={
      equalize:(el)=>{console.log('[ux] click equalize'); try{safe(api.equalize)?.()}catch{} redraw(); flash(el)},
      reset:(el)=>{console.log('[ux] click reset'); try{document.querySelectorAll('input[type=range][name^=w-]').forEach(r=>{r.value='0'; r.dispatchEvent(new Event('input',{bubbles:true}))})}catch{} redraw(); flash(el)},
      countries:(el)=>{console.log('[ux] click countries'); ensureVis(); g.vis.countries=!g.vis.countries; redraw(); flash(el)},
      parties:(el)=>{console.log('[ux] click parties'); ensureVis(); g.vis.parties=!g.vis.parties; redraw(); flash(el)},
      modes:(el)=>{console.log('[ux] click modes'); ensureVis(); g.vis.modes=!g.vis.modes; redraw(); flash(el)}
    };

    // ID-first binding (runs once, and on mutations)
    const bindById=()=>{
      const map=[
        ['#eq-btn','equalize'],
        ['#reset-btn','reset'],
        ['#toggle-countries-btn','countries'],
        ['#toggle-parties-btn','parties'],
        ['#toggle-modes-btn','modes'],
      ];
      let bound=0;
      for(const [sel,act] of map){
        const el=document.querySelector(sel);
        if(el && !el.__planeBound){
          el.__planeBound=true;
          el.addEventListener('click',e=>{e.preventDefault(); handlers[act](el)});
          console.log('[ux] wired by id:', sel);
          bound++;
        }
      }
      return bound;
    };

    // Keep existing delegation as fallback by text
    const delegated=(ev)=>{
      const el=ev.target.closest('button, input[type=button], a, *[role=button]'); if(!el) return;
      const txt=(el.textContent||el.value||'').toLowerCase();
      const act = txt.includes('equalize')?'equalize':
                  txt.includes('reset')?'reset':
                  txt.includes('toggle countr')?'countries':
                  txt.includes('toggle us part')?'parties':
                  txt.includes('toggle cociv')?'modes':null;
      if(!act) return;
      ev.preventDefault();
      handlers[act](el);
    };

    document.removeEventListener('click', delegated, true); // avoid dup if present
    document.addEventListener('click', delegated, true);

    const start=()=>{ bindById(); };
    (document.readyState==='loading')?document.addEventListener('DOMContentLoaded',start):start();
    new MutationObserver(()=>bindById()).observe(document.body,{childList:true,subtree:true});

  }catch(e){ try{window._planeIdWireErr=e}catch{} }
})();