;(()=>{ function ready(fn){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",fn,{once:true}):fn();}
ready(()=>{ const hasReal = Array.isArray(window.__planePoints) && window.__planePoints.length>0;
            const b=document.getElementById("plane-demo-badge");
            if (hasReal && b) b.style.display="none"; });
})();