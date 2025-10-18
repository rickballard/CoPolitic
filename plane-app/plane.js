
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