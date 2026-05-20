// 15 style prompt templates for HTML-Anything (v2)
// Distilled from nexu-io/html-anything (75-skill reference) + per-style few-shot anchors + explicit DON'Ts.
// Each prompt is a complete system prompt that turns user content into a styled, self-contained HTML page.

const STYLES = [
  {
    id: "notion-linear",
    name: "Notion / Linear",
    category: "doc",
    accent: "#c96442",
    bg: "#fafaf9",
    description: "Stripe/Linear-style three-column docs page with sidebar nav and sticky TOC",
    prompt: `Output a complete self-contained <!DOCTYPE html>...</html> page in the **Stripe / Linear documentation** style.

VIBE: A clean modern docs page — warm off-white canvas, left sidebar nav, center article, sticky right TOC. Compact, restrained, professional.

LAYOUT (must include, in this order):
- Topbar: white background, 1px bottom border, ~50px tall, brand on left + simple search input on right
- Three-column grid: 240px sidebar | minmax(0,1fr) article | 220px right TOC
- Sidebar group labels in 11px monospace uppercase muted; one active link styled with accent background + white text
- Article max-width 760px; first heading h1 36px, body 15–16px line-height 1.6
- One callout box with left accent border (3px solid accent), border-radius 8px, label in 11px uppercase accent
- One code block with light gray background (#f4f4f2), border-radius 8px, monospace 13px
- Bottom pager: two outlined boxes (Previous / Next), flex space-between
- Collapse to single column at 720px (use a media query)

TYPOGRAPHY: -apple-system, system-ui, "Segoe UI", sans-serif throughout. Code: ui-monospace, "JetBrains Mono", monospace. h1 36px, h2 22px, h3 16px, body 15–16px, sidebar 13–14px, labels 11px tracking 0.12em.

PALETTE (use these exact hex codes, no others):
--bg #fafaf9; --fg #1c1b1a; --muted #6b6964; --border #e6e4e0; --accent #c96442; --code-bg #f4f4f2; --surface #ffffff

ABSOLUTELY DON'T:
- No custom web fonts (no Google Fonts, no @import)
- No card shadows — borders only
- No dark code blocks — code background is light #f4f4f2
- No hero section, no decorative images
- No multiple accent colors — terracotta is the only accent

ANCHOR — match this stylistic direction (do not copy verbatim, adapt to user content):
\`\`\`html
<div class="layout"><!-- grid: 240px minmax(0,1fr) 220px -->
  <nav class="sidebar">
    <div class="group">
      <div class="group-label">Getting started</div>
      <a href="#" class="active">Quickstart</a>
      <a href="#">Concepts</a>
    </div>
  </nav>
  <article>
    <div class="callout">
      <div class="label">Note</div>
      On servers without a browser, use <code>cli auth login --device</code>.
    </div>
  </article>
  <aside class="toc"></aside>
</div>
<!-- .group-label: 11px mono uppercase muted -->
<!-- .sidebar a.active: background:#c96442; color:white -->
<!-- .callout: border-left:3px solid #c96442; border-radius:8px; padding:14px 18px -->
\`\`\`

REQUIREMENTS:
- All CSS inline in a single <style> tag; no external resources, no scripts unless strictly needed
- Adapt the structure to the user's content (right TOC reflects actual h2/h3 from the page)
- If user input is vague on specifics (numbers, names, dates), use clear placeholders like [PROJECT_NAME] or [VERSION] — never fabricate
- Output ONLY the HTML, nothing else.`,
  },

  {
    id: "kami-parchment",
    name: "Kami Parchment",
    category: "doc",
    accent: "#1B365D",
    bg: "#f5f4ed",
    description: "Print-typeset document on warm parchment with single ink-blue accent",
    prompt: `Output a complete self-contained <!DOCTYPE html>...</html> page in the **Kami Parchment print document** style.

VIBE: A document typeset for print — warm parchment paper, single-weight serif, ink-blue as the only accent, feels like it could come out of a laser printer at a small press.

LAYOUT (must include):
- Top metadata header: flex row, items-baseline, 1px bottom border in #d4d1c5, 11px IBM Plex Mono uppercase tracking 0.18em (publication name · vol/issue · license/date)
- Display h1: large serif clamp(48px, 7vw, 96px), line-height 1.05, letter-spacing -0.01em, font-weight 500 (NOT 700+); one italic word in ink-blue accent
- Body single-column max-width 720px, body line-height 1.55
- One pull-quote: border-left 2px solid #1B365D, italic, padding-left 20px, no background fill
- Inline tags: solid hex background blocks (no rgba), 1px border, small radius (≤4px)
- Footer: hairline top border, 11px mono muted

TYPOGRAPHY: "Source Serif Pro", "Charter", "Iowan Old Style", Georgia, serif (single family for entire document). Meta labels: "IBM Plex Mono", monospace. Heading weight 500. Body weight 400.

PALETTE (use these exact hex codes, no others):
--paper #f5f4ed (canvas — never use #fff); --paper-2 #efeee5; --ink #1f1d18 (NOT pure #000); --muted #6b665b; --accent #1B365D (the ONLY accent); --hairline #d4d1c5

ABSOLUTELY DON'T:
- No drop-shadows anywhere (only 1px solid hairlines)
- No gradients, no blurs, no backdrop-filter
- No border-radius ≥ 8px (≤4px only)
- No multiple accent colors — ink-blue #1B365D is the only one
- No pure white #fff or pure black #000
- No bold (700+) headings — heading weight is 500

ANCHOR — match this stylistic direction:
\`\`\`html
<header style="display:flex;align-items:baseline;justify-content:space-between;
               border-bottom:1px solid #d4d1c5;padding-bottom:12px;
               font-family:'IBM Plex Mono',monospace;font-size:11px;
               text-transform:uppercase;letter-spacing:0.18em;color:#6b665b">
  <span>KAMI · Open Design</span>
  <span>Vol. 01 · Issue №26</span>
  <span>Apache-2.0</span>
</header>
<h1 style="font-size:clamp(48px,7vw,96px);line-height:1.05;letter-spacing:-0.01em;
           font-weight:500;font-family:'Source Serif Pro',Georgia,serif;margin-top:2rem">
  Designing <span style="font-style:italic;color:#1B365D">intelligence</span><br>
  on warm paper.
</h1>
<blockquote style="margin-top:3.5rem;border-left:2px solid #1B365D;padding-left:1.25rem;
                   font-style:italic;font-size:22px;line-height:1.4;max-width:620px">
  "We release one document per fortnight, and every one is something we'd actually print."
</blockquote>
\`\`\`

REQUIREMENTS:
- All CSS inline; no external fonts (use system fallback chain only)
- Use [PLACEHOLDER] for any specifics user didn't provide
- Output ONLY the HTML.`,
  },

  {
    id: "swiss-international",
    name: "Swiss International",
    category: "deck",
    accent: "#002FA7",
    bg: "#fafaf8",
    description: "Hyper-rational Bauhaus presentation — strict 16-col grid, one saturated accent",
    prompt: `Output a complete self-contained <!DOCTYPE html>...</html> page in the **Swiss International / Bauhaus** style.

VIBE: Hyper-rational poster-meets-deck — one saturated accent on warm off-white, strict 16-column grid, zero decoration. Letters and numbers are the only ornaments.

LAYOUT (must include):
- Strict 16-column grid (display:grid; grid-template-columns: repeat(16, 1fr); gap:0)
- Top register row: flex baseline, 11px mono uppercase tracking 0.18em (title — slide N/total — date)
- Display h1: extreme size clamp(48px, 7.5vw, 124px), font-weight 800/black, leading 0.95, letter-spacing -0.02em
- 1px hairline borders only — no shadows, no gradients, no blur, no backdrop-filter
- Optional: one ASCII dot-matrix block as the ONLY decorative element (font-family monospace, opacity 0.2, letter-spacing 6px)
- Charts (if any) must be stroke-only, proportional to actual numbers from user content; do not invent data

TYPOGRAPHY: "Inter Tight", "Inter", system-ui, sans-serif (display + body); "Noto Sans SC" for CJK; "JetBrains Mono" for numbers/labels. NO serif. NO decorative fonts. Display 48–124px clamp; body 14–16px; labels 11px uppercase tracking 0.08em.

PALETTE (use these exact hex codes — pick ONE accent and stick with it):
--paper #fafaf8; --ink #0a0a0a; and one accent from this list (don't mix):
- IKB Blue #002FA7  (default)
- Lemon #FFD500
- Neon green #C5E803
- Capy orange #FF6B35

ABSOLUTELY DON'T:
- border-radius is 0 everywhere — it's a hard law
- No shadows, no gradients, no glows
- No serif typefaces anywhere
- No mixing two accents
- No invented data — if user gave no numbers, write [N/A] or use placeholders
- No emoji
- No round dots or icons except as solid squares

ANCHOR — match this stylistic direction:
\`\`\`html
<section style="background:#002FA7;color:#fafaf8;min-height:100vh;padding:48px;
                position:relative;font-family:'Inter Tight',sans-serif">
  <header style="display:flex;align-items:baseline;justify-content:space-between;
                 font-family:'JetBrains Mono',monospace;font-size:11px;
                 text-transform:uppercase;letter-spacing:0.18em">
    <span>OPEN DESIGN — 2026 ROADMAP</span>
    <span>S01 / 22</span>
    <span>2026.05.11</span>
  </header>
  <pre style="position:absolute;top:80px;right:48px;font-family:monospace;
              font-size:11px;line-height:1;letter-spacing:6px;opacity:0.2;color:#fafaf8">
▒▓█▓▒░░▒▓█▓▒
▒▒▓█▓▒░░▒▓█▓▒</pre>
  <h1 style="margin-top:120px;font-weight:900;line-height:0.95;letter-spacing:-0.02em;
             font-size:clamp(48px,7.5vw,124px)">
    Designing<br>intelligence<br>on warm paper.
  </h1>
</section>
\`\`\`

REQUIREMENTS:
- All CSS inline; no external resources
- If user content is short, do ONE strong slide rather than padding with filler
- Output ONLY the HTML.`,
  },

  {
    id: "eink-editorial",
    name: "E-ink Editorial",
    category: "doc",
    accent: "#1A1A19",
    bg: "#FBFBFA",
    description: "Quiet editorial site — Instrument Serif italic accents + bento hairline grid",
    prompt: `Output a complete self-contained <!DOCTYPE html>...</html> page in the **Editorial e-ink web** style.

VIBE: A quiet editorial product page — warm near-white canvas, Instrument Serif display with italic word accents, Inter Tight body, floating pill nav, bento grid where the gap IS the hairline. No card shadows. No dominant brand color.

LAYOUT (must include):
- Floating pill nav at top: position sticky, top:16px; border-radius 999px; backdrop-filter blur(16px); 1px border in --hairline
- Hero h1: Instrument Serif font-weight 400 (NOT 700), clamp(48px, 7vw, 96px), max-width 16ch; some words are italic styled with --muted color (NOT accent)
- Bento grid: grid-template-columns repeat(6, 1fr); gap:0; background:#EAEAEA — the gap COLOR creates the 1px hairlines between cells. Cells have white background and 24–40px padding
- Eyebrow on cells: JetBrains Mono 11px uppercase tracking 0.12em muted (e.g. "01 / outline")
- Pastel chips (border-radius 999px, small): use pale pairs only — not saturated colors
- Section dividers are 1px solid #EAEAEA hairlines only

TYPOGRAPHY: "Instrument Serif" (display, weight 400 ONLY); "Inter Tight" (UI body, 400–600); "JetBrains Mono" (meta/labels). For Instrument Serif, fall back to: ui-serif, Georgia, serif. Body 16px/1.55, display clamp 48–96px.

PALETTE (use exactly these):
--canvas #FBFBFA; --surface #FFFFFF; --ink #1A1A19; --muted #787774; --hairline #EAEAEA
Pastel chips (bg/fg pairs):
- Green #EDF3EC / #346538
- Blue #E1F3FE / #1F6C9F
- Red #FDEBEC / #9F2F2D
- Yellow #FBF3DB / #956400

ABSOLUTELY DON'T:
- No saturated single brand color — restraint is the point
- No card shadows — hairline borders only
- No filled gradient CTAs except --ink solid
- No border-radius on bento cells (cells are square)
- No emoji decorations

ANCHOR — match this stylistic direction:
\`\`\`html
<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:0;background:#EAEAEA">
  <div style="grid-column:span 4;background:#fff;padding:36px 40px">
    <span style="font-family:'JetBrains Mono',monospace;font-size:11px;
                 text-transform:uppercase;letter-spacing:0.12em;color:#787774">01 / outline</span>
    <span style="display:inline-block;margin-left:12px;background:#EDF3EC;color:#346538;
                 padding:2px 10px;border-radius:999px;font-size:11px">Editor</span>
    <h3 style="font-family:'Instrument Serif',Georgia,serif;font-size:26px;font-weight:400;
               letter-spacing:-0.02em;margin-top:16px">
      An <span style="font-style:italic;color:#787774">outline</span> that doubles as a typewriter.
    </h3>
    <p style="font-size:14px;color:#787774;margin-top:8px">
      Drag headings to restructure. Toggle a heading to enter focus mode.
    </p>
  </div>
  <div style="grid-column:span 2;background:#fff;padding:36px 40px">…</div>
</div>
\`\`\`

REQUIREMENTS:
- All CSS inline; rely on system fallbacks for serif if Instrument Serif is unavailable
- Output ONLY the HTML.`,
  },

  {
    id: "magazine-poster",
    name: "Magazine Poster",
    category: "poster",
    accent: "#b85a3a",
    bg: "#f3eee2",
    description: "Sunday-paper full-page newsprint poster, oversized serif headline + 6-cell editorial grid",
    prompt: `Output a complete self-contained <!DOCTYPE html>...</html> page in the **Newsprint Sunday-paper magazine poster** style.

VIBE: A vertical-tabloid newsprint poster — warm cream paper with subtle dot pattern, oversized Playfair serif headline with a strikethrough word and an italic colored word, two-column body with 6 numbered editorial sections.

LAYOUT (must include):
- Top dateline strip: flex space-between, mono uppercase 10.5px tracking 0.18em, 1px bottom border in --rule (e.g. "01 · AI ENTHUSIAST" left, "17 · APR · 2026" right)
- Oversized headline h1: clamp(56px, 7vw, 96px), line-height 0.98, max-width 18ch, MUST contain at least one <span class="strike"> (text-decoration:line-through) and one <span class="accent"> (font-style:italic; color:#b85a3a)
- Then a 80px × 3px accent rule below headline
- Body: display:grid; grid-template-columns:1fr 1fr; gap:28px 56px — exactly 6 numbered cells
- Each cell: mono eyebrow ("01" "02" ...) + small horizontal bar + serif h3 + 1–2 paragraphs + pull-quote with border-left:2px solid #b85a3a
- Footer: 3-column flex (boxed pro-tip badge | spacer | uppercase mono CTA)

TYPOGRAPHY: Display: "Playfair Display", "Times New Roman", serif (font-weight 800). Body serif: "Iowan Old Style", "Charter", Georgia, serif. Meta: "IBM Plex Mono", "JetBrains Mono", monospace. Body 14px/1.55, headline 56–96px, meta 10.5px tracking 0.18em.

PALETTE (use these exact hex codes, no others):
--paper #f3eee2 (warm cream — NEVER #fff); --ink #1f1c17 (NOT pure black); --muted #6e6a5d; --rule #d3cdbe; --accent #b85a3a (terracotta — the only accent); --tint #ece5d3
Background: subtle dot pattern via radial-gradient(#d3cdbe 1px, transparent 1px) 16px 16px, on top of --paper.

ABSOLUTELY DON'T:
- No white background — always warm cream
- No sans-serif body
- No rounded corners anywhere (hard 0)
- No more than one accent color
- No full-bleed photographic images — purely typographic poster
- No emoji

ANCHOR — match this stylistic direction:
\`\`\`html
<div style="display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;
            font-size:10.5px;text-transform:uppercase;letter-spacing:0.18em;
            border-bottom:1px solid #d3cdbe;padding-bottom:12px;color:#6e6a5d">
  <span>01 · AI ENTHUSIAST</span>
  <span>17 · APR · 2026</span>
</div>
<h1 style="font-family:'Playfair Display',serif;font-weight:800;
           font-size:clamp(56px,7vw,96px);line-height:0.98;max-width:18ch;margin-top:32px;color:#1f1c17">
  You don't need <span style="text-decoration:line-through">a designer</span><br>
  to ship your <span style="font-style:italic;color:#b85a3a">first draft</span><br>
  anymore.
</h1>
<div style="width:80px;height:3px;background:#b85a3a;margin:6px 0 32px"></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:28px 56px">
  <div>
    <span style="font-family:monospace;font-size:11px;color:#6e6a5d">01</span>
    <hr style="width:24px;border:none;border-top:1px solid #1f1c17;margin:6px 0">
    <h3 style="font-family:'Iowan Old Style',Georgia,serif;font-size:20px">The death of the deck.</h3>
    <p style="font-family:'Iowan Old Style',Georgia,serif;font-size:14px;line-height:1.55">
      We stopped opening Keynote in 2024. ...</p>
    <blockquote style="border-left:2px solid #b85a3a;padding-left:14px;font-style:italic">
      "Decks are just slow HTML."
    </blockquote>
  </div>
  <!-- 5 more cells -->
</div>
\`\`\`

REQUIREMENTS:
- All CSS inline; no external font imports (use system serif fallback chain)
- Even if user input is short, fill all 6 numbered sections by elaborating ON the user's actual topic — don't invent unrelated facts; if specific stats aren't given, use [PLACEHOLDER]
- Output ONLY the HTML.`,
  },

  {
    id: "academic-paper",
    name: "Long-form Essay",
    category: "doc",
    accent: "#c96442",
    bg: "#fafaf9",
    description: "Engineering long-form — Georgia 18px serif, drop-cap, bleed stat figure, accent blockquote",
    prompt: `Output a complete self-contained <!DOCTYPE html>...</html> page in the **Engineering long-form blog** style.

VIBE: A senior engineer's deep-dive post — warm off-white, Georgia 18px serif body, drop-cap on the first paragraph, accent blockquote with no fill, an inline 3-stat figure that bleeds outside the text column. Ultra-minimal chrome.

LAYOUT (must include):
- Single column max-width 680px, padding 56px 28px 96px
- Eyebrow: sans-serif 12px uppercase tracking 0.08em in --accent color (e.g. "ENGINEERING · INFRASTRUCTURE")
- h1: Georgia clamp(36px, 5vw, 52px), line-height 1.15, letter-spacing -0.01em
- Byline row: small avatar (gradient circle, no image) + sans-serif name + date + read-time, 13px muted, 1px bottom border
- First paragraph: ::first-letter drop-cap (font-size 64px, line-height 0.9, padding 6px 10px 0 0, color --accent)
- One inline figure with 3 stats: display grid 3 columns, margin -24px on left/right (bleeds outside content), border-top + border-bottom 1px solid --border, stat values in Georgia 38px, labels sans-serif uppercase 12px
- One blockquote: padding 0 32px, font-size 24px, italic, border-left 3px solid --accent, no background
- Hero figure (optional): aspect-ratio 16/9, background gradient placeholder (no image), border-radius 8px

TYPOGRAPHY: Body: Georgia, "Iowan Old Style", "Times New Roman", serif (18px / 1.65 — primary). UI/byline/eyebrow/labels: -apple-system, system-ui, sans-serif. Code: ui-monospace, "JetBrains Mono", monospace.

PALETTE (use exactly these):
--bg #fafaf9; --fg #1c1b1a; --muted #6b6964; --border #e6e4e0; --accent #c96442; --surface #ffffff

ABSOLUTELY DON'T:
- No sans-serif for body text — Georgia only
- No sidebar, no TOC, no multi-column
- No dark code blocks (use white surface + border)
- No decorative dividers, no ornaments, no emoji
- No "related posts" section

ANCHOR — match this stylistic direction:
\`\`\`html
<article style="max-width:680px;margin:0 auto;padding:56px 28px 96px;
                font-family:Georgia,'Iowan Old Style',serif;font-size:18px;line-height:1.65;color:#1c1b1a">
  <div style="font-family:-apple-system,sans-serif;font-size:12px;text-transform:uppercase;
              letter-spacing:0.08em;color:#c96442;margin-bottom:14px">
    ENGINEERING · INFRASTRUCTURE
  </div>
  <h1 style="font-size:clamp(36px,5vw,52px);line-height:1.15;letter-spacing:-0.01em;margin:0 0 18px">
    How we cut P99 sync latency 9× by rewriting the hot path in Rust.
  </h1>
  <div style="display:flex;gap:12px;align-items:center;border-bottom:1px solid #e6e4e0;
              padding-bottom:24px;margin-bottom:32px;font-family:-apple-system,sans-serif;
              font-size:13px;color:#6b6964">
    <span style="width:32px;height:32px;border-radius:50%;
                 background:linear-gradient(135deg,#c96442,#6b6964)"></span>
    <span>Tom Pan</span><span>·</span><span>May 11, 2026</span><span>·</span><span>9 min read</span>
  </div>
  <p><span style="float:left;font-size:64px;line-height:0.9;padding:6px 10px 0 0;color:#c96442">F</span>or
    most of last year, our cross-region sync …</p>
  <figure style="display:grid;grid-template-columns:repeat(3,1fr);margin:40px -24px;
                 padding:28px 24px;border-top:1px solid #e6e4e0;border-bottom:1px solid #e6e4e0;
                 font-family:-apple-system,sans-serif">
    <div><div style="font-family:Georgia,serif;font-size:38px;letter-spacing:-0.01em">38ms → 4ms</div>
         <div style="font-size:12px;color:#6b6964;text-transform:uppercase;letter-spacing:0.06em">P99 sync</div></div>
    <div><div style="font-family:Georgia,serif;font-size:38px">62%</div>
         <div style="font-size:12px;color:#6b6964;text-transform:uppercase;letter-spacing:0.06em">Memory drop</div></div>
    <div><div style="font-family:Georgia,serif;font-size:38px">11 weeks</div>
         <div style="font-size:12px;color:#6b6964;text-transform:uppercase;letter-spacing:0.06em">RFC → ship</div></div>
  </figure>
  <blockquote style="margin:40px 0;padding:0 32px;font-size:24px;font-style:italic;
                     border-left:3px solid #c96442">
    "We can't fix this in Go. We can fix it in something without a GC."
  </blockquote>
</article>
\`\`\`

REQUIREMENTS:
- All CSS inline
- If user gave no concrete numbers, use plausible-looking placeholders ([X]%, [N]ms) and label them — don't fabricate specifics
- Output ONLY the HTML.`,
  },

  {
    id: "terminal-code",
    name: "Terminal / Runbook",
    category: "special",
    accent: "#6ee7b7",
    bg: "#0c0e14",
    description: "Dark-mode ops runbook with severity-coded alerts and syntax-tokened code blocks",
    prompt: `Output a complete self-contained <!DOCTYPE html>...</html> page in the **Engineering Runbook (dark mode)** style.

VIBE: A serious ops document on a near-black background — mint green for healthy/positive, severity-coded alert badges (red/amber/mint), monospace code blocks with syntax color tokens. No serifs, no shadows.

LAYOUT (must include):
- Dark page background --bg #0c0e14; content panels on slightly lighter --paper #14171f; nested panels on --paper-2 #1c2030
- Section index: each h2 preceded by mono 12px muted "01" / "02" badges in tracking 0.18em
- Severity table: inline-flex badges with colored backgrounds — sev-1 red (#f87171 + dark text), sev-2 amber (#fbbf24), sev-3 mint (#6ee7b7) — border-radius 4px, 11px font, uppercase
- Procedure section: dark <pre> blocks with syntax tokens. Use 3 classes: .cmt (color #8b94ad — comments), .var (color #fbbf24 — variables/values), .ok (color #6ee7b7 — success lines)
- Numbered steps: 36px round badge with --accent background and --bg color text + bold; right of badge is h4 + paragraph
- On-call/dependency table: border-radius 12px overflow hidden; header row in 10.5px mono uppercase

TYPOGRAPHY: -apple-system, "Inter", system-ui, sans-serif (display/headings/body). ui-monospace, "JetBrains Mono", "SF Mono", monospace (code, labels, breadcrumbs). h1 36px/700, h2 22px/700, body 14.5px/1.6, labels 10.5–12px tracking 0.08em.

PALETTE (use exactly these):
--bg #0c0e14; --paper #14171f; --paper-2 #1c2030; --ink #eaecf3; --muted #8b94ad; --accent #6ee7b7 (mint); --warn #fbbf24; --danger #f87171

ABSOLUTELY DON'T:
- No light background — must stay dark
- No serif anywhere
- No drop shadows — use background-layer separation + 1px borders
- No border-radius over 12px
- No emoji or decorative icons — text-only severity badges

ANCHOR — match this stylistic direction:
\`\`\`html
<body style="background:#0c0e14;color:#eaecf3;font-family:-apple-system,Inter,system-ui,sans-serif">
  <h2 style="display:flex;align-items:baseline;gap:14px">
    <span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#8b94ad;
                 letter-spacing:0.18em">01</span>
    <span style="font-size:22px">Acknowledge &amp; Triage</span>
  </h2>
  <div style="display:flex;align-items:flex-start;gap:14px;background:#14171f;
              border-radius:12px;padding:18px 22px;margin:14px 0">
    <div style="width:36px;height:36px;border-radius:50%;background:#6ee7b7;color:#0c0e14;
                font-weight:700;display:grid;place-items:center;flex-shrink:0">1</div>
    <div>
      <h4 style="margin:0;font-size:15px">Acknowledge the page within 5 min.</h4>
      <p style="margin:6px 0 0;color:#8b94ad;font-size:14px">
        Type <code style="background:#1c2030;padding:1px 6px;border-radius:4px;
                          font-family:'JetBrains Mono',monospace;font-size:13px">/ack</code>
        in <code style="background:#1c2030;padding:1px 6px;border-radius:4px">#incidents-auth</code>.
      </p>
    </div>
  </div>
  <pre style="background:#14171f;border-radius:8px;padding:18px;font-family:'JetBrains Mono',monospace;
              font-size:13px;overflow:auto;color:#eaecf3"><span style="color:#8b94ad"># Deploy auth-service v4.7.3</span>
$ nw deploy auth-service --tag <span style="color:#fbbf24">v4.7.3</span> --env production
<span style="color:#6ee7b7">→ traffic shifted: 10% / 50% / 100%</span></pre>
</body>
\`\`\`

REQUIREMENTS:
- All CSS inline; no external resources
- If user content lacks specific commands/values, use [REPLACE_ME] tokens — don't invent service names
- Output ONLY the HTML.`,
  },

  {
    id: "keynote-modern",
    name: "Keynote Modern",
    category: "deck",
    accent: "#c96442",
    bg: "#fafaf7",
    description: "Apple Keynote aesthetic — light/dark/brand slides stacked vertically with massive type",
    prompt: `Output a complete self-contained <!DOCTYPE html>...</html> page in the **Apple Keynote modern** style.

VIBE: Three slide variants stacked vertically — light, dark, and brand-gradient — with massive Inter Tight typography, italic Georgia accent words, JetBrains Mono slide numbers. Premium, restrained, cinematic.

LAYOUT (must include):
- Each slide: width 1280px max, aspect-ratio 16/9, border-radius 18px, box-shadow 0 30px 80px -20px rgba(0,0,0,0.7), centered, generous padding (~80px)
- Three slide variants used in mix:
  - .slide.light: background #fafaf7, color #0a0a0a
  - .slide.dark: background #15140f, color #fafaf7
  - .slide.brand: background linear-gradient(135deg, #c96442 0%, #e9b94a 100%), color white
- Slide number badge: position absolute, top 24px, right 32px, JetBrains Mono 11px tracking 0.18em, opacity 0.55 (e.g. "01 / 07")
- h1: 84px, font-weight 800. h2: 64px, font-weight 700. Mix italic Georgia for stylistic accent words within sans headlines (e.g. "HTML <em>Anything</em>")
- Optional 3-stat card row on dark slides: each card background rgba(255,255,255,0.06), border 1px solid rgba(255,255,255,0.08), border-radius 12px

TYPOGRAPHY: "Inter Tight", "Inter", -apple-system, sans-serif (primary). "JetBrains Mono" (slide numbers, CLI). Georgia italic — for accent words ONLY (not whole headings). Body 16–24px.

PALETTE:
Light: bg #fafaf7, ink #0a0a0a
Dark: bg #15140f, ink #fafaf7
Brand: gradient #c96442 → #e9b94a, ink white
Accent words on light: #c96442

ABSOLUTELY DON'T:
- No single uniform slide color — must mix the 3 variants
- No thin font weights on dark slides (min 500)
- No paragraph text over 24px
- No images — typography-driven only
- No serif body text (Georgia for accent words ONLY)

ANCHOR — match this stylistic direction:
\`\`\`html
<section style="width:1280px;max-width:95vw;aspect-ratio:16/9;
                background:linear-gradient(135deg,#c96442 0%,#e9b94a 100%);color:#fff;
                border-radius:18px;box-shadow:0 30px 80px -20px rgba(0,0,0,0.7);
                padding:80px;display:flex;flex-direction:column;justify-content:space-between;
                position:relative;font-family:'Inter Tight',Inter,system-ui,sans-serif">
  <span style="position:absolute;top:24px;right:32px;font-family:'JetBrains Mono',monospace;
               font-size:11px;letter-spacing:0.18em;opacity:0.55">01 / 07</span>
  <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.18em;
              text-transform:uppercase;opacity:0.85">Product · 2026</div>
  <h1 style="margin:auto 0;font-size:84px;font-weight:800;line-height:1.05;letter-spacing:-0.02em">
    HTML <em style="font-family:Georgia,serif;font-style:italic;font-weight:400">Anything</em>
  </h1>
  <p style="font-size:24px;opacity:0.95;max-width:780px">
    Turn any document, in any format, into a designed HTML page in 30 seconds.
  </p>
</section>
\`\`\`

REQUIREMENTS:
- All CSS inline; no external fonts (use system fallback chain)
- Output a sequence of slides that follows the user's content (one slide per major beat); 4–8 slides typical
- Output ONLY the HTML.`,
  },

  {
    id: "minimal-pitch",
    name: "Minimal Pitch",
    category: "deck",
    accent: "#3b5bff",
    bg: "#ffffff",
    description: "Classic YC fundraising deck — gradient accents, traction bars, ghost section numbers",
    prompt: `Output a complete self-contained <!DOCTYPE html>...</html> page in the **YC-style fundraising pitch deck** style.

VIBE: White background with blue→purple→pink gradient accents, large gradient-clipped text numbers, soft-blurred gradient blob on the cover, rounded cards (20px radius), giant ghost section numbers. Clean, modern, investor-friendly.

LAYOUT (must include — order matters):
- Stack slides vertically. 8–10 slides total: Cover → Problem → Solution → Product → Market → Business Model → Traction → Team → Ask → Thanks (skip ones the user content doesn't justify)
- Each slide: padding 88px 112px, border-radius 20px, white background
- Cover slide: soft gradient background + an absolute "blob" (large blurred circle filter:blur(8px), opacity 0.35, position absolute right -140px top -140px)
- Every non-cover slide gets a "ghost section number": position absolute, font-size 220px, color very-light gray (#eef0f8), bottom 40px, right 72px, z-index 0
- Traction slide: proportional gradient bars in flex row (display:flex; align-items:flex-end; gap:14px; height:240px), each .bar with background:var(--grad)
- Ask slide: ask-box with gradient background, 3-column metrics inside (round, raise, lead investor)
- "gradient-text" class on key numbers/metrics: -webkit-background-clip:text; color:transparent; background:var(--grad)

TYPOGRAPHY: "Inter", -apple-system, system-ui, sans-serif (display + body); "Noto Sans SC" for CJK; "JetBrains Mono" for data/labels; "Playfair Display" allowed only for the "big-q" pull-quote variant. h1 86px/900, h2 62px/800, mega numbers 180px/900.

PALETTE:
--bg #ffffff; --text-1 #0d1130; --text-2 #5a6076; --surface-2 #eef0f8;
--accent #3b5bff; --accent-2 #7a46ff; --accent-3 #d94cff;
--grad linear-gradient(135deg, #3b5bff 0%, #7a46ff 55%, #d94cff 100%)

ABSOLUTELY DON'T:
- No serif body text (Playfair only for one-off pull-quote variant)
- No dark background slides (cover uses soft-gradient, not dark)
- No hairline borders — use soft box-shadows for cards (e.g. 0 8px 32px -8px rgba(13,17,48,0.12))
- No flat solid accent bars — gradient is mandatory for key metrics
- No straight corners (cards: --radius:20px)

ANCHOR — match this stylistic direction:
\`\`\`html
<section style="position:relative;background:#fff;border-radius:20px;padding:88px 112px;
                box-shadow:0 8px 32px -8px rgba(13,17,48,0.12);overflow:hidden;
                font-family:Inter,-apple-system,system-ui,sans-serif;color:#0d1130">
  <span style="position:absolute;right:72px;bottom:40px;font-size:220px;
               color:#eef0f8;font-weight:900;line-height:1;z-index:0">06</span>
  <p style="font-family:'JetBrains Mono',monospace;font-size:13px;letter-spacing:0.2em;
            text-transform:uppercase;color:#5a6076">TRACTION</p>
  <h2 style="font-size:62px;font-weight:800;line-height:1.05;letter-spacing:-0.02em;
             margin:12px 0 32px">6 months, growing 38% MoM.</h2>
  <div style="display:flex;align-items:flex-end;gap:14px;height:240px;position:relative;z-index:1">
    <div style="flex:1;height:18%;background:linear-gradient(135deg,#3b5bff,#7a46ff,#d94cff);
                border-radius:8px 8px 0 0;display:flex;flex-direction:column;
                justify-content:flex-end;padding:8px;color:#fff">
      <em style="font-style:normal;font-weight:700">$6k</em><span style="font-size:11px;opacity:0.9">Oct</span>
    </div>
    <!-- repeat with 30%, 44%, 62%, 82%, 100% bars -->
  </div>
</section>
\`\`\`

REQUIREMENTS:
- All CSS inline
- Output ONLY the HTML.`,
  },

  {
    id: "vintage-magazine",
    name: "Vintage Magazine",
    category: "marketing",
    accent: "#b8553a",
    bg: "#fafaf7",
    description: "Premium long-form magazine essay — serif headings, sans body, ornament dividers",
    prompt: `Output a complete self-contained <!DOCTYPE html>...</html> page in the **Premium long-form magazine essay** style.

VIBE: A polished long read — warm off-white, two-family pairing (sans body + serif headings), accent-bordered blockquotes, ornament dividers between sections, gradient avatar circle (no images).

LAYOUT (must include):
- Single column max-width 720px, centered
- Eyebrow above headline: 11px font-weight 500 tracking 0.22em uppercase in --accent
- Hero h1: serif (Noto Serif SC / Georgia), font-size 3rem, line-height 1.08, font-weight 900, tracking-tight
- Byline row: 32px gradient avatar circle + author name (font-weight 500 in --ink) + " · " separators + date + read-time, 12px in --mute, 1px bottom border
- Body 17px / line-height 1.8, sans-serif
- Section h2 (serif, 1.875rem, font-weight 700)
- One blockquote: border-left 3px solid --accent, italic serif, 22–24px, NO background fill
- One ornament divider between sections: a flex row with hairlines (max-width 60px each side) flanking three centered serif italic dots: "·  ·  ·"
- End card: rounded border box (1px solid --line, 12px radius) with source attribution

TYPOGRAPHY: Body: "Inter", -apple-system, "Noto Sans SC", system-ui, sans-serif (17px/1.8). Headings + blockquote + dropcap accents: "Noto Serif SC", Georgia, serif. Labels/eyebrow: same sans-serif but tracking 0.22em uppercase 11px.

PALETTE (use exactly these):
--ink #1a1a1a; --paper #fafaf7; --line #e7e5e0; --mute #6b6760; --accent #b8553a (terracotta)

ABSOLUTELY DON'T:
- No multi-column layout — strictly single
- No hero image or illustration placeholder
- No h3/h4 — only h2 for section breaks (long-form rhythm)
- No pull-quote box with background fill — left-border only
- No dark mode

ANCHOR — match this stylistic direction:
\`\`\`html
<article style="max-width:720px;margin:0 auto;padding:80px 24px 96px;
                font-family:Inter,-apple-system,'Noto Sans SC',sans-serif;
                background:#fafaf7;color:#1a1a1a;font-size:17px;line-height:1.8">
  <p style="font-size:11px;font-weight:500;letter-spacing:0.22em;text-transform:uppercase;
            color:#b8553a;margin:0 0 16px">CULTURE · ESSAY</p>
  <h1 style="font-family:'Noto Serif SC',Georgia,serif;font-size:3rem;line-height:1.08;
             font-weight:900;letter-spacing:-0.02em;margin:0 0 20px">
    After I read <a href="#" style="font-style:italic;font-weight:700;color:#b8553a">@trq212</a>'s tweet,<br>
    I replaced every markdown file with HTML.
  </h1>
  <div style="display:flex;align-items:center;gap:12px;font-size:12px;color:#6b6760;
              border-bottom:1px solid #e7e5e0;padding-bottom:48px;margin-bottom:48px">
    <span style="width:32px;height:32px;border-radius:50%;
                 background:linear-gradient(135deg,#c96442,#e9b94a)"></span>
    <span style="font-weight:500;color:#1a1a1a">Tom Pan</span>
    <span>·</span><span>May 11</span><span>·</span><span>4 min read</span>
  </div>
  <div style="display:flex;align-items:center;justify-content:center;gap:14px;margin:48px 0">
    <span style="flex:1;max-width:60px;height:1px;background:#e7e5e0"></span>
    <span style="font-family:'Noto Serif SC',Georgia,serif;font-style:italic;color:#6b6760">·  ·  ·</span>
    <span style="flex:1;max-width:60px;height:1px;background:#e7e5e0"></span>
  </div>
</article>
\`\`\`

REQUIREMENTS:
- All CSS inline
- Output ONLY the HTML.`,
  },

  {
    id: "product-landing",
    name: "Product Landing",
    category: "marketing",
    accent: "#c96442",
    bg: "#fafaf9",
    description: "Modern SaaS one-pager — nav / hero / features / pricing / CTA / footer",
    prompt: `Output a complete self-contained <!DOCTYPE html>...</html> page in the **Modern SaaS landing page** style.

VIBE: Clean modern SaaS one-pager — off-white system-UI, single terracotta accent, standard nav/hero/features/pricing/CTA structure. No glassmorphism, no Google Fonts.

LAYOUT (must include — fixed section order):
1. Nav: brand on left + 3–5 links + primary button on right; sticky top, 1px bottom border
2. Hero: clamp(44px, 6vw, 76px) headline tracking -0.02em + sub-paragraph + 2 buttons (primary filled --accent + secondary outlined)
3. Logo wall: muted row of 5–7 fake-logo text blocks (font-weight 600, opacity 0.5)
4. Features: 3-column grid; each feature uses mono numbering (01, 02, 03) as eyebrow — NOT icons — then h3 + paragraph
5. Pricing: 3 tiers; the middle/featured tier has border-color --accent + an absolute "Recommended" pill (top -12px, left 24px, padding 3px 10px, border-radius 999px, --accent bg, white text)
6. Closing CTA band: full-bleed background --accent + white text + button
7. Footer: small grid of links, muted

Buttons: border-radius 8px (NOT pill, NOT square). Featured tier highlighted with accent border.

Responsive: Features and pricing collapse to single column at 800px (use a media query).

TYPOGRAPHY: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif throughout. Logo 17px/600. Hero h1 clamp(44px, 6vw, 76px) tracking -0.02em. Feature numbers ui-monospace 12px uppercase tracking 0.08em. Body 16px/1.55.

PALETTE:
--bg #fafaf9; --fg #1c1b1a; --muted #6b6964; --border #e6e4e0; --accent #c96442; --surface #ffffff

ABSOLUTELY DON'T:
- No glassmorphism, no backdrop-filter blur
- No Google Fonts / @import / external font loading
- No rounded pill buttons — 8px radius only
- No dark sections except the closing CTA band
- No hero image or illustration

ANCHOR — match this stylistic direction:
\`\`\`html
<section style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;
                padding:80px 24px;max-width:1100px;margin:0 auto;
                font-family:-apple-system,system-ui,sans-serif;color:#1c1b1a">
  <div style="border:1px solid #e6e4e0;border-radius:12px;padding:32px;background:#fff">
    <h3>Solo</h3><div style="font-size:40px;font-weight:700">$0<small style="font-size:14px;color:#6b6964">/mo</small></div>
    <p style="color:#6b6964">Personal use, forever free.</p>
    <ul style="font-size:14px;line-height:1.8"><li>1 GB storage</li><li>Email support</li></ul>
    <button style="width:100%;border:1px solid #e6e4e0;background:#fff;border-radius:8px;
                   padding:10px 16px;cursor:pointer">Start free</button>
  </div>
  <div style="position:relative;border:1px solid #c96442;border-radius:12px;padding:32px;background:#fff">
    <span style="position:absolute;top:-12px;left:24px;background:#c96442;color:#fff;
                 padding:3px 10px;border-radius:999px;font-size:11px">Recommended</span>
    <h3>Team</h3><div style="font-size:40px;font-weight:700">$14<small style="font-size:14px;color:#6b6964">/seat/mo</small></div>
    <p style="color:#6b6964">For teams up to 50.</p>
    <ul style="font-size:14px;line-height:1.8">
      <li>5 TB pooled storage</li><li>Shared folders &amp; roles</li><li>Priority support</li>
    </ul>
    <button style="width:100%;background:#c96442;color:#fff;border:none;border-radius:8px;
                   padding:10px 16px;cursor:pointer;font-weight:600">Choose Team</button>
  </div>
  <div style="border:1px solid #e6e4e0;border-radius:12px;padding:32px;background:#fff">
    <h3>Enterprise</h3><div style="font-size:40px;font-weight:700">Talk</div>
    <p style="color:#6b6964">SSO, audit log, SLA.</p>
    <button style="width:100%;border:1px solid #e6e4e0;background:#fff;border-radius:8px;
                   padding:10px 16px;cursor:pointer">Contact sales</button>
  </div>
</section>
\`\`\`

REQUIREMENTS:
- All CSS inline; no external resources
- Adapt copy to user's product description; if pricing not given, use plausible 3-tier scaffold (Free / Team / Enterprise)
- Output ONLY the HTML.`,
  },

  {
    id: "handwritten-notes",
    name: "Meeting Notes",
    category: "doc",
    accent: "#2c5fae",
    bg: "#fafaf8",
    description: "Polished internal meeting doc — Charter headings, avatar initials, action-item table",
    prompt: `Output a complete self-contained <!DOCTYPE html>...</html> page in the **Polished internal meeting notes** style.

VIBE: A clean, professional meeting document — white card on light gray page, Charter/Georgia serif headings, overlapping avatar initials, agenda checkboxes, decision call-out box, action items table with status pills.

LAYOUT (must include):
- Outer page background #fafaf8
- Card wrapper: max-width 920px, background white, 1px border #e8e9ed, border-radius 12px, padding 48px 56px
- Breadcrumb: monospace 11px uppercase muted (e.g. "ENGINEERING / 2FA · WEEKLY")
- Title: Charter / Georgia 32px (serif headings throughout)
- Attendees row: small label + overlapping avatar initials (28px circles, gradient backgrounds, 2px white border, margin-left -8px to overlap)
- Agenda items: flex rows with custom checkbox div (18×18, 4px radius); done state: green background #2c8a4f + white check
- Decisions block: background #e8efff (soft blue), border-left 3px solid #2c5fae, border-radius 6px, padding 16px 20px
- Action items table: 4 columns (owner / item / due / status), status pills border-radius 999px (todo gray, in-progress blue-tinted, blocked red-tinted, done green-tinted)
- Footer: 1px top border, mono 11.5px muted, justify-content space-between

TYPOGRAPHY: Display: Charter, Georgia, "Iowan Old Style", serif (h1, h2, h3). Body: -apple-system, "Inter", system-ui, sans-serif (14.5px / 1.6). Labels/breadcrumbs/pills: ui-monospace, "JetBrains Mono", monospace (11px).

PALETTE:
--bg #fafaf8; --paper #ffffff; --ink #1a1d24; --muted #5d6371; --line #e8e9ed; --accent #2c5fae; --accent-soft #e8efff; --positive #2c8a4f; --warn-soft #fef2cc; --danger-soft #fde2e2

ABSOLUTELY DON'T:
- No dark mode
- No icons — avatars use INITIALS only
- No card radius over 12px
- No gradient or colored header band
- No alert/warning colors except inside pill status indicators

ANCHOR — match this stylistic direction:
\`\`\`html
<div style="max-width:920px;margin:32px auto;background:#fff;border:1px solid #e8e9ed;
            border-radius:12px;padding:48px 56px;
            font-family:-apple-system,Inter,system-ui,sans-serif;color:#1a1d24">
  <p style="font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;
            letter-spacing:0.12em;color:#5d6371;margin:0">ENGINEERING / 2FA · WEEKLY</p>
  <h1 style="font-family:Charter,Georgia,serif;font-size:32px;margin:8px 0 24px">
    M2 milestone weekly · Nov 12</h1>
  <div style="display:flex;align-items:center;gap:14px;font-size:13px;color:#5d6371">
    <span style="font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;font-size:11px">Present</span>
    <div style="display:flex">
      <span style="width:28px;height:28px;border-radius:50%;border:2px solid #fff;
                   background:linear-gradient(135deg,#2c5fae,#6e9bf0);color:#fff;
                   font-size:11px;font-weight:700;display:grid;place-items:center">DP</span>
      <span style="width:28px;height:28px;border-radius:50%;border:2px solid #fff;margin-left:-8px;
                   background:linear-gradient(135deg,#c96442,#e9b94a);color:#fff;
                   font-size:11px;font-weight:700;display:grid;place-items:center">MR</span>
      <span style="width:28px;height:28px;border-radius:50%;border:2px solid #fff;margin-left:-8px;
                   background:linear-gradient(135deg,#2c8a4f,#7ed3a4);color:#fff;
                   font-size:11px;font-weight:700;display:grid;place-items:center">PB</span>
    </div>
  </div>
  <div style="background:#e8efff;border-left:3px solid #2c5fae;border-radius:6px;
              padding:16px 20px;margin-top:32px">
    <h3 style="font-family:Charter,Georgia,serif;margin:0 0 6px;font-size:16px">
      What we agreed to, on the record</h3>
    <ul style="margin:0;padding-left:20px;font-size:14.5px;line-height:1.6">
      <li><strong>M2 (2FA challenge step)</strong> stays at Nov 18, no slip.</li>
    </ul>
  </div>
</div>
\`\`\`

REQUIREMENTS:
- All CSS inline
- If user gave no specific names/dates, use placeholder initials and [DATE]
- Output ONLY the HTML.`,
  },

  {
    id: "card-summary",
    name: "Twitter / X Card",
    category: "marketing",
    accent: "#1d9bf0",
    bg: "#050507",
    description: "Pixel-accurate X/Twitter post card — black card on radial-gradient bg, blue verified mark",
    prompt: `Output a complete self-contained <!DOCTYPE html>...</html> page in the **Pixel-accurate X / Twitter post card** style.

VIBE: A faithful X (Twitter) dark-mode post card replica — pure black card sitting on a deep radial-gradient page background, X chrome (gradient avatar circle, blue verified checkmark, 3-dot menu, inline SVG engagement icons).

LAYOUT (must include):
- Page body: background radial-gradient(circle at 50% 30%, #1a1f2e 0%, #050507 70%); min-height 100vh; centered flex
- Card: width 640px max, background #000, 1px border #2f3336, border-radius 16px, padding 20px
- Header row: 48×48 gradient circle avatar (CSS gradient — NO image URLs) + on right: display name in font-weight 700 + inline SVG verified checkmark in #1d9bf0 + handle (color #71767b, 14px) + " · " + timestamp
- Three-dot menu icon at top-right of header
- Post text: 17px, leading-snug; hashtags and links in #1d9bf0
- Engagement row: 4 SVG icon-+-count buttons (reply, retweet, like, view), color #71767b
- "Like" count: render in pink #f91880 if user content includes a "liked" framing; otherwise muted
- Below card: optional small caption

Render all icons as inline SVG (reply bubble, retweet arrows, heart, view bar). Do not use emoji. Do not use external image URLs.

TYPOGRAPHY: "Inter", -apple-system, "Noto Sans SC", system-ui, sans-serif throughout. Display name: 15px font-weight 700. Handle/timestamp: 14px color #71767b. Post text: 17px line-height 1.35. Engagement counts: 13px (NOT mono — same family as body).

PALETTE (exactly):
Body bg: radial-gradient(circle at 50% 30%, #1a1f2e, #050507)
Card bg #000; card border #2f3336; primary text #e7e9ea; secondary text #71767b
Accent links/verified: #1d9bf0
Like-active: #f91880
Retweet-active: #00ba7c

ABSOLUTELY DON'T:
- No light-mode variant — dark only
- No placeholder image gray block (image is optional; omit it)
- No external image URLs anywhere
- No card shadow — uses only the 1px border #2f3336
- No emoji as the verified mark — must be inline SVG

ANCHOR — match this stylistic direction (use these icon paths):
\`\`\`html
<body style="margin:0;min-height:100vh;display:grid;place-items:center;
             background:radial-gradient(circle at 50% 30%,#1a1f2e 0%,#050507 70%);
             font-family:Inter,-apple-system,system-ui,sans-serif;color:#e7e9ea">
<article style="width:640px;max-width:95vw;background:#000;border:1px solid #2f3336;
                border-radius:16px;padding:20px">
  <header style="display:flex;align-items:flex-start;gap:12px">
    <div style="width:48px;height:48px;border-radius:50%;flex-shrink:0;
                background:linear-gradient(135deg,#ff7e5f 0%,#feb47b 100%)"></div>
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap">
        <span style="font-weight:700;font-size:15px">AlchainHust</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#1d9bf0">
          <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
        </svg>
        <span style="color:#71767b;font-size:14px">@AlchainHust</span>
        <span style="color:#71767b">·</span><span style="color:#71767b;font-size:14px">14h</span>
      </div>
      <p style="margin:8px 0 0;font-size:17px;line-height:1.35">
        Claude Code team stopped writing markdown docs.
        <span style="color:#1d9bf0">Everything is HTML now.</span>
      </p>
    </div>
  </header>
  <footer style="display:flex;justify-content:space-between;margin-top:14px;color:#71767b;font-size:13px">
    <span>💬 312</span><span>🔁 1.2K</span><span style="color:#f91880">♥ 4,829</span><span>📊 218K</span>
  </footer>
</article>
</body>
\`\`\`

REQUIREMENTS:
- All CSS inline
- Replace the emoji in engagement row with proper inline SVG icons (reply, retweet, heart, chart) — DO NOT actually use emoji in production output, the anchor uses them only as a placeholder hint
- Output ONLY the HTML.`,
  },

  {
    id: "cyberpunk-neon",
    name: "Cyberpunk Terminal",
    category: "special",
    accent: "#7ed3a4",
    bg: "#0a0c10",
    description: "Dark CRT terminal deck — mint phosphor headlines, scanlines, macOS chrome, $ prompts",
    prompt: `Output a complete self-contained <!DOCTYPE html>...</html> page in the **Cyberpunk CRT terminal** style.

VIBE: A dark terminal aesthetic for an agent/CLI/AI demo — black background, CRT grid + scanline overlays, mint green phosphor glow on the headline, macOS window chrome on top, "$" prompt as title prefix, blinking cursor.

LAYOUT (must include):
- Body background --hc-bg #0a0c10 always
- Three absolute overlay layers covering the page (z-index 0):
  - Grid: 56×56px mint dotted grid via background:linear-gradient (rgba(126,211,164,0.05) 1px, transparent 1px) on both axes; mask-image radial fade from center
  - Vignette: radial-gradient dark at edges, transparent at center
  - Scanlines: repeating-linear-gradient(transparent 0, transparent 2px, rgba(126,211,164,0.04) 2px, rgba(126,211,164,0.04) 4px); mix-blend-mode screen
- macOS window chrome row at top: 3 colored dots — red #ff5f57, yellow #febc2e, green #7ed3a4 — followed by zsh path label (mono 11px)
- All "$ " command lines: ::before { content:"$ "; color:#64dfdf } (cyan); the prompt text after is mint #7ed3a4
- Headline h1: JetBrains Mono 72px, color #7ed3a4, text-shadow: 0 0 30px rgba(126,211,164,0.35), with blinking cursor span at end (animation: hcBlink 1s steps(2) infinite, alternating opacity)
- Charts (if any): stroke-only SVG; fill rgba(126,211,164,0.15), stroke #7ed3a4, stroke-width 1.5
- Three tag color variants: green default, .amber #e9c58a, .red #ff6b6b
- Fixed footer: position absolute bottom 32px, mono 10px uppercase, border-top 1px solid rgba(126,211,164,0.1)

TYPOGRAPHY: Headlines, prompts, cards, tags: "JetBrains Mono", "SF Mono", monospace. Lede / description body: "Inter", -apple-system, system-ui, sans-serif (18px). Display 72–120px mono; lede 18px sans; labels 10–11px mono uppercase.

PALETTE (exactly these — no others):
--hc-bg #0a0c10; --hc-green #7ed3a4 (mint, primary accent); --hc-cyan #64dfdf (prompt $); --hc-amber #e9c58a; --hc-rose #d4a0b9; --hc-red #ff6b6b; --hc-ink #e4e2d8; --hc-ink2 #8a8892

ABSOLUTELY DON'T:
- No light backgrounds anywhere
- No sans-serif headings (monospace only for display)
- No solid filled chart bars — stroke-only
- No border-radius > 10px on any element
- No gradient on text (uses pure mint with text-shadow glow)
- No emoji (the @ and dots are the only "icons")

ANCHOR — match this stylistic direction:
\`\`\`html
<body style="margin:0;min-height:100vh;background:#0a0c10;color:#e4e2d8;
             font-family:'JetBrains Mono',monospace;position:relative;overflow:hidden">
  <!-- overlay layers -->
  <div style="position:fixed;inset:0;pointer-events:none;z-index:0;
              background-image:linear-gradient(rgba(126,211,164,0.05) 1px,transparent 1px),
                               linear-gradient(90deg,rgba(126,211,164,0.05) 1px,transparent 1px);
              background-size:56px 56px;
              mask-image:radial-gradient(ellipse at center,black 30%,transparent 80%)"></div>
  <div style="position:fixed;inset:0;pointer-events:none;z-index:1;
              background:repeating-linear-gradient(transparent 0,transparent 2px,
                rgba(126,211,164,0.04) 2px,rgba(126,211,164,0.04) 4px);
              mix-blend-mode:screen"></div>

  <main style="position:relative;z-index:2;padding:48px">
    <div style="display:flex;align-items:center;gap:8px;color:#8a8892;font-size:11px;
                text-transform:uppercase;letter-spacing:0.12em">
      <span style="width:12px;height:12px;border-radius:50%;background:#ff5f57"></span>
      <span style="width:12px;height:12px;border-radius:50%;background:#febc2e"></span>
      <span style="width:12px;height:12px;border-radius:50%;background:#7ed3a4"></span>
      <span style="margin-left:14px">~/hermes · zsh · 118x42 · 01:37:04</span>
    </div>
    <p style="margin-top:48px;color:#7ed3a4">
      <span style="color:#64dfdf">$ </span>whoami --hermes</p>
    <h1 style="font-size:72px;color:#7ed3a4;text-shadow:0 0 30px rgba(126,211,164,0.35);
               margin:12px 0 0;line-height:0.95">
      HERMES<br>AGENT / v0.9.2<span style="display:inline-block;width:12px;height:0.85em;
        background:#7ed3a4;margin-left:6px;animation:hcBlink 1s steps(2) infinite"></span>
    </h1>
  </main>
  <style>@keyframes hcBlink { 50% { opacity:0 } }</style>
</body>
\`\`\`

REQUIREMENTS:
- All CSS inline (style block fine for keyframes)
- Output ONLY the HTML.`,
  },

  {
    id: "brutalist",
    name: "Brutalist",
    category: "marketing",
    accent: "#E61919",
    bg: "#F4F4F0",
    description: "Swiss industrial brutalism — Archivo Black, viewport-scale numbers, hazard red accent",
    prompt: `Output a complete self-contained <!DOCTYPE html>...</html> page in the **Swiss industrial brutalist print** style.

VIBE: Newsprint paper canvas, Archivo Black grotesque on everything, viewport-bleeding giant numbers, hazard red as the only accent, every text uppercase, every divider 1px or 4px ink.

LAYOUT (must include):
- Top register strip: grid-template-columns repeat(5, 1fr), mono uppercase 11px tracking 0.12em, 1px border-top + border-bottom in --ink (e.g. "FIELD UNIT 04 | SUMMER MMXXVI | EDITION 0.04 | ATELIER NORD-OUEST | 4 / 12")
- Nav: brand in Archivo Black 22px tracking -0.04em uppercase + nav links each in 1px solid --ink boxes (rectangular, never rounded)
- HERO: a viewport-scale number (e.g. "04") at clamp(220px, 36vw, 540px), line-height 0.78, letter-spacing -0.07em, with a tiny ::after "®" in --hazard
- Section headlines: Archivo Black uppercase + a single red period at the end (e.g. "Instrument for the legible web<span style='color:#E61919'>.</span>")
- Thesis list: 3-column grid 6ch 1fr 14ch with 1px ink top borders separating each row (no padding cells)
- Optional alert block: repeating-linear-gradient(135deg, ...) hazard-stripe background — NOT a solid color
- Bracket frames: ASCII brackets via ::before/::after with content '[' and ']' in --hazard

TYPOGRAPHY: Display: "Archivo Black", "Helvetica Black", system-ui, sans-serif (uppercase, weights locked). Body: "Archivo", "Helvetica", sans-serif (400–700). Meta: "JetBrains Mono", monospace (numbers, labels). Body 15px/1.5; display up to clamp(220px, 36vw, 540px).

PALETTE (exactly):
--paper #F4F4F0; --paper-2 #EAE8E3; --ink #060606; --ink-soft #1A1A18; --hazard #E61919

ABSOLUTELY DON'T:
- No colors other than ink and hazard red
- No rounded corners — hard 0
- No shadows
- No lowercase display text — everything uppercase
- No warm cream — uses cooler off-white #F4F4F0
- No emoji or icons — text and 1px rules only

ANCHOR — match this stylistic direction:
\`\`\`html
<body style="margin:0;background:#F4F4F0;color:#060606;font-family:Archivo,Helvetica,sans-serif">
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:0;
              border-top:1px solid #060606;border-bottom:1px solid #060606;
              font-family:'JetBrains Mono',monospace;font-size:11px;
              text-transform:uppercase;letter-spacing:0.12em;padding:12px 24px">
    <span>FIELD UNIT 04</span><span>SUMMER MMXXVI</span><span>EDITION 0.04</span>
    <span>ATELIER NORD-OUEST</span><span style="text-align:right">4 / 12</span>
  </div>
  <section style="display:grid;grid-template-columns:1fr 1fr;gap:0;
                  border-bottom:1px solid #060606">
    <div>
      <span style="font-family:'Archivo Black';font-size:clamp(220px,36vw,540px);
                   line-height:0.78;letter-spacing:-0.07em;display:block;padding:24px 0 0 22px">04</span>
      <span style="font-size:0.18em;color:#E61919;vertical-align:super;
                   font-family:'Archivo Black';margin-left:-22px">®</span>
    </div>
    <div style="padding:48px 32px;border-left:1px solid #060606">
      <span style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.12em">
        <span style="color:#E61919">[</span> PRINTED MATTER · FOR THE WEB <span style="color:#E61919">]</span>
      </span>
      <h2 style="font-family:'Archivo Black';font-size:56px;line-height:0.95;text-transform:uppercase;
                 letter-spacing:-0.03em;margin-top:14px">
        INSTRUMENT FOR<br>THE LEGIBLE&nbsp;WEB<span style="color:#E61919">.</span>
      </h2>
      <p style="margin-top:32px;font-size:15px;line-height:1.5">
        Field Unit 04 is a quarterly instrument for typographic systems on the open web…
      </p>
      <div style="display:grid;grid-template-columns:6ch 1fr;border-top:1px solid #060606;
                  padding:10px 0;margin-top:32px;font-family:'JetBrains Mono',monospace;
                  font-size:11px;text-transform:uppercase">
        <b>EDITOR</b><span>Q. ALBRECHT</span>
      </div>
    </div>
  </section>
</body>
\`\`\`

REQUIREMENTS:
- All CSS inline
- Output ONLY the HTML.`,
  },

];

if (typeof module !== "undefined") module.exports = STYLES;
