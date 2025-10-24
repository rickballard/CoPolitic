;(()=>{ const $=s=>document.querySelector(s);
  function render(d){
    const box=$("#plane-inspector-body"); if(!box) return;
    const M=(window.__planeMeta||{})[d.id]||{};
    const meta = M.meta || d.meta || "";
    const xy = (d.x!=null&&d.y!=null)?` @ (${(d.x.toFixed?.(2)||d.x)}, ${(d.y.toFixed?.(2)||d.y)})`:"";
    const links = (M.sources||[]).slice(0,5).map(s=> s?.u
      ? `<li><a href="${s.u}" target="_blank" rel="noopener">${s.t||s.u}</a></li>`
      : (s?.t?`<li>${s.t}</li>`:"")).join("");
    const ul = links ? `<ul style="margin:6px 0 0 16px;font-size:12px">${links}</ul>` : "";
    box.innerHTML = `<b>${d.name||d.id||"Selection"}</b>${xy}`
                   + (meta?`<div style="margin-top:4px">${meta}</div>`
                          : `<div style="margin-top:4px">No notes yet.</div>`)
                   + ul;
  }
  window.addEventListener("plane:select", ev=>render(ev.detail||{}), {passive:true});
})();