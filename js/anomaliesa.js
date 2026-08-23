/* =========================================================
   ABR CASE ARCHIVE — RENDER + INTERACTION LAYER
   Reads from data.js, builds DOM, wires navigation & search.
   ========================================================= */

(function () {
  "use strict";

  const $  = (s, ctx) => (ctx || document).querySelector(s);
  const $$ = (s, ctx) => Array.from((ctx || document).querySelectorAll(s));

  /* ---------- helpers ---------- */

  function statusIconHTML(status) {
    return `<span class="status-icon status-icon-${status}"></span>`;
  }

  function fmtDate(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  /* ---------- render: case file article ---------- */

  function renderCaseFile(c) {
    const label = STATUS_LABEL[c.status];

    let html = `
      <div class="view-head case-view-head">
        <p class="stamp-eyebrow">CASE FILE — ${c.era}</p>
        <h1>${c.title}</h1>
        <span class="stamp stamp-${c.status} stamp-rotate">${label}</span>
      </div>

      <div class="metadata-card">
        <div class="metadata-card-label">Case Metadata</div>
        <div class="metadata-card-grid">
          <div><span>Classification</span><strong class="ink-${c.status}">${label}</strong></div>
          <div><span>First recorded</span><strong>${fmtDate(c.date)}</strong></div>
          <div><span>Origin</span><strong>${c.origin}</strong></div>
          <div><span>Associated</span><strong>${c.associated}</strong></div>
          <div><span>Era</span><strong>${c.era}</strong></div>
          <div><span>Condition</span><strong>Under investigation</strong></div>
        </div>
      </div>

      <div class="status-banner status-banner-${c.status}">
        <strong>Investigation classification: ${label}</strong>
        <span>${
          c.status === "dangerous" ? "Investigators classified the phenomenon as dangerous while the case was under examination."
          : c.status === "safe" ? "Investigators considered the recorded entities non-hostile during the investigation."
          : "Investigators classified the phenomenon as moderate risk pending further review."
        }</span>
      </div>

      <h2>Description</h2>
      ${c.description.map(p => `<p>${p}</p>`).join("")}
    `;

    if (c.extra) {
      html += c.extra.map(p => `<p>${p}</p>`).join("");
    }

    if (c.quotes) {
      html += `<h2>User Explanations</h2>`;
      html += c.quotes.map(q => `
        <div class="case-record">
          <div class="case-record-head">User explanation · field report</div>
          <p>&ldquo;${q.text}&rdquo;</p>
          <small>${q.cred}</small>
        </div>
      `).join("");
    }

    if (c.standaloneQuote) {
      html += `
        <div class="quote-block" tabindex="0">
          <div class="quote-block-face quote-block-front">
            <span>&ldquo;${c.standaloneQuote.text}&rdquo;</span>
          </div>
          <div class="quote-block-face quote-block-back">
            <small>${c.standaloneQuote.cred}</small>
          </div>
        </div>
      `;
    }

    if (c.behavior) {
      html += `<h2>Behavior</h2><p>${c.behavior}</p>`;
    }

    if (c.notes) {
      html += `<h2>Investigation Notes</h2><ol class="steps-list">${c.notes.map(n => `<li>${n}</li>`).join("")}</ol>`;
    }

    if (c.indicator) {
      html += `<h2>Flashlight Indicator</h2><div class="indicator-card">`;
      html += c.indicator.map(row => `
        <div class="indicator-line">
          <span class="dot dot-${row.color}"></span>
          <strong>${row.label}</strong>
          <span>${row.meaning}</span>
        </div>
      `).join("");
      html += `</div>`;
    }

    html += `
      <div class="callout callout-amber">
        <strong>Case Status</strong>
        <p>${c.caseNote}</p>
      </div>
    `;

    return html;
  }

  function paintCaseFiles() {
    CASES.forEach(c => {
      const el = document.getElementById(c.id);
      if (el) el.innerHTML = renderCaseFile(c);
    });
  }

  /* ---------- render: case index (overview) ---------- */

  function paintCaseIndex() {
    const order = { dangerous: 0, moderate: 1, safe: 2 };
    const sorted = [...CASES].sort((a, b) => order[a.status] - order[b.status]);
    const wrap = $("#case-index");
    wrap.innerHTML = sorted.map(c => `
      <button class="index-row link-btn" data-target="${c.id}">
        <span class="index-title">${statusIconHTML(c.status)} ${c.title}</span>
        <span class="index-meta">${c.era}</span>
        <span class="index-meta">${fmtDate(c.date)}</span>
        <span class="index-status ink-${c.status}">${STATUS_LABEL[c.status]}</span>
      </button>
    `).join("");
  }

  function paintCaseLog() {
    const wrap = $("#case-log");
    wrap.innerHTML = CASES.map(c => `
      <button class="log-row link-btn" data-target="${c.id}">
        <span class="log-year">${c.date}</span>
        <span class="log-type ink-${c.status}">${STATUS_LABEL[c.status]}</span>
        <span class="log-body"><strong>${c.title}</strong><span>${c.description[0].replace(/<[^>]+>/g, "")}</span></span>
      </button>
    `).join("");
  }

  /* ---------- render: reports ---------- */

  function paintReports() {
    const wrap = $("#reports-list");
    wrap.innerHTML = REPORTS.map(r => `
      <div class="report-card ${r.link ? "report-card-linked link-btn" : ""}" ${r.link ? `data-target="${r.link}" tabindex="0" role="button"` : ""}>
        <div class="report-head"><span>REPORT ${r.num}</span><span>${r.year}</span></div>
        <h3>${r.title}</h3>
        <p><span class="report-label">Investigator note:</span> ${r.note}</p>
        <div class="report-foot">${r.foot}</div>
      </div>
    `).join("");
  }

  /* ---------- render: timeline ---------- */

  function paintTimeline() {
    const wrap = $("#timeline");
    wrap.innerHTML = `<div class="timeline-rail"></div>` + TIMELINE.map(t => `
      <div class="timeline-entry">
        <div class="timeline-node"></div>
        <div class="timeline-card ${t.link ? "link-btn" : ""}" ${t.link ? `data-target="${t.link}" tabindex="0" role="button"` : ""}>
          <span class="timeline-year">${t.year}</span>
          <h3>${t.title}</h3>
          <p>${t.body}</p>
        </div>
      </div>
    `).join("");
  }

  /* ---------- ledger / stats ---------- */

  function paintCounts() {
    $("#ledger-cases").textContent = CASES.length;
    $("#ledger-reports").textContent = REPORTS.length;
    $("#ledger-timeline").textContent = TIMELINE.length;
    $("#stat-cases").textContent = CASES.length;
    $("#stat-dangerous").textContent = CASES.filter(c => c.status === "dangerous").length;
  }

  /* ---------- featured carousel ---------- */

  function initCarousel() {
    const slides = $$(".feat-slide");
    const dotsWrap = $("#feat-dots");
    let idx = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "feat-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      dot.addEventListener("click", () => go(i));
      dotsWrap.appendChild(dot);
    });
    const dots = $$(".feat-dot", dotsWrap);

    function go(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle("active", i === idx));
      dots.forEach((d, i) => d.classList.toggle("active", i === idx));
    }

    $("#feat-prev").addEventListener("click", () => go(idx - 1));
    $("#feat-next").addEventListener("click", () => go(idx + 1));

    let timer = setInterval(() => go(idx + 1), 7000);
    const panel = $("#featured-panel");
    panel.addEventListener("mouseenter", () => clearInterval(timer));
    panel.addEventListener("mouseleave", () => { timer = setInterval(() => go(idx + 1), 7000); });
  }

  /* ---------- navigation ---------- */

  function showView(id, opts) {
    opts = opts || {};
    $$(".view").forEach(v => v.classList.remove("active"));
    const target = document.getElementById(id);
    if (!target) return;
    target.classList.add("active");

    $$(".folder-link, .topbar-link").forEach(l => l.classList.toggle("active", l.dataset.target === id));

    if (!opts.silent) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    history.replaceState(null, "", "#" + id);
    closeSearch();
    closeQuickFacts();
  }

  function wireNav() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-target]");
      if (!btn) return;
      e.preventDefault();
      showView(btn.dataset.target);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && document.activeElement && document.activeElement.dataset && document.activeElement.dataset.target && document.activeElement.getAttribute("role") === "button") {
        showView(document.activeElement.dataset.target);
      }
    });
  }

  /* ---------- quick answers drawer ---------- */

  function wireQuickFacts() {
    const toggle = $("#quickfacts-toggle");
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("quickfacts-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Quick Answers ▴" : "Quick Answers ▾";
    });
  }
  function closeQuickFacts() {
    document.body.classList.remove("quickfacts-open");
    const toggle = $("#quickfacts-toggle");
    if (toggle) { toggle.setAttribute("aria-expanded", "false"); toggle.textContent = "Quick Answers ▾"; }
  }

  /* ---------- search ---------- */

  function buildSearchIndex() {
    const idx = [];
    CASES.forEach(c => idx.push({
      id: c.id, title: c.title, type: "Case file", status: c.status,
      text: (c.description.join(" ") + " " + (c.extra || []).join(" ")).replace(/<[^>]+>/g, "")
    }));
    REPORTS.forEach(r => idx.push({
      id: r.link || "view_reports", title: r.title, type: "Field report", status: null, text: r.note
    }));
    TIMELINE.forEach(t => idx.push({
      id: t.link || "view_history", title: t.title, type: "Timeline · " + t.year, status: null, text: t.body.replace(/<[^>]+>/g, "")
    }));
    return idx;
  }

  function wireSearch() {
    const index = buildSearchIndex();
    const input = $("#search-input");
    const results = $("#search-results");

    function run(q) {
      q = q.trim().toLowerCase();
      if (!q) { closeSearch(); return; }
      const hits = index.filter(e =>
        e.title.toLowerCase().includes(q) || e.text.toLowerCase().includes(q)
      ).slice(0, 8);

      if (!hits.length) {
        results.innerHTML = `<div class="search-empty">No matching records for &ldquo;${escapeHTML(q)}&rdquo;</div>`;
      } else {
        results.innerHTML = hits.map(h => `
          <button class="search-hit link-btn" data-target="${h.id}">
            <span class="search-hit-title">${h.title}</span>
            <span class="search-hit-type">${h.type}</span>
          </button>
        `).join("");
      }
      results.classList.add("visible");
    }

    input.addEventListener("input", () => run(input.value));
    input.addEventListener("focus", () => { if (input.value.trim()) run(input.value); });

    $("#search-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const first = $(".search-hit", results);
      if (first) showView(first.dataset.target);
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest("#search-band")) closeSearch();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
        e.preventDefault();
        input.focus();
      }
      if (e.key === "Escape") closeSearch();
    });
  }

  function closeSearch() {
    const results = $("#search-results");
    if (results) results.classList.remove("visible");
  }

  function escapeHTML(s) {
    return s.replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  }

  /* ---------- clock ---------- */

  function tickClock() {
    const now = new Date();
    $("#clock-date").textContent = now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
    $("#clock-time").textContent = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }

  /* ---------- init ---------- */

  function init() {
    paintCaseFiles();
    paintCaseIndex();
    paintCaseLog();
    paintReports();
    paintTimeline();
    paintCounts();
    initCarousel();
    wireNav();
    wireQuickFacts();
    wireSearch();
    tickClock();
    setInterval(tickClock, 30000);

    const hash = location.hash.replace("#", "");
    if (hash && document.getElementById(hash)) {
      showView(hash, { silent: true });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();