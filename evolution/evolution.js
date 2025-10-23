/* Evolution generator (repo-local prototype) */
(() => {
  const DAYS = 14;                                 // how far back to look
  const LOG_BASE = "/status/log/";                 // CoSync jsonl directory
  const KEY = "EVOLUTION_APPROVALS";               // localStorage key

  const qs = sel => document.querySelector(sel);
  const statusEl = qs("#evo-status");
  const listEl = qs("#evo-list");

  function nowIso(){ return new Date().toISOString(); }
  function fmtPri(p){ return p === 1 ? "P1" : p === 2 ? "P2" : "P3"; }

  function loadApprovals(){
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
  }
  function saveApprovals(obj){
    try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch {}
  }

  async function tryFetch(url){
    try {
      const r = await fetch(url, {cache:"no-store"});
      if (!r.ok) return null;
      const t = await r.text();
      return { url, text: t };
    } catch { return null; }
  }

  function yyyymmdd(d){
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,"0");
    const dd = String(d.getDate()).padStart(2,"0");
    return `${y}${m}${dd}`;
  }

  async function fetchRecentLogs(){
    const out = [];
    for (let i=0;i<DAYS;i++){
      const d = new Date(Date.now() - i*86400000);
      const name = yyyymmdd(d)+".jsonl";
      const hit = await tryFetch(LOG_BASE+name);
      if (hit) out.push(hit);
    }
    return out;
  }

  function parseJsonl(txt){
    const lines = txt.split(/\r?\n/).filter(Boolean);
    const rows = [];
    for (const line of lines){
      try { rows.push(JSON.parse(line)); } catch {}
    }
    return rows;
  }

  function heuristics(entries){
    // entries are CoSync receipts; typical shape: { event, dataJson } with our adapter often embedding area/type/summary/data
    const props = [];
    const touchCounts = {};
    const add = (title, detail, priority, tags=[]) => {
      props.push({ id: crypto.randomUUID(), title, detail, priority, tags, createdAt: nowIso() });
    };

    for (const e of entries){
      const dj = e.dataJson || e.data || {};
      const area  = dj.area || (e.area) || "";
      const type  = dj.type || (e.type) || "";
      const files = (dj.data && dj.data.files) || dj.files || [];
      const summary = dj.summary || e.summary || e.event || "";

      // count touches by area
      const key = area || "general";
      touchCounts[key] = (touchCounts[key]||0)+1;

      // plane-app focused follow-ups
      if (area === "plane-app"){
        // UX change → A11y, legend clarity, doc
        add("Improve chart accessibility (keyboard + ARIA)",
            "Ensure buttons/controls are keyboard reachable, add ARIA roles, and canvas fallback text.",
            1, ["a11y","plane-app"]);

        add("Tune marker sizing/contrast across DPRs",
            "Test PLANE_UI_SCALE presets (1.2/1.6/2.0/2.6) and document guidance; add min/max clamps per viewport.",
            2, ["visuals","plane-app"]);

        add("Clarify axes & domain weights in legend",
            "Add short, scannable legend copy; include tooltips for ‘Commons→Commerce’ and ‘Club→Crown’.",
            2, ["docs","plane-app"]);

        add("Perf budget: first-interaction under 1s",
            "Audit script sizes, enable preloads where useful, and verify cache-busting does not defeat caching.",
            3, ["perf","plane-app"]);
      }

      // dataset changes → QA
      if (summary && /data|entities/i.test(summary)){
        add("Data QA & provenance checklist",
            "Validate v2->v1 fallback paths, include per-entity notes and citations, and diff plots between versions.",
            1, ["data","qa"]);
      }

      // general changes → tests/docs
      if (type === "status"){
        add("Add smoke tests for critical paths",
            "Minimal DOM tests for binder actions: Equalize, Toggle layers, Reset, hover/click explain.",
            2, ["tests"]);
      }
    }

    // repo-level meta
    if ((touchCounts["plane-app"]||0) >= 3){
      add("Consolidate binder → data-action standard",
          "Standardize delegation via data-action across UI buttons and document pattern for other pages.",
          2, ["consistency","ux"]);
    }

    // de-duplicate by title
    const seen = new Set();
    return props.filter(p => (seen.has(p.title) ? false : (seen.add(p.title), true)))
                .sort((a,b)=> (a.priority - b.priority) || a.title.localeCompare(b.title));
  }

  function render(proposals, approvals){
    listEl.innerHTML = "";
    for (const p of proposals){
      const card = document.createElement("div"); card.className = "card";
      const ap = approvals[p.id] || {};
      const state = ap.state || "pending"; // approved | rejected | pending
      const badge = state==="approved" ? "ok" : state==="rejected" ? "bad" : "warn";
      card.innerHTML = `
        <div class="row" style="justify-content:space-between">
          <div><b>${p.title}</b> <span class="chip">${fmtPri(p.priority)}</span></div>
          <div class="${badge}">${state}</div>
        </div>
        <div class="muted" style="margin-top:6px">${p.detail}</div>
        <div class="chips">${p.tags.map(t=>`<span class="chip">${t}</span>`).join(" ")}</div>
        <div class="row" style="margin-top:8px">
          <button data-act="approve" data-id="${p.id}">Approve</button>
          <button data-act="reject"  data-id="${p.id}">Reject</button>
          <button data-act="pending" data-id="${p.id}">Mark pending</button>
        </div>
      `;
      listEl.appendChild(card);
    }
  }

  function wireButtons(proposals){
    listEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-act]");
      if (!btn) return;
      const id = btn.dataset.id, act = btn.dataset.act;
      const approvals = loadApprovals();
      approvals[id] = { state: act, updatedAt: nowIso() };
      saveApprovals(approvals);
      render(proposals, approvals);
    });

    qs("#evo-export").addEventListener("click", () => {
      const payload = { exportedAt: nowIso(), approvals: loadApprovals(), proposals: window.__evoProposals||[] };
      const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "evolution-proposals.json";
      a.click();
      URL.revokeObjectURL(a.href);
    });

    qs("#evo-clear").addEventListener("click", () => {
      if (confirm("Clear all approvals?")) { localStorage.removeItem(KEY); render(window.__evoProposals||[], {}); }
    });
  }

  async function generate(){
    statusEl.textContent = "Scanning CoSync logs…";
    const recents = await fetchRecentLogs();
    const entries = recents.flatMap(r => parseJsonl(r.text));

    statusEl.textContent = `Generating (${entries.length} receipts)…`;
    const out = heuristics(entries);

    window.__evoProposals = out;
    statusEl.textContent = `Ready — ${out.length} proposal(s)`;
    render(out, loadApprovals());
  }

  function refresh(){ render(window.__evoProposals||[], loadApprovals()); statusEl.textContent = "Refreshed approvals"; }

  qs("#evo-generate").addEventListener("click", generate);
  qs("#evo-refresh").addEventListener("click", refresh);
  wireButtons([]);

  // Optional auto-run on first load:
  // generate();
})();