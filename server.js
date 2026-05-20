// HTML-Anything backend: serves UI, proxies AI Gateway, logs events
const express = require("express");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const STYLES = require("./styles.js");
const { authMiddleware, rateLimit, logEvent, readEvents, summarize, clientIp } = require("./lib.js");
const { optimize } = require("./optimizer.js");

// Load .env file (no dotenv dep) — survives process restarts that lose env vars
try {
  const envPath = path.join(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/i);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
} catch (e) { console.error("env load:", e); }

const app = express();
const PORT = process.env.PORT || 8080;
const GATEWAY_URL = process.env.AI_GATEWAY_BASE_URL;
const GATEWAY_KEY = process.env.AI_GATEWAY_API_KEY;
const MODEL = process.env.HA_MODEL || "anthropic/claude-sonnet-4.6";
const OPTIMIZER_MODEL = process.env.HA_OPTIMIZER_MODEL || "anthropic/claude-haiku-4.5";
const MAX_CONTENT_CHARS = parseInt(process.env.MAX_CONTENT_CHARS || "50000", 10);

const SHARES = new Map();
const SHARE_DIR = path.join(__dirname, "shares");
if (!fs.existsSync(SHARE_DIR)) fs.mkdirSync(SHARE_DIR, { recursive: true });

app.set("trust proxy", true);
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

const auth = authMiddleware();
const limiter = rateLimit({ max: 12, windowMs: 60_000 });

// Public: list styles (no auth required so the picker can render)
app.get("/api/styles", (req, res) => {
  res.json(
    STYLES.map((s) => ({
      id: s.id, name: s.name, category: s.category,
      accent: s.accent, bg: s.bg, description: s.description,
    }))
  );
});

// Auth required: full prompt of one style
app.get("/api/styles/:id", auth, (req, res) => {
  const s = STYLES.find((x) => x.id === req.params.id);
  if (!s) return res.status(404).json({ error: "style not found" });
  res.json(s);
});

// Auth + rate-limit: generate
// Body: { styleId, content, rawMode?: boolean }
//   rawMode=true  → skip optimizer, treat content as already-formatted markdown
//   rawMode=false → run optimizer first to turn loose intent into structured markdown
app.post("/api/generate", auth, limiter, async (req, res) => {
  const t0 = Date.now();
  const { styleId, content, rawMode } = req.body || {};
  const ip = clientIp(req);
  const ua = req.get("user-agent") || "";

  if (!styleId || !content) {
    return res.status(400).json({ error: "styleId and content required" });
  }
  const style = STYLES.find((s) => s.id === styleId);
  if (!style) return res.status(404).json({ error: "unknown styleId" });

  if (String(content).length > MAX_CONTENT_CHARS) {
    logEvent({ event: "generate", styleId, contentLen: content.length, success: false,
      latencyMs: Date.now() - t0, statusCode: 413, ip, ua, error: "content_too_long" });
    return res.status(413).json({ error: `content too long (max ${MAX_CONTENT_CHARS} chars)` });
  }
  if (!GATEWAY_URL || !GATEWAY_KEY) {
    return res.status(500).json({ error: "AI Gateway not configured" });
  }

  let outline = null;
  let optimizerLatencyMs = 0;

  try {
    // Step 1: optimize loose intent into structured Markdown (unless rawMode)
    if (!rawMode) {
      const opt = await optimize({
        intent: String(content),
        styleHint: style.category,
        gatewayUrl: GATEWAY_URL,
        gatewayKey: GATEWAY_KEY,
        model: OPTIMIZER_MODEL,
      });
      outline = opt.markdown;
      optimizerLatencyMs = opt.latencyMs;
    }

    const finalContent = outline || String(content);

    // Step 2: render structured Markdown into beautiful HTML using the chosen style
    const upstream = await fetch(`${GATEWAY_URL}/api/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GATEWAY_KEY}`,
        "Content-Type": "application/json",
        "Accept-Encoding": "identity",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: style.prompt },
          { role: "user", content: finalContent },
        ],
        max_tokens: 8000,
      }),
    });
    if (!upstream.ok) {
      const txt = await upstream.text();
      logEvent({ event: "generate", styleId, contentLen: content.length, success: false,
        latencyMs: Date.now() - t0, statusCode: 502, ip, ua, error: txt.slice(0, 200) });
      return res.status(502).json({ error: "gateway error", detail: txt });
    }
    const data = await upstream.json();
    let html = data?.choices?.[0]?.message?.content || "";
    html = html.trim();
    if (html.startsWith("```")) {
      html = html.replace(/^```(?:html)?\s*/i, "").replace(/```\s*$/, "");
    }
    logEvent({
      event: "generate", styleId, contentLen: content.length, success: true,
      latencyMs: Date.now() - t0, statusCode: 200, htmlLen: html.length, ip, ua,
      rawMode: !!rawMode, optimizerLatencyMs, outlineLen: outline ? outline.length : 0,
    });
    res.json({ html, styleId, outline, rawMode: !!rawMode });
  } catch (err) {
    console.error(err);
    logEvent({ event: "generate", styleId, contentLen: content.length, success: false,
      latencyMs: Date.now() - t0, statusCode: 500, ip, ua, error: String(err).slice(0, 200) });
    res.status(500).json({ error: String(err) });
  }
});

// Auth: share
app.post("/api/share", auth, (req, res) => {
  const { html, title } = req.body || {};
  if (!html) return res.status(400).json({ error: "html required" });
  const id = crypto.randomBytes(6).toString("base64url");
  SHARES.set(id, { id, html, title: title || "Shared page", created: Date.now() });
  fs.writeFileSync(path.join(SHARE_DIR, `${id}.html`), html);
  logEvent({ event: "share", shareId: id, htmlLen: html.length, ip: clientIp(req) });
  res.json({ id, url: `/s/${id}` });
});

// Public: shared page (no auth — that's the point)
app.get("/s/:id", (req, res) => {
  const rec = SHARES.get(req.params.id);
  if (rec) return res.type("html").send(rec.html);
  const p = path.join(SHARE_DIR, `${req.params.id}.html`);
  if (fs.existsSync(p)) return res.type("html").send(fs.readFileSync(p, "utf8"));
  res.status(404).send("Not found");
});

// Auth: stats JSON
app.get("/admin/stats.json", auth, (req, res) => {
  const events = readEvents(parseInt(req.query.limit || "10000", 10));
  res.json(summarize(events));
});

// Auth: raw events JSONL (for offline analysis)
app.get("/admin/events.jsonl", auth, (req, res) => {
  const p = path.join(__dirname, "data", "events.jsonl");
  if (!fs.existsSync(p)) return res.type("text/plain").send("");
  res.type("text/plain").sendFile(p);
});

// Auth check helper for the static admin.html (fail fast if no token)
app.get("/admin", auth, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.listen(PORT, () => {
  console.log(`HTML-Anything listening on :${PORT}`);
  console.log(`Loaded ${STYLES.length} styles`);
  console.log(`Auth: ${process.env.ACCESS_TOKEN ? "enabled" : "disabled (set ACCESS_TOKEN to enable)"}`);
  console.log(`Rate limit: 12 generates / 60s per IP`);
  console.log(`Max content: ${MAX_CONTENT_CHARS} chars`);
  console.log(`Optimizer model: ${OPTIMIZER_MODEL}`);
  console.log(`Style model: ${MODEL}`);
});
