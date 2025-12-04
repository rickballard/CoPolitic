(function () {
  const cards = Array.from(document.querySelectorAll(".plane-card"));
  if (!cards.length) return;

  const titleEl = document.getElementById("plane-state-title");
  const summaryEl = document.getElementById("plane-state-summary");
  const pointsEl = document.getElementById("plane-state-points");
  const resetBtn = document.getElementById("plane-reset");

  const STATES = {
    "closed-slow": {
      title: "Closed & frozen: captured stability",
      summary:
        "A small circle controls the cockpit. Rules exist but mostly shield current winners. Most people feel politics is something done to them, not with them.",
      points: [
        "Decisions are predictable, but rarely revisited even when conditions clearly change.",
        "Information tends to move up and then vanish; feedback loops are weak or symbolic.",
        "AI is used to watch people, not to help them organise or test better guardrails."
      ]
    },
    "open-slow": {
      title: "Open & frozen: endless consultation",
      summary:
        "Voices are welcome and processes are public, but real change moves at a glacial pace. Every idea meets five committees and ten veto points.",
      points: [
        "People are asked for input often, but struggle to see how it shapes decisions.",
        "Most energy is spent navigating process, not improving outcomes or guardrails.",
        "AI is bolted on as a helper for reports, not as a partner in redesigning the system."
      ]
    },
    "closed-fast": {
      title: "Closed & chaotic: roulette with code",
      summary:
        "Power jumps between elites, platforms and opaque models. Things move fast, but in ways that feel arbitrary, extractive, or both.",
      points: [
        "Rules and norms are regularly bypassed “for speed” or “for the news cycle.”",
        "Trust erodes because nobody can explain why decisions flip from day to day.",
        "AI is deployed in the dark – for micro‑targeting, optimisation, or spin – not for shared sense‑making."
      ]
    },
    "open-fast": {
      title: "Open & adaptive: stewards in the loop",
      summary:
        "More people can see and shape the system. Change is real but not reckless. Humans and AIs share a cockpit instead of fighting over it.",
      points: [
        "Feedback is structured and visible; people can see where their input lands.",
        "Guardrails are explicit and revisited; drift is measured, not hand‑waved.",
        "AI is used to surface options, stress‑test proposals, and document trade‑offs – not to quietly override humans."
      ]
    }
  };

  function selectCard(id) {
    cards.forEach((card) => {
      const isActive = card.dataset.planeId === id;
      card.classList.toggle("is-active", isActive);
    });

    const state = STATES[id];
    if (!state) return;

    if (titleEl) titleEl.textContent = state.title;
    if (summaryEl) summaryEl.textContent = state.summary;

    if (pointsEl) {
      pointsEl.innerHTML = "";
      state.points.forEach((point) => {
        const li = document.createElement("li");
        li.textContent = point;
        pointsEl.appendChild(li);
      });
    }
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.planeId;
      selectCard(id);
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      cards.forEach((card) => card.classList.remove("is-active"));
      if (titleEl) {
        titleEl.textContent = "How to use this";
      }
      if (summaryEl) {
        summaryEl.textContent =
          "This is not a personality quiz. It is a shared lens you can put in the middle of a room – or a group chat – so people can point and talk.";
      }
      if (pointsEl) {
        pointsEl.innerHTML = "";
        [
          "Start by asking: “Where does our system live today?”",
          "Then ask: “Where is it drifting?” and “Where would we like it to be?”",
          "Capture the answers, not to score people, but to surface patterns."
        ].forEach((text) => {
          const li = document.createElement("li");
          li.textContent = text;
          pointsEl.appendChild(li);
        });
      }
    });
  }
})();