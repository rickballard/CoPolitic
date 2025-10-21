;(() => {
  try {
    const g = window;
    async function load() {
      const url = "data/entities.v1.json?v=" + Date.now();
      const r = await fetch(url, {cache:"no-store"});
      if (!r.ok) throw new Error("HTTP " + r.status);
      const json = await r.json();
      const raw = Array.isArray(json.entities) ? json.entities : [];

      g.ENTITIES = raw.map(e => {
        const out = {...e};
        if (g.PLANE_MODEL?.computePoint) {
          const p = g.PLANE_MODEL.computePoint(e.scores||{});
          const f = g.PLANE_MODEL.freshnessFactor ? g.PLANE_MODEL.freshnessFactor(e.sources||[]) : 1;
          out.x = p.x * f; out.y = p.y * f;
        } else if (e.scores) {
          out.x = (+e.scores.commerce||0) - (+e.scores.commons||0);
          out.y = (+e.scores.crown||0)    - (+e.scores.club||0);
        }
        return out;
      });

      // Pick a default visible group matching the data we actually have
      const groups = new Set(g.ENTITIES.map(e => e.group));
      g.vis = g.vis || {countries:false, parties:false, modes:false};
      if (!(g.vis.countries || g.vis.parties || g.vis.modes)) {
        if      (groups.has("party"))   g.vis.parties = true;
        else if (groups.has("country")) g.vis.countries = true;
        else                             g.vis.modes = true;
      }

      try { typeof g.encodeState==='function' && g.encodeState(); } catch {}
      try { typeof g.draw==='function'        && g.draw();        } catch {}
      console.log("[data] loaded", {count:g.ENTITIES.length, groups:[...groups]});
    }
    (document.readyState==="loading") ? document.addEventListener("DOMContentLoaded", load) : load();
  } catch (e) { try { console.warn("[data] error", e); window._planeDataErr = e; } catch {} }
})();