# HTML-Anything · Style Prompts & Thumbnails

> **15 consistency-locked HTML style prompts + matching screenshot thumbnails.**
> A single drop-in JSON for any HTML-generation system. Each prompt is engineered so the same style produces visually-stable HTML across runs and across content.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#license)
![Styles](https://img.shields.io/badge/styles-15-c96442)
![Format](https://img.shields.io/badge/format-JSON-1f6feb)

---

## What's in this repo

```
.
├── prompts.json          # 15 style prompts with metadata + thumbnail URLs
└── images/               # 15 PNG screenshots (rendered samples, 1280×800 @2x)
```

That's it — no server, no build step, no dependencies. One JSON and an image folder.

---

## How it's meant to be used

```
┌─────────────────┐    user clicks      ┌──────────────────────┐
│  Style gallery  │ ──── card ────────▶ │  Composer / TextArea │
│  (thumbnails)   │   auto-fills        │  (prompt prefilled)  │
└─────────────────┘                     └──────────────────────┘
                                                  │
                                                  ▼
                                       ┌──────────────────────┐
                                       │  Your LLM pipeline   │
                                       │  (Claude / GPT / …)  │
                                       └──────────────────────┘
                                                  │
                                                  ▼
                                            Rendered HTML
```

1. Render the gallery from `prompts.json` — each card uses the style's `img` URL as preview
2. When user clicks a card, inject that style's `prompt` into the user's textarea
3. User adds their own content / intent below it, hits Generate
4. You send the combined prompt to your LLM, get back a self-contained HTML page

---

## Data shape

### `prompts.json`

```json
{
  "version": "1.0",
  "styles": [
    {
      "id": "notion-linear",
      "name": "Notion / Linear",
      "title": "Notion / Linear",
      "summary": "Three-column docs page with sidebar nav, light callouts, and a sticky TOC.",
      "category": "doc",
      "accent": "#c96442",
      "bg": "#fafaf9",
      "img": "https://storage.res-capy.com/html-anything/notion-linear.webp",
      "prompt": "<long English prompt with VIBE / LAYOUT / TYPOGRAPHY / PALETTE / DON'T / ANCHOR HTML sections>",
      "share": "https://happycapy.ai/s/<id>"
    }
  ]
}
```

| Field | Type | Purpose |
|---|---|---|
| `id` | string | Stable key, mirrors image filename |
| `name` | string | Short display name |
| `title` | string | Card heading |
| `summary` | string | One-line description for the card |
| `category` | string | `doc` / `deck` / `marketing` / `poster` / `special` |
| `accent` | hex | Brand accent for that style's card border / hover |
| `bg` | hex | Card background tint |
| `img` | URL | Thumbnail screenshot URL (WebP on `storage.res-capy.com`, ~1280×800) |
| `prompt` | string | The locked style prompt to inject into the composer |
| `share` | URL | Live demo of this style rendered against the shared corpus (Capy share link). Empty if not yet recorded. |

---

## How "consistency-locked" works

Each prompt is structured to remove design-time ambiguity, so the LLM has minimal room to drift:

- **VIBE** — one-line intent
- **LAYOUT** — exact section order, grid, whitespace ratio (frozen)
- **TYPOGRAPHY** — font stack, size scale, line-height (frozen, hex-coded)
- **PALETTE** — bg / fg / accent hex colors (frozen)
- **DON'T** — explicit forbidden patterns (no JS, no external fonts, no animation, no responsive break unless specified)
- **ANCHOR HTML** — a skeletal HTML block the LLM is instructed to fill, not redesign

This means whether the user pastes a meeting note or a product launch, the *Notion / Linear* card always renders a Notion-like layout — only the content changes.

---

## Style catalog (15)

| ID | Name | Category |
|---|---|---|
| `notion-linear` | Notion / Linear | doc |
| `kami-parchment` | Kami Parchment | doc |
| `eink-editorial` | E-ink Editorial | doc |
| `academic-paper` | Long-form Essay | doc |
| `handwritten-notes` | Meeting Notes | doc |
| `swiss-international` | Swiss International | deck |
| `keynote-modern` | Keynote Modern | deck |
| `minimal-pitch` | Minimal Pitch | deck |
| `vintage-magazine` | Vintage Magazine | marketing |
| `product-landing` | Product Landing | marketing |
| `card-summary` | Twitter / X Card | marketing |
| `brutalist` | Brutalist | marketing |
| `magazine-poster` | Magazine Poster | poster |
| `terminal-code` | Terminal / Runbook | special |
| `cyberpunk-neon` | Cyberpunk Terminal | special |

All thumbnails were generated from the **same shared content prompt**, so visual differences across cards are purely the result of the style prompt.

---

## Quick integration example

```js
// 1. Fetch the JSON
const data = await fetch(
  'https://raw.githubusercontent.com/SHUJILAI/html-anything/main/prompts.json'
).then(r => r.json());

// 2. Render gallery
data.styles.forEach(s => {
  const card = document.createElement('div');
  card.innerHTML = `<img src="${s.img}" alt="${s.title}"><h4>${s.title}</h4><p>${s.summary}</p>`;
  card.onclick = () => fillComposer(s.id);
  gallery.appendChild(card);
});

// 3. On click, inject the matching prompt
function fillComposer(id) {
  const style = data.styles.find(s => s.id === id);
  document.getElementById('composer').value = style.prompt;
}
```

---

## License

MIT — use the prompts and screenshots in any project, commercial or otherwise.

---

## Credits

Designed for [Happycapy.ai](https://happycapy.ai). Prompts and screenshot rendering by Capy + Claude.
