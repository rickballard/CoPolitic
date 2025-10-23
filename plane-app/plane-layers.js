;(() => {
  const q = (s, r=document) => r.querySelector(s);

  function getPoints(){
    if (Array.isArray(window.__planePoints) && window.__planePoints.length) return window.__planePoints;
    // Fallback to demo (best effort; async ping then cache)
    if (!window.__planeDemoPromise){
      window.__planeDemoPromise = fetch("/plane-app/demo-countries.json",{cache:"no-store"})
        .then(r=>r.ok?r.json():[]).catch(()=>[]);
    }
    return window.__planePoints || []; // immediate return (count may update later)
  }

  async function countCountries(){
    const pts = Array.isArray(window.__planePoints) && window.__planePoints.length
      ? window.__planePoints
      : await (window.__planeDemoPromise || Promise.resolve([]));
    // Treat everything except the strawman as a "country"
    return pts.filter(p => (p.id||"").toLowerCase() !== "cocivium").length;
  }

  function findToggleBtn(){
    const candidates = Array.from(document.querySelectorAll("button, a"))
      .filter(el => /toggle\s*countries/i.test(el.textContent||""));
    return candidates[0] || null;
  }

  async function labelify(btn){
    if (!btn) return;
    const n = await countCountries();
    const on = (localStorage.getItem("PLANE_COUNTRIES_ON") ?? "1") !== "0";
    btn.textContent = `Toggle Countries (${n} ${on?"visible":"hidden"})`;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  }

  function tap(){
    const btn = findToggleBtn();
    if (!btn) return;

    // If the host already toggles visibility, we just mirror state.
    // We also store a local flag to keep label honest across reloads.
    btn.addEventListener("click", () => {
      const cur = (localStorage.getItem("PLANE_COUNTRIES_ON") ?? "1") !== "0";
      const next = !cur;
      localStorage.setItem("PLANE_COUNTRIES_ON", next ? "1" : "0");
      labelify(btn);
    }, {passive:true});

    labelify(btn);

    // Refresh label when points arrive (demo async)
    (window.__planeDemoPromise||Promise.resolve()).then(()=>labelify(btn));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tap, {once:true});
  } else {
    tap();
  }
})();