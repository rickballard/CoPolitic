(() => {
  const DAYS=14, LOG_BASE="/status/log/", KEY="COEV_APPROVALS";
  const qs=s=>document.querySelector(s), statusEl=qs("#evo-status"), listEl=qs("#evo-list");
  const nowIso=()=>new Date().toISOString(), fmtPri=p=>p===1?"P1":p===2?"P2":"P3";
  const load=()=>{ try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return{}} };
  const save=o=>{ try{localStorage.setItem(KEY,JSON.stringify(o))}catch{} };
  const tryFetch=async url=>{ try{const r=await fetch(url,{cache:"no-store"}); if(!r.ok) return null; return { url, text: await r.text() };}catch{return null;} };
  const yyyymmdd=d=>`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  async function fetchRecent(){ const out=[]; for(let i=0;i<DAYS;i++){ const d=new Date(Date.now()-i*864e5); const hit=await tryFetch(LOG_BASE+yyyymmdd(d)+".jsonl"); if(hit) out.push(hit);} return out; }
  const parseJsonl=t=>t.split(/\r?\n/).filter(Boolean).flatMap(l=>{try{return[JSON.parse(l)]}catch{return[]}});

  function heuristics(entries){
    const props=[], add=(title,detail,priority,tags=[])=>props.push({id:crypto.randomUUID(),title,detail,priority,tags,createdAt:nowIso()});
    for(const e of entries){
      const dj=e.dataJson||e.data||{}, area=dj.area||e.area||"", type=dj.type||e.type||"", summary=dj.summary||e.summary||e.event||"";
      if(area) add(`Document ${area} intent & roadmap`,"Capture current scope, constraints, and near-term steps.",2,["docs",area]);
      if(type==="status") add("Add smoke tests for critical UI actions","Smoke the most-visited interactions.",2,["tests"]);
      if(/data|entities/i.test(summary)) add("Data QA & provenance checklist","Validate fallbacks, provenance, and diffs.",1,["data","qa"]);
    }
    const seen=new Set(); return props.filter(p=>seen.has(p.title)?false:(seen.add(p.title),true)).sort((a,b)=>a.priority-b.priority||a.title.localeCompare(b.title));
  }

  function render(proposals, approvals){
    listEl.innerHTML="";
    for(const p of proposals){
      const st=(approvals[p.id]||{}).state||"pending", badge=st==="approved"?"ok":st==="rejected"?"bad":"warn";
      const card=document.createElement("div"); card.className="card";
      card.innerHTML=`
        <div class="row" style="justify-content:space-between">
          <div><b>${p.title}</b> <span class="chip">${fmtPri(p.priority)}</span></div>
          <div class="${badge}">${st}</div>
        </div>
        <div class="muted" style="margin-top:6px">${p.detail}</div>
        <div class="chips">${p.tags.map(t=>`<span class="chip">${t}</span>`).join(" ")}</div>
        <div class="row" style="margin-top:8px">
          <button data-act="approve" data-id="${p.id}">Approve</button>
          <button data-act="reject"  data-id="${p.id}">Reject</button>
          <button data-act="pending" data-id="${p.id}">Mark pending</button>
        </div>`;
      listEl.appendChild(card);
    }
  }

  function wire(proposals){
    listEl.addEventListener("click",(e)=>{
      const btn=e.target.closest("button[data-act]"); if(!btn) return;
      const approvals=load(); approvals[btn.dataset.id]={state:btn.dataset.act,updatedAt:nowIso()}; save(approvals); render(proposals, approvals);
    });
    document.querySelector("#evo-export").addEventListener("click",()=>{
      const payload={exportedAt:nowIso(),approvals:load(),proposals:window.__evoProposals||[],note:"portable coevolution seed"};
      const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));
      a.download="coevolution-export.json"; a.click(); URL.revokeObjectURL(a.href);
    });
    document.querySelector("#evo-clear").addEventListener("click",()=>{ if(confirm("Clear local approvals?")){ localStorage.removeItem(KEY); render(window.__evoProposals||[],{}); }});
  }

  async function generate(){ statusEl.textContent="Scanning logs…"; const recents=await fetchRecent(); const entries=recents.flatMap(r=>parseJsonl(r.text));
    statusEl.textContent=`Generating (${entries.length} receipts)…`; const out=heuristics(entries); window.__evoProposals=out; statusEl.textContent=`Ready — ${out.length} proposal(s)`; render(out,load()); }
  function refresh(){ render(window.__evoProposals||[],load()); statusEl.textContent="Refreshed approvals"; }
  document.querySelector("#evo-generate").addEventListener("click",generate);
  document.querySelector("#evo-refresh").addEventListener("click",refresh);
  wire([]);
})();
