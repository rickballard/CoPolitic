;(()=>{try{
  if(!window.__planeMeta && window.fetch){
    fetch("/data/country-notes.json",{cache:"no-store"})
      .then(r=>r.ok?r.json():{}).then(j=>{ window.__planeMeta=j||{}; })
      .catch(()=>{});
  }
}catch(_){}})();