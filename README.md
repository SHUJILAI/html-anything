# HTML-Anything · Style Prompts & Thumbnails

> **15 consistency-locked HTML style prompts + matching screenshot thumbnails.**
> Drop-in data files (two JSONs) for any HTML-generation system. Each prompt is engineered so the same style produces visually-stable HTML across runs and across content.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#license)
![Styles](https://img.shields.io/badge/styles-15-c96442)
![Format](https://img.shields.io/badge/format-JSON-1f6feb)

---

## What's in this repo

```
.
├── prompts.json          # 15 style prompts with metadata
├── thumbnails.json       # 15 style → screenshot URL mappings
└── images/               # 15 PNG screenshots (rendered samples, 1280×800 @2x)
```

That's it — no server, no build step, no dependencies. Two JSONs and an image folder.

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

1. Render the gallery from `thumbnails.json` — each card is one style with its preview image
2. When user clicks a card, look up the same `id` in `prompts.json` and inject `prompt` into the user's textarea
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
      "prompt": "<long English prompt with VIBE / LAYOUT / TYPOGRAPHY / PALETTE / DON'T / ANCHOR HTML sections>"
    }
  ]
}
```

| Field | Type | Purpose |
|---|---|---|
| `id` | string | Stable key, mirrors `thumbnails.json` and image filename |
| `name` | string | Short display name |
| `title` | string | Card heading |
| `summary` | string | One-line description for the card |
| `category` | string | `doc` / `deck` / `marketing` / `tech` / `poster` |
| `accent` | hex | Brand accent for that style's card border / hover |
| `bg` | hex | Card background tint |
| `prompt` | string | The locked style prompt to inject into the composer |

### `thumbnails.json`

```json
{
  "version": "1.0",
  "thumbnails": [
    {
      "id": "notion-linear",
      "title": "Notion / Linear",
      "url": "https://raw.githubusercontent.com/SHUJILAI/html-anything/main/images/notion-linear.png"
    }
  ]
}
```

`id` is the join key — every entry in `thumbnails.json` matches exactly one entry in `prompts.json`.

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
| `academic-paper` | Long-form Essay | doc |
| `card-summary` | Card Summary | doc |
| `handwritten-notes` | Meeting Notes | doc |
| `eink-editorial` | E-ink Editorial | doc |
| `minimal-pitch` | Minimal Pitch | deck |
| `keynote-modern` | Keynote Modern | deck |
| `product-landing` | Product Landing | marketing |
| `vintage-magazine` | Vintage Magazine | marketing |
| `kami-parchment` | Parchment Scroll | marketing |
| `terminal-code` | Terminal / Code | tech |
| `brutalist` | Neo-Brutalist | poster |
| `swiss-international` | Swiss Grid | poster |
| `magazine-poster` | Magazine Poster | poster |
| `cyberpunk-neon` | Cyberpunk HUD | poster |

All thumbnails were generated from the **same shared content prompt** ("State of AI-Native Product Design 2026" — title, KPIs, body, quotes, CTA), so visual differences across cards are purely the result of the style prompt.

---

## Quick integration example

```js
// 1. Fetch both JSONs
const [prompts, thumbnails] = await Promise.all([
  fetch('https://raw.githubusercontent.com/SHUJILAI/html-anything/main/prompts.json').then(r => r.json()),
  fetch('https://raw.githubusercontent.com/SHUJILAI/html-anything/main/thumbnails.json').then(r => r.json()),
]);

// 2. Render gallery
thumbnails.thumbnails.forEach(t => {
  const card = document.createElement('div');
  card.innerHTML = `<img src="${t.url}" alt="${t.title}"><h4>${t.title}</h4>`;
  card.onclick = () => fillComposer(t.id);
  gallery.appendChild(card);
});

// 3. On click, inject the matching prompt
function fillComposer(id) {
  const style = prompts.styles.find(s => s.id === id);
  document.getElementById('composer').value = style.prompt;
}
```

---

## License

MIT — use the prompts and screenshots in any project, commercial or otherwise.

---

## Credits

Designed for [Happycapy.ai](https://happycapy.ai). Prompts and screenshot rendering by Capy + Claude.
