/* ========== HTML-Anything · auth + rate-limit + analytics ========== */
const fs = require("fs");
const path = require("path");

/* ----- Auth -----
 * If ACCESS_TOKEN env var is set, requests must carry it via:
 *   header "x-ha-token: <token>"  OR  query "?token=<token>"
 * If unset, the middleware is a no-op (dev mode).
 */
function authMiddleware() {
  const TOKEN = process.env.ACCESS_TOKEN;
  return (req, res, next) => {
    if (!TOKEN) return next(); // disabled
    const got = req.get("x-ha-token") || req.query.token;
    if (got === TOKEN) return next();
    res.status(401).json({ error: "unauthorized — missing or wrong access token" });
  };
}

/* ----- Rate limit -----
 * Sliding window per IP. Default 12 generations / 60s.
 */
function rateLimit({ max = 12, windowMs = 60_000 } = {}) {
  const buckets = new Map();
  return (req, res, next) => {
    const ip = (req.headers["x-forwarded-for"] || req.ip || "?").split(",")[0].trim();
    const now = Date.now();
    const arr = (buckets.get(ip) || []).filter((t) => now - t < windowMs);
    if (arr.length >= max) {
      const wait = Math.ceil((windowMs - (now - arr[0])) / 1000);
      res.set("Retry-After", String(wait));
      return res.status(429).json({ error: `rate limit (${max}/${windowMs / 1000}s) — retry in ${wait}s` });
    }
    arr.push(now);
    buckets.set(ip, arr);
    next();
  };
}

/* ----- Analytics -----
 * Append-only JSONL at data/events.jsonl. Aggregate on demand.
 */
const DATA_DIR = path.join(__dirname, "data");
const EVENTS_PATH = path.join(DATA_DIR, "events.jsonl");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function logEvent(evt) {
  try {
    const line = JSON.stringify({ ts: new Date().toISOString(), ...evt }) + "\n";
    fs.appendFileSync(EVENTS_PATH, line);
  } catch (e) {
    console.error("logEvent failed:", e);
  }
}

function readEvents(limit = 5000) {
  if (!fs.existsSync(EVENTS_PATH)) return [];
  const text = fs.readFileSync(EVENTS_PATH, "utf8");
  const lines = text.trim().split("\n").filter(Boolean);
  const slice = lines.slice(-limit);
  return slice.map((l) => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
}

function summarize(events) {
  const total = events.length;
  const byEvent = {};
  const byStyle = {};
  const byHour = {};
  let totalLatency = 0;
  let latencyCount = 0;
  let successCount = 0;
  let errorCount = 0;
  let totalContentLen = 0;
  let contentLenCount = 0;
  const ipSet = new Set();

  for (const e of events) {
    byEvent[e.event] = (byEvent[e.event] || 0) + 1;
    if (e.styleId) byStyle[e.styleId] = (byStyle[e.styleId] || 0) + 1;
    if (e.ts) {
      const hr = e.ts.slice(0, 13); // YYYY-MM-DDTHH
      byHour[hr] = (byHour[hr] || 0) + 1;
    }
    if (typeof e.latencyMs === "number") {
      totalLatency += e.latencyMs;
      latencyCount++;
    }
    if (e.event === "generate") {
      if (e.success) successCount++;
      else errorCount++;
      if (typeof e.contentLen === "number") {
        totalContentLen += e.contentLen;
        contentLenCount++;
      }
    }
    if (e.ip) ipSet.add(e.ip);
  }

  const topStyles = Object.entries(byStyle)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ id, count }));

  const hourly = Object.entries(byHour)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([hour, count]) => ({ hour, count }));

  return {
    total,
    byEvent,
    topStyles,
    hourly,
    avgLatencyMs: latencyCount ? Math.round(totalLatency / latencyCount) : 0,
    avgContentLen: contentLenCount ? Math.round(totalContentLen / contentLenCount) : 0,
    successRate: successCount + errorCount > 0
      ? +(successCount / (successCount + errorCount)).toFixed(3)
      : null,
    successCount,
    errorCount,
    uniqueIps: ipSet.size,
  };
}

/* ----- IP helper ----- */
function clientIp(req) {
  return ((req.headers["x-forwarded-for"] || "").split(",")[0].trim()
    || req.ip
    || req.connection?.remoteAddress
    || "?");
}

module.exports = { authMiddleware, rateLimit, logEvent, readEvents, summarize, clientIp };
