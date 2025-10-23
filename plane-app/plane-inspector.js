;(() => {
  const $ = s => document.querySelector(s);
  function setBody(html){
    const el = $("#plane-inspector-body");
    if (el) el.innerHTML = html;
  }
  // Custom event path (preferred by render code once wired)
  window.addEventListener("plane:select", (ev) => {
    const d = ev.detail || {};
    const name = d.name || d.id || "Unknown";
    const xy = (d.x!=null && d.y!=null) ? ` @ (${d.x.toFixed?.(2) ?? d.x}, ${d.y.toFixed?.(2) ?? d.y})` : "";
    const meta = d.meta ? `<div style="margin-top:4px;font-size:12px;color:#cfe2ff">${d.meta}</div>` : "";
    setBody(`<b>${name}</b>${xy}${meta || '<div style="margin-top:4px">Placeholder details. Sources to follow.</div>'}`);
  }, {passive:true});

  // Fallback: basic canvas click -> show coords (until real hit-testing exists)
  function setupCanvasFallback(){
    const c = document.getElementById("plane-canvas");
    if (!c) return;
    c.addEventListener("click", (e) => {
      const r = c.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      setBody(`<b>Selected</b> @ (${x.toFixed(0)}, ${y.toFixed(0)})<div style="margin-top:4px">Hook your dot hit-test to emit <code>plane:select</code> with {id,name,x,y,meta}.</div>`);
    }, {passive:true});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupCanvasFallback);
  } else {
    setupCanvasFallback();
  }
})();
