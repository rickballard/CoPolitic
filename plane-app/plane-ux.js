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