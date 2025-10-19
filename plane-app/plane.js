/* DEFAULT_VISIBILITY_AND_WEIGHTS */
;(() => {
  let tries = 0;
  const tick = setInterval(() => {
    try {
      // wait until globals exist
      if (typeof vis==='object' && Array.isArray(ENTITIES)) {
        // 1) ensure one group is visible
        if (!(vis.countries || vis.parties || vis.modes)) { vis.modes = true; }

        // 2) if weights sum to zero, call equalize() if available
        if (typeof total==='function' && typeof equalize==='function') {
          // total() should update UI text and return sum (or we recompute on next draw)
          const before = total();
          if (!before || before===0) { equalize(); }
        }

        // 3) persist + draw
        if (typeof encodeState==='function') encodeState();
        if (typeof draw==='function') draw();

        // 4) show an explanation for the first visible entity
        if (typeof showExplainFor==='function') {
          const e = (Array.isArray(ENTITIES)?ENTITIES:[]).find(e =>
            (e.group==="country" && vis.countries) ||
            (e.group==="party"   && vis.parties)   ||
            (e.group==="mode"    && vis.modes)
          );
          if (e) showExplainFor(e);
        }

        // small debug handle
        try { window._planeDebug = { ENTITIES, vis, showExplainFor, encodeState, draw, total }; } catch {}
        clearInterval(tick);
      }
    } catch (err) { try { window._planeError = err; } catch {}; clearInterval(tick); }
    if (++tries > 120) clearInterval(tick); // ~12s cutoff
  }, 100);
})();
/* DEFAULT_VISIBILITY_ENSURE */
;(() => {
  let n = 0;
  const t = setInterval(() => {
    try {
      if (typeof vis === 'object' && Array.isArray(ENTITIES)) {
        if (!(vis.countries || vis.parties || vis.modes)) { vis.modes = true; }
        if (typeof encodeState==='function') encodeState();
        if (typeof draw==='function') draw();
        if (typeof showExplainFor==='function') {
          const e = ENTITIES.find(e =>
            (e.group==="country" && vis.countries) ||
            (e.group==="party"   && vis.parties)   ||
            (e.group==="mode"    && vis.modes)
          );
          if (e) showExplainFor(e);
        }
        try { window._planeDebug = { ENTITIES, vis, showExplainFor, encodeState, draw }; } catch {}
        clearInterval(t);
      }
    } catch(e) { try { window._planeError = e; } catch{}; clearInterval(t); }
    if (++n > 100) clearInterval(t);
  }, 100);
})();

const BUILD = Date.now().toString();
const BASE = new URL('.', document.currentScript?.src || location.href);
/* --- BEGIN Perspective Plane upgraded script (CoPolitic) --- */
/* paste the full upgraded script BETWEEN these <script> const BUILD = Date.now().toString();
const BASE = new URL('.', document.currentScript?.src || location.href);
tags – not at the PS prompt. */
/* It’s the version with: permalink (URL hash), flip/swap, hover crosshair, trails, error bars,
   domain sliders normalization, legend builder, quadrant tints, and click-to-explain. */
/* --- END Perspective Plane upgraded script (CoPolitic) --- */

;try{ window.addEventListener("load", () => {
  try {
    if (!location.hash && !(vis?.countries || vis?.parties || vis?.modes)) {
      vis.modes = true; encodeState(); draw();
    }
    const _fv = (ENTITIES||[]).find(e =>
      (e.group === "country" && vis?.countries) ||
      (e.group === "party"   && vis?.parties)   ||
      (e.group === "mode"    && vis?.modes)
    );
    if (_fv && typeof showExplainFor === "function") showExplainFor(_fv);
    window._planeDebug = { ENTITIES, vis, showExplainFor, encodeState, draw };
  } catch(e){ window._planeError = e; }
}); }catch(_e){}