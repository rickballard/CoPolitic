;(()=>{try{
  const hasSmoke = /(^|[?&])smoke=1(\b|&|$)/i.test(location.search);
  if(!hasSmoke) return;
  function ready(fn){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",fn,{once:true}):fn();}
  function pickPoint(){
    const pts = (Array.isArray(window.__planePoints)&&window.__planePoints.length)?window.__planePoints:null;
    if(pts){ return pts.find(p=>p.id!=="cocivium") || pts[0]; }
    return {id:"usa", name:"United States", x:0.35, y:0.15, meta:"Smoke test"}; // fallback
  }
  ready(()=>{
    const hit = pickPoint();
    if(!hit) return;
    setTimeout(()=>{ try{ window.dispatchEvent(new CustomEvent("plane:select",{detail:hit})); }catch{} }, 300);
    // add a tiny banner so you know it's active
    const b=document.createElement("div");
    b.style.cssText="position:fixed;bottom:10px;right:10px;background:#0b1426;color:#cfe2ff;border:1px solid #233047;padding:6px 8px;border-radius:8px;font:12px system-ui;z-index:9999";
    b.textContent="SMOKE: fired plane:select";
    document.body.appendChild(b); setTimeout(()=>b.remove(),2500);
  });
}catch(_){}})();