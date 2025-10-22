;(() => {
  try {
    // Simple linear mapping with optional freshness decay.
    // x = Commerce - Commons ; y = Crown - Club (example; match your axes)
    function computePoint(scores, now = new Date()) {
      const s = scores || {};
      const commons = +s.commons || 0, commerce = +s.commerce || 0, club = +s.club || 0, crown = +s.crown || 0;
      const x = commerce - commons;
      const y = crown - club;
      return { x, y };
    }

    // Apply a mild freshness decay if provided a source date array.
    function freshnessFactor(sources, now = new Date()) {
      try {
        if (!Array.isArray(sources) || sources.length === 0) return 1;
        const newest = sources
          .map(s => new Date(s.date))
          .filter(d => !isNaN(d))
          .sort((a,b)=>b-a)[0];
        if (!newest) return 1;
        const days = (now - newest) / (1000*60*60*24);
        // 0–180 days: 1 → ~0.8 ; older decays further but never below 0.6
        const f = Math.max(0.6, 1 - Math.min(days, 360) / 900);
        return f;
      } catch { return 1; }
    }

    // Public API
    window.PLANE_MODEL = { computePoint, freshnessFactor };

    // Optional: attach computed positions into ENTITIES when both layers are present
    const attach = () => {
      try {
        const ents = Array.isArray(window.ENTITIES) ? window.ENTITIES : null;
        if (!ents) return;
        ents.forEach(e => {
          if (e.scores && (typeof e.x!=='number' || typeof e.y!=='number')) {
            const f = freshnessFactor(e.sources);
            const p = computePoint(e.scores);
            e.x = p.x * f; e.y = p.y * f;
          }
        });
      } catch {}
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach); else attach();
    window.addEventListener('load', () => setTimeout(attach, 60));
  } catch (e) { try { window._planeModelErr = e } catch {} }
})();