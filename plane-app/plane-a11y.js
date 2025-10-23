;(() => {
  const c = document.getElementById("plane-canvas");
  if (!c) return;
  c.setAttribute("role","img");
  c.setAttribute("aria-label","Perspective Plane: countries vs CoCivium across Commons–Commerce and Club–Crown axes.");
  c.setAttribute("tabindex","0");
  c.addEventListener("keydown",(e)=>{
    if (e.key === "Enter" || e.key === " ") {
      // Nudge users to click a dot; we don’t synthesize a hit without coordinates.
      try { window.dispatchEvent(new CustomEvent("plane:select",{ detail:{ id:"hint", name:"Tip", meta:"Use the mouse or touch to select a country dot." }})); } catch {}
      e.preventDefault();
    }
  });
})();