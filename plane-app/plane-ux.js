;(() => {
  const g = window;
  const log = (...a) => { try { console.log('[ux]', ...a) } catch{} };

  // Required API shims so clicks never explode
  if (typeof g.equalize !== 'function') g.equalize = () => {
    try {
      document.querySelectorAll('input[type=range][name^="w-"]')
        .forEach(r => { r.value='1'; r.dispatchEvent(new Event('input',{bubbles:true})) });
      log('equalize: set all weights = 1');
      g.draw?.();
    } catch (e) { console.warn('[ux] equalize error', e) }
  };
  if (typeof g.encodeState !== 'function') g.encodeState = () => {};

  function toggleVis(key) {
    g.vis = g.vis || {countries:false, parties:false, modes:false};
    const all = ['countries','parties','modes'];
    if (!all.includes(key)) return;
    // simple toggle, leave others as-is
    g.vis[key] = !g.vis[key];
    log('toggle', key, '→', g.vis[key]);
    try { g.encodeState?.(); } catch {}
    try { g.draw?.(); } catch {}
  }

  // Bind by ID if present
  function bindIds() {
    const pairs = [
      ['eq-btn', () => g.equalize?.()],
      ['reset-btn', () => { try {
          // reset = equalize + clear vis
          document.querySelectorAll('input[type=range][name^="w-"]').forEach(r => r.value='1');
          g.vis = {countries:false, parties:false, modes:false};
          log('reset'); g.draw?.();
        } catch (e) { console.warn('[ux] reset error', e) } }],
      ['toggle-countries-btn', () => toggleVis('countries')],
      ['toggle-parties-btn',   () => toggleVis('parties')],
      ['toggle-modes-btn',     () => toggleVis('modes')],
    ];
    for (const [id, fn] of pairs) {
      const el = document.getElementById(id);
      if (el && !el.__planeBound) {
        el.__planeBound = true;
        el.addEventListener('click', e => { e.preventDefault?.(); fn(); }, {passive:true});
        log('bound id', id);
      }
    }
  }

  // Delegate fallback (works even if buttons are re-rendered later)
  function bindDelegate() {
    const root = document;
    if (root.__planeDelegate) return;
    root.__planeDelegate = true;
    root.addEventListener('click', e => {
      const mm = (sel) => e.target?.closest?.(sel);
      if (mm('#eq-btn'))              { e.preventDefault(); g.equalize?.(); }
      else if (mm('#reset-btn'))      { e.preventDefault(); document.querySelectorAll('input[type=range][name^="w-"]').forEach(r => r.value='1'); g.vis={countries:false,parties:false,modes:false}; g.draw?.(); }
      else if (mm('#toggle-countries-btn')) { e.preventDefault(); toggleVis('countries'); }
      else if (mm('#toggle-parties-btn'))   { e.preventDefault(); toggleVis('parties'); }
      else if (mm('#toggle-modes-btn'))     { e.preventDefault(); toggleVis('modes'); }
    }, {passive:true});
    log('delegate bound');
  }

  // Hotkeys: E (equalize), 1/2/3 (countries/parties/modes)
  function bindKeys() {
    if (document.__planeKeys) return;
    document.__planeKeys = true;
    document.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      if (e.key === 'E' || e.key === 'e') { g.equalize?.(); }
      else if (e.key === '1') toggleVis('countries');
      else if (e.key === '2') toggleVis('parties');
      else if (e.key === '3') toggleVis('modes');
    });
    log('keys bound');
  }

  const boot = () => { bindIds(); bindDelegate(); bindKeys(); };
  (document.readyState === 'loading') ? document.addEventListener('DOMContentLoaded', boot) : boot();
  new MutationObserver(bindIds).observe(document.body, { childList:true, subtree:true });
})();
  // Fallback: direct onclicks (in case delegated binding is bypassed by the browser)
  ;(() => {
    const id = s => document.getElementById(s);
    const bind = (el, fn) => { if (el && !el.__planeOnClick) { el.__planeOnClick = true; el.onclick = (e) => { try{ e.preventDefault?.() }catch{}; fn(); }; } };
    bind(id('eq-btn'),       () => window.equalize?.());
    bind(id('reset-btn'),    () => { try {
      document.querySelectorAll('input[type=range][name^="w-"]').forEach(r => r.value='1');
      window.vis = {countries:false, parties:false, modes:false};
      window.draw?.();
    } catch {} });
    bind(id('toggle-countries-btn'), () => { window.vis = window.vis || {}; window.vis.countries = !window.vis.countries; window.encodeState?.(); window.draw?.(); });
    bind(id('toggle-parties-btn'),   () => { window.vis = window.vis || {}; window.vis.parties   = !window.vis.parties;   window.encodeState?.(); window.draw?.(); });
    bind(id('toggle-modes-btn'),     () => { window.vis = window.vis || {}; window.vis.modes     = !window.vis.modes;     window.encodeState?.(); window.draw?.(); });
  })();
/* text-based binder */
;(() => {
  const g = window;
  const norm = s => (s||'').replace(/\s+/g,' ').trim().toLowerCase();
  const labelIs = (el, pred) => pred(norm(el.textContent||''));
  const firstByText = (pred) => {
    const els = document.querySelectorAll('button, [role="button"], a, input[type=button]');
    for (const el of els) if (labelIs(el, pred)) return el;
    return null;
  };

  // Find key controls by their **visible labels**
  const btnEqualize = firstByText(t => t === 'equalize');
  const btnReset    = firstByText(t => t === 'reset');
  const btnTogCtry  = firstByText(t => t.startsWith('toggle countries'));
  const btnTogParty = firstByText(t => t.startsWith('toggle us parties') || t.startsWith('toggle parties'));
  const btnTogModes = firstByText(t => t.startsWith('toggle cocivium modes') || t.startsWith('toggle modes'));

  // Tag once for future quick binding
  const tag = (el, id) => { if (el && !el.id) { el.id = id; el.dataset.action = id; } };

  tag(btnEqualize, 'eq-btn');
  tag(btnReset,    'reset-btn');
  tag(btnTogCtry,  'toggle-countries-btn');
  tag(btnTogParty, 'toggle-parties-btn');
  tag(btnTogModes, 'toggle-modes-btn');

  // Robust onclick fallbacks (works even if passive listeners get ignored)
  const bind = (el, fn) => {
    if (!el || el.__planeOnClick) return;
    el.__planeOnClick = true;
    el.addEventListener('click', e => { try{ e.preventDefault?.() }catch{}; fn(); });
    el.onclick = el.onclick || (e => { try{ e.preventDefault?.() }catch{}; fn(); });
  };

  if (typeof g.equalize !== 'function') {
    g.equalize = () => {
      document.querySelectorAll('input[type=range][name^="w-"]')
        .forEach(r => { r.value = '1'; r.dispatchEvent(new Event('input',{bubbles:true})) });
      g.draw?.();
    };
  }

  const toggle = key => { g.vis = g.vis||{countries:false,parties:false,modes:false}; g.vis[key] = !g.vis[key]; g.encodeState?.(); g.draw?.(); };

  bind(btnEqualize, () => g.equalize?.());
  bind(btnReset,    () => { try {
    document.querySelectorAll('input[type=range][name^="w-"]').forEach(r => r.value='1');
    g.vis = {countries:false,parties:false,modes:false}; g.draw?.();
  } catch {} });
  bind(btnTogCtry,  () => toggle('countries'));
  bind(btnTogParty, () => toggle('parties'));
  bind(btnTogModes, () => toggle('modes'));

  // Safety net: delegated handler by label (covers rerenders)
  if (!document.__planeDelegateByText) {
    document.__planeDelegateByText = true;
    document.addEventListener('click', e => {
      const t = e.target?.closest('button,[role="button"],a,input[type=button]');
      if (!t) return;
      const txt = norm(t.textContent||'');
      if (txt === 'equalize') { e.preventDefault(); g.equalize?.(); }
      else if (txt === 'reset') { e.preventDefault(); document.querySelectorAll('input[type=range][name^="w-"]').forEach(r=>r.value='1'); g.vis={countries:false,parties:false,modes:false}; g.draw?.(); }
      else if (txt.startsWith('toggle countries')) { e.preventDefault(); toggle('countries'); }
      else if (txt.startsWith('toggle us parties') || txt.startsWith('toggle parties')) { e.preventDefault(); toggle('parties'); }
      else if (txt.startsWith('toggle cocivium modes') || txt.startsWith('toggle modes')) { e.preventDefault(); toggle('modes'); }
    });
  }
})();
/* binder: data-action + delegated click */
;(() => {
  const g = window;
  const norm = s => (s||'').replace(/\s+/g,' ').trim().toLowerCase();
  const scanAndTag = () => {
    const els = [...document.querySelectorAll('button,[role="button"],a,input[type=button]')];
    const findByText = (...preds) => els.find(el => preds.some(p => p(norm(el.textContent||''))));
    const map = {
      'eq-btn'              : findByText(t => t === 'equalize'),
      'reset-btn'           : findByText(t => t === 'reset'),
      'toggle-countries-btn': findByText(t => t.startsWith('toggle countries')),
      'toggle-parties-btn'  : findByText(t => t.startsWith('toggle us parties') || t.startsWith('toggle parties')),
      'toggle-modes-btn'    : findByText(t => t.startsWith('toggle cocivium modes') || t.startsWith('toggle modes')),
    };
    for (const [id, el] of Object.entries(map)) if (el) { if (!el.id) el.id = id; el.dataset.action = id; }
    return map;
  };

  if (typeof g.equalize !== 'function') {
    g.equalize = () => {
      document.querySelectorAll('input[type=range][name^="w-"]')
        .forEach(r => { r.value='1'; r.dispatchEvent(new Event('input',{bubbles:true})) });
      g.draw?.();
    };
  }
  const toggle = key => { g.vis = g.vis||{countries:false,parties:false,modes:false}; g.vis[key]=!g.vis[key]; g.encodeState?.(); g.draw?.(); };

  if (!document.__planeDelegateByAction) {
    document.__planeDelegateByAction = true;
    document.addEventListener('click', e => {
      const t = e.target?.closest('[data-action]');
      if (!t) return;
      e.preventDefault?.();
      const a = t.dataset.action;
      if (a === 'eq-btn') g.equalize?.();
      else if (a === 'reset-btn') { document.querySelectorAll('input[type=range][name^="w-"]').forEach(r=>r.value='1'); g.vis={countries:false,parties:false,modes:false}; g.draw?.(); }
      else if (a === 'toggle-countries-btn') toggle('countries');
      else if (a === 'toggle-parties-btn')   toggle('parties');
      else if (a === 'toggle-modes-btn')     toggle('modes');
    });
  }

  scanAndTag();
  new MutationObserver(scanAndTag).observe(document.body,{childList:true,subtree:true});
})();

;(() => {
  // Mini control that lets you tune PLANE_UI_SCALE on-page
  const boot = () => {
    const host = document.querySelector('#plane-size-ctrl');
    if (host) return; // already added
    const wrap = document.createElement('div');
    wrap.id = 'plane-size-ctrl';
    Object.assign(wrap.style, {
      position:'absolute', right:'10px', top:'10px', zIndex:50,
      background:'#0b1220', border:'1px solid #233047', borderRadius:'10px',
      padding:'6px 10px', color:'#9fb0c6', fontSize:'12px',
      boxShadow:'0 2px 10px rgba(0,0,0,.3)'
    });

    const label = document.createElement('label');
    label.textContent = 'Size ';
    label.style.marginRight = '6px';

    const slider = document.createElement('input');
    slider.type = 'range'; slider.min = '1.0'; slider.max = '3.5'; slider.step = '0.1';
    slider.style.width = '160px'; slider.style.verticalAlign = 'middle';

    // read persisted value
    let cur = Number(localStorage.getItem('PLANE_UI_SCALE'));
    if (!Number.isFinite(cur) || cur <= 0) cur = (typeof window.PLANE_UI_SCALE === 'number' ? window.PLANE_UI_SCALE : 1.6);
    slider.value = String(cur);

    const badge = document.createElement('span');
    badge.textContent = String(cur).replace(/(?<=\.\d)\d+$/, m => m.slice(0,1)); // short value
    badge.style.marginLeft = '8px'; badge.style.color = '#cfe2ff';

    slider.addEventListener('input', () => {
      const v = Number(slider.value);
      badge.textContent = v.toFixed(1);
      if (typeof window.setPlaneUiScale === 'function') window.setPlaneUiScale(v);
    }, {passive:true});

    wrap.appendChild(label); wrap.appendChild(slider); wrap.appendChild(badge);

    // place inside the canvas panel
    const panel = document.querySelector('.panel--canvas, .canvas, #plane-canvas')?.parentElement || document.querySelector('#plane-canvas')?.parentElement;
    const attachTo = panel || document.body;
    // Ensure the container can anchor absolute children
    if (panel && getComputedStyle(panel).position === 'static') panel.style.position = 'relative';
    attachTo.appendChild(wrap);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  new MutationObserver(boot).observe(document.body, {childList:true, subtree:true});
})();

/* plane-tooltips */
;(() => {
  const defs = {
    commons:  "Shared assets & infrastructures governed for broad benefit.",
    commerce: "Market-first production & exchange; enterprise & price signals.",
    club:     "Voluntary/federated coordination via associations and guild-like bodies.",
    crown:    "Centralized/state-led coordination via law, regulation, and executive action."
  };
  const norm = s => (s||"").trim().toLowerCase();
  function apply(){
    // any element with data-term="commons|commerce|club|crown"
    document.querySelectorAll("[data-term]").forEach(el=>{
      const t = norm(el.getAttribute("data-term"));
      if (defs[t] && !el.title) el.title = defs[t];
    });
    // convenience: add titles to glossary labels if found
    document.querySelectorAll("#plane-glossary b").forEach(b=>{
      const t = norm(b.textContent);
      if (defs[t] && !b.title) b.title = defs[t];
    });
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", apply); else apply();
  new MutationObserver(apply).observe(document.body,{childList:true,subtree:true});
})();
