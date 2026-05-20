/* HTML-Anything · Happycapy frontend logic */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const state = {
  styles: [],
  activeStyle: null,
  filter: "all",
  html: "",
  outline: "",
  view: "preview",
  compareSelected: new Set(),
};

/* ----- Token management ----- */
function getToken() { return localStorage.getItem("ha_token") || ""; }
function setToken(t) {
  if (t) localStorage.setItem("ha_token", t);
  else localStorage.removeItem("ha_token");
  updateTokenLabel();
}
function updateTokenLabel() {
  const lbl = $("#token-label");
  if (!lbl) return;
  lbl.textContent = getToken() ? "🔑 Token ✓" : "🔑 Token";
}
function authedFetch(url, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  const t = getToken();
  if (t) headers["x-ha-token"] = t;
  return fetch(url, { ...opts, headers });
}

/* ========== Boot ========== */
function renderSkeletons(n = 15) {
  const grid = $("#style-grid");
  grid.innerHTML = "";
  for (let i = 0; i < n; i++) {
    const card = document.createElement("div");
    card.className = "style-card skeleton";
    card.innerHTML = `
      <div class="style-thumb"><div class="skeleton-block"></div></div>
      <div class="style-meta">
        <div class="skeleton-line skeleton-line-name"></div>
        <div class="skeleton-line skeleton-line-cat"></div>
      </div>`;
    grid.appendChild(card);
  }
}

async function loadStyles() {
  renderSkeletons(); // show skeletons immediately so the panel never looks empty
  try {
    const res = await fetch("/api/styles"); // public, no token needed
    state.styles = await res.json();
    $("#style-count").textContent = state.styles.length;
    renderStyles();
  } catch (e) {
    $("#style-grid").innerHTML =
      `<div class="placeholder" style="padding:20px;font-size:13px">Failed to load styles. Refresh the page.</div>`;
  }
}

function renderStyles() {
  const grid = $("#style-grid");
  grid.innerHTML = "";
  const filtered = state.styles.filter(
    (s) => state.filter === "all" || s.category === state.filter
  );
  for (const s of filtered) {
    const card = document.createElement("div");
    card.className = "style-card" + (state.activeStyle?.id === s.id ? " selected" : "");
    card.dataset.id = s.id;
    card.innerHTML = `
      <div class="style-thumb"><div class="thumb thumb-${s.id}"></div></div>
      <div class="style-meta">
        <div class="style-name">${escapeHtml(s.name)}</div>
        <div class="style-cat">${s.category}</div>
      </div>
    `;
    card.addEventListener("click", () => selectStyle(s));
    grid.appendChild(card);
  }
}

function selectStyle(s) {
  state.activeStyle = s;
  $("#active-style-name").textContent = "— " + s.name;
  $("#active-style-name").classList.remove("muted");
  renderStyles();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

/* ========== Filter chips ========== */
$$(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    $$(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    state.filter = chip.dataset.cat;
    renderStyles();
  });
});

/* ========== Preview / Source tabs ========== */
$$(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    $$(".tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    state.view = tab.dataset.tab;
    syncPreview();
  });
});

function syncPreview() {
  const src = $("#preview-source");
  const outline = $("#preview-outline");
  const frame = $("#preview-frame");
  src.hidden = state.view !== "source";
  outline.hidden = state.view !== "outline";
  frame.style.display = state.view === "preview" ? "" : "none";
  if (state.view === "source") src.textContent = state.html || "";
  if (state.view === "outline") {
    outline.textContent = state.outline ||
      "(no outline — Raw mode was on, or generation failed before optimizer ran)";
  }
}

function showHtml(html, outline) {
  state.html = html;
  state.outline = outline || "";
  const frame = $("#preview-frame");
  frame.innerHTML = "";
  frame.style.display = "";
  const iframe = document.createElement("iframe");
  iframe.setAttribute("sandbox", "allow-same-origin");
  iframe.srcdoc = html;
  frame.appendChild(iframe);
  $("#preview-source").textContent = html;
  $("#preview-outline").textContent = state.outline ||
    "(no outline — Raw mode was on)";
  ["btn-share", "btn-copy", "btn-download"].forEach((id) => ($("#" + id).disabled = false));
  syncPreview();
}

function showLoading(stage = "Generating…", sub = "") {
  const frame = $("#preview-frame");
  frame.innerHTML = `
    <div class="loading-overlay">
      <div class="spinner large dark"></div>
      <div class="stage">${escapeHtml(stage)}</div>
      ${sub ? `<div class="substage">${escapeHtml(sub)}</div>` : ""}
    </div>
  `;
}

function toast(msg, kind = "") {
  const el = $("#toast");
  el.textContent = msg;
  el.className = "toast show" + (kind ? " " + kind : "");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2400);
}

/* ========== Sample picker ========== */
$("#btn-sample").addEventListener("click", (e) => {
  e.stopPropagation();
  $("#sample-menu-list").classList.toggle("open");
});
document.addEventListener("click", () => $("#sample-menu-list").classList.remove("open"));
$$("#sample-menu-list button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const key = btn.dataset.sample;
    $("#input").value = (window.SAMPLES && window.SAMPLES[key]) || "";
    $("#sample-menu-list").classList.remove("open");
    toast(`Loaded "${btn.textContent}"`);
  });
});
$("#btn-clear").addEventListener("click", () => ($("#input").value = ""));

/* ========== Generate ========== */
$("#btn-generate").addEventListener("click", () => generate());

async function generate() {
  const content = $("#input").value.trim();
  if (!content) return toast("Describe what you want to make first");
  if (!state.activeStyle) return toast("Pick a style on the left");
  const rawMode = $("#raw-mode")?.checked || false;
  const btn = $("#btn-generate");
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Generating';

  // Two-stage loading display (the request runs in one shot, but we cycle the
  // overlay text so the user perceives progress through the pipeline)
  if (rawMode) {
    showLoading("Calling " + state.activeStyle.name + "…", "Rendering with style prompt (5–15s)");
  } else {
    showLoading("Structuring your input…", "Optimizer is drafting a clean Markdown brief");
  }
  let stageTimer = null;
  if (!rawMode) {
    stageTimer = setTimeout(() => {
      showLoading("Applying style: " + state.activeStyle.name, "Rendering structured brief into HTML (5–15s)");
    }, 3500);
  }

  try {
    const res = await authedFetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ styleId: state.activeStyle.id, content, rawMode }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "generation failed");
    showHtml(data.html, data.outline);
    toast(
      rawMode
        ? "Generated · " + state.activeStyle.name + " (raw)"
        : "Generated · " + state.activeStyle.name + " · outline ready"
    );
  } catch (e) {
    state.html = "";
    state.outline = "";
    $("#preview-frame").innerHTML = `<div class="placeholder"><h2>Generation failed</h2><p>${escapeHtml(e.message)}</p></div>`;
    toast("Error: " + e.message, "error");
  } finally {
    if (stageTimer) clearTimeout(stageTimer);
    btn.disabled = false;
    btn.innerHTML = original;
  }
}

/* ========== Copy / Download / Share ========== */
$("#btn-copy").addEventListener("click", async () => {
  if (!state.html) return;
  await navigator.clipboard.writeText(state.html);
  toast("HTML copied to clipboard");
});

$("#btn-download").addEventListener("click", () => {
  if (!state.html) return;
  const blob = new Blob([state.html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = (state.activeStyle?.id || "page") + ".html";
  a.click();
  URL.revokeObjectURL(url);
  toast("Downloaded");
});

$("#btn-share").addEventListener("click", async () => {
  if (!state.html) return;
  const res = await authedFetch("/api/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html: state.html, title: state.activeStyle?.name }),
  });
  const data = await res.json();
  const url = location.origin + data.url;
  await navigator.clipboard.writeText(url);
  toast("Share URL copied: " + url);
});

/* ========== View prompt ========== */
$("#btn-prompt").addEventListener("click", async () => {
  if (!state.activeStyle) return toast("Pick a style first");
  const res = await authedFetch("/api/styles/" + state.activeStyle.id);
  const full = await res.json();
  $("#prompt-dialog-title").textContent = "Prompt · " + full.name;
  $("#prompt-dialog-body").textContent = full.prompt;
  $("#prompt-dialog").showModal();
});

$("#prompt-copy").addEventListener("click", async () => {
  await navigator.clipboard.writeText($("#prompt-dialog-body").textContent);
  toast("Prompt copied");
});

/* ========== Compare mode ========== */
$("#btn-compare").addEventListener("click", () => openCompare());

function openCompare() {
  const content = $("#input").value.trim();
  if (!content) return toast("Paste some content first");

  state.compareSelected = new Set();
  const grid = $("#compare-pick");
  grid.innerHTML = "";
  for (const s of state.styles) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "style-card";
    item.style.cursor = "pointer";
    item.style.textAlign = "left";
    item.style.background = "var(--surface-2)";
    item.innerHTML = `
      <div class="style-thumb"><div class="thumb thumb-${s.id}"></div></div>
      <div class="style-meta">
        <div class="style-name">${escapeHtml(s.name)}</div>
        <div class="style-cat">${s.category}</div>
      </div>
    `;
    item.addEventListener("click", () => toggleCompare(s, item));
    grid.appendChild(item);
  }
  updateCompareUI();
  $("#compare-dialog").showModal();
}

function toggleCompare(s, el) {
  if (state.compareSelected.has(s.id)) {
    state.compareSelected.delete(s.id);
    el.classList.remove("selected");
  } else {
    if (state.compareSelected.size >= 3) return toast("Max 3 styles");
    state.compareSelected.add(s.id);
    el.classList.add("selected");
  }
  updateCompareUI();
}

function updateCompareUI() {
  const n = state.compareSelected.size;
  $("#compare-count").textContent = n + " selected";
  $("#compare-go").disabled = n < 2;
}

$("#compare-cancel").addEventListener("click", () => $("#compare-dialog").close());
$("#compare-go").addEventListener("click", async () => {
  $("#compare-dialog").close();
  await runCompare();
});

async function runCompare() {
  const content = $("#input").value.trim();
  const ids = Array.from(state.compareSelected);
  const styles = ids.map((id) => state.styles.find((s) => s.id === id));
  const cols = styles.length;
  const frame = $("#preview-frame");
  frame.innerHTML = `<div class="compare-grid cols-${cols}"></div>`;
  const grid = frame.querySelector(".compare-grid");

  const cells = styles.map((s) => {
    const cell = document.createElement("div");
    cell.className = "compare-cell";
    cell.innerHTML = `
      <div class="compare-cell-header">
        <span>${escapeHtml(s.name)}</span>
        <span class="tag">${s.category}</span>
      </div>
      <div class="compare-status">
        <div class="spinner large dark"></div>
        <div>Rendering…</div>
      </div>
    `;
    grid.appendChild(cell);
    return cell;
  });

  await Promise.all(
    styles.map(async (s, idx) => {
      try {
        const res = await authedFetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ styleId: s.id, content, rawMode: $("#raw-mode")?.checked || false }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "failed");
        const status = cells[idx].querySelector(".compare-status");
        if (status) status.remove();
        const iframe = document.createElement("iframe");
        iframe.setAttribute("sandbox", "allow-same-origin");
        iframe.srcdoc = data.html;
        cells[idx].appendChild(iframe);
      } catch (e) {
        const status = cells[idx].querySelector(".compare-status");
        if (status) status.innerHTML = `<div style="color:#c33">Error: ${escapeHtml(e.message)}</div>`;
      }
    })
  );
  toast("Compare ready · " + cols + " styles");
}

/* ========== Token dialog ========== */
$("#btn-token").addEventListener("click", () => {
  $("#token-field").value = getToken();
  $("#token-dialog").showModal();
});
$("#token-save").addEventListener("click", () => {
  setToken($("#token-field").value.trim());
  $("#token-dialog").close();
  toast(getToken() ? "Token saved" : "Token cleared");
});
$("#token-clear").addEventListener("click", () => {
  $("#token-field").value = "";
  setToken("");
  $("#token-dialog").close();
  toast("Token cleared");
});

/* ========== Init ========== */
updateTokenLabel();
loadStyles();
