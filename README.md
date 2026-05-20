# HTML-Anything

> Turn any text or intent into a beautifully designed HTML page — 15 hand-crafted style packs, one click. **Built for Happycapy.ai.**

**Repo:** https://github.com/SHUJILAI/html-anything
**Website:** https://shujilai.github.io/html-anything/ — landing page with style gallery + one-click deploy

> GitHub Pages can only host static files, so the landing page above is the public website. To actually generate HTML, deploy your own server instance with one click below (you bring your AI Gateway key, the server keeps it server-side).

---

## What it does

You write a loose intent or paste a draft, pick a style on the left, hit **Generate**, and get a complete self-contained HTML page in seconds. Two-stage LLM pipeline: a fast **Optimizer** (Haiku) structures your input, then a **Style** prompt (Sonnet) renders the visual design.

15 styles cover docs, decks, posters, marketing posts, and experimental looks. See the [DELIVERY.md](./DELIVERY.md) for the full design rationale and per-style references.

---

## Deploy as a web app

### One-click on Render (recommended)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/SHUJILAI/html-anything)

After deploy, set these env vars in the Render dashboard:
- `AI_GATEWAY_BASE_URL` — your AI gateway endpoint
- `AI_GATEWAY_API_KEY` — your gateway key
- `ACCESS_TOKEN` is auto-generated; copy it from the dashboard

### Fly.io
```bash
flyctl launch --copy-config --no-deploy
flyctl secrets set \
  AI_GATEWAY_BASE_URL=https://your-gateway.com \
  AI_GATEWAY_API_KEY=sk-... \
  ACCESS_TOKEN=$(openssl rand -hex 16)
flyctl deploy
```

### Docker (any host)
```bash
docker build -t html-anything .
docker run -p 8080:8080 \
  -e AI_GATEWAY_BASE_URL=https://your-gateway.com \
  -e AI_GATEWAY_API_KEY=sk-... \
  -e ACCESS_TOKEN=demo-token-1234 \
  html-anything
```

### Run locally
```bash
npm install
cp .env.example .env  # edit with your credentials
node server.js        # http://localhost:8080
```

---

## File structure

```
html-anything/
├── server.js          # Express app — auth, rate-limit, /api/* routes, AI Gateway proxy
├── styles.js          # 15 style prompts (the core asset)
├── optimizer.js       # Intent → structured Markdown (Claude Haiku)
├── lib.js             # Auth middleware + rate limiting + analytics
├── public/
│   ├── index.html     # Main UI (4-quadrant: topbar / sidebar / composer / preview)
│   ├── app.js         # Frontend logic, token management, authedFetch wrapper
│   ├── style.css      # Styling + 15 CSS-only thumbnail mockups
│   ├── samples.js     # 5 example inputs
│   └── admin.html     # Token-gated analytics dashboard
├── data/events.jsonl  # Append-only event log (gitignored)
├── shares/            # Shared HTML pages (gitignored)
├── Dockerfile         # Universal container build
├── render.yaml        # Render Blueprint
├── fly.toml           # Fly.io config
├── .env.example       # Credential template
├── README.md          # This file
└── DELIVERY.md        # Architecture + style design rationale
```

---

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `AI_GATEWAY_BASE_URL` | Yes | — | OpenRouter-compatible gateway base URL |
| `AI_GATEWAY_API_KEY` | Yes | — | Bearer key for gateway |
| `ACCESS_TOKEN` | Recommended | — | If set, `/api/generate` and `/admin` require `x-ha-token` header. Leave unset to make the tool fully public (still rate-limited). |
| `HA_MODEL` | No | `anthropic/claude-sonnet-4.6` | Model used for the visual-rendering stage |
| `HA_OPTIMIZER_MODEL` | No | `anthropic/claude-haiku-4.5` | Model used for the structuring stage |
| `MAX_CONTENT_CHARS` | No | `50000` | Hard cap on input length |
| `PORT` | No | `8080` | HTTP port |

---

## API

| Endpoint | Auth | Description |
|---|---|---|
| `GET /api/styles` | Public | List the 15 style descriptors (id, name, category, accent, description) |
| `GET /api/styles/:id` | Token | Full style descriptor including the prompt |
| `POST /api/generate` | Token + rate limit | Body `{styleId, content, rawMode?}` → returns `{html, optimizerLatencyMs, styleLatencyMs}` |
| `POST /api/share` | Token | Body `{html}` → returns `{id, url}` for permanent share link |
| `GET /s/:id` | Public | Serve a previously shared HTML page |
| `GET /admin` | Token | Analytics dashboard (HTML) |
| `GET /admin/stats.json` | Token | Aggregated analytics JSON |
| `GET /admin/events.jsonl` | Token | Raw append-only event log |

Rate limit: 12 generations per 60-second window per IP (in-memory sliding window).

---

## Adding a new style

1. Append a new entry to `styles.js`:
   ```js
   {
     id: "my-new-style",
     name: "My New Style",
     category: "doc",   // doc | deck | poster | marketing | special
     accent: "#hexcolor",
     bg: "#hexcolor",
     description: "One-line tagline",
     prompt: `Output a complete <!DOCTYPE html>...</html> in the **Style Name** style.

   VIBE: ...
   LAYOUT (must include): ...
   TYPOGRAPHY: ...
   PALETTE (use exactly these): ...
   ABSOLUTELY DON'T: ...
   ANCHOR — match this stylistic direction:
   \`\`\`html
   <... a 30-80 line few-shot HTML anchor ...>
   \`\`\`
   REQUIREMENTS:
   - All CSS inline
   - Output ONLY the HTML.`,
   }
   ```
2. Add a CSS-only thumbnail mockup to `public/style.css`:
   ```css
   .thumb-my-new-style { background: #...; }
   .thumb-my-new-style::before { content: "..."; ... }
   ```
3. Restart `node server.js` — the new style appears automatically.

Prompt-writing checklist: VIBE, LAYOUT (≥5 specific items), PALETTE (with hex codes), TYPOGRAPHY (3 stacks), DON'T (≥3 anti-patterns), ANCHOR (~30–80 line HTML snippet for few-shot).

---

## License

MIT — for delivery to upstream / boss usage.
