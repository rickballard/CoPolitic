.\plane-app\plane.js
window.PLANE_META = window.PLANE_META || {};
try {
  window.PLANE_META[""us-democrats""] = Object.assign(
    window.PLANE_META[""us-democrats""]||{},
    {
      summary: "Center-left on Commons; lower on Crown; moderate Commerce/Club. (Demo text — replace with sourced rationale.)",
      sources: [
        { title: "Democrats overview (placeholder)", url: "https://example.org/dems", date: "2025-10-20" }
      ]
    }
  );
  window.PLANE_META[""us-republicans""] = Object.assign(
    window.PLANE_META[""us-republicans""]||{},
    {
      summary: "Higher Commerce/Crown tilt; lower Commons. (Demo text — replace with sourced rationale.)",
      sources: [
        { title: "Republicans overview (placeholder)", url: "https://example.org/gop", date: "2025-10-20" }
      ]
    }
  );
} catch {}