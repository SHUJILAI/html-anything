// Sample INTENTS (loose user requests) — the optimizer turns these into structure.
// Toggle Raw mode if you want to paste already-formatted Markdown instead.
window.SAMPLES = {
  product: `Launch post for "Pebble" — a 90-second prototype tool that turns ideas into clickable demos for indie founders.

Audience: solo founders and small product teams who already use AI coding assistants but get stuck on design.
Key angle: AI agents already write code, why not let them write the design too — one prompt to a finished page.
What's new in 0.4: 15 hand-crafted style packs, side-by-side compare, one-click share URLs.
We have a customer testimonial from "Ana K., founder" — leave the wording for me to fill in.
Tone: confident, technical-friendly, not breathless marketing. Include a CTA at the end.`,

  doc: `Reference doc for our REST API authentication.

We use bearer tokens over HTTPS. Tokens are issued from the dashboard at happycapy.ai/dashboard/keys.
Three scopes: read, write, admin. Free tier 60 req/min, Pro 600 req/min, Enterprise custom.
Failed auth returns HTTP 401 with a JSON error object containing code, message, and request_id.
Tokens rotate every 90 days with 14-day advance email warning; you can mint a successor token without downtime.
Format: technical reference, lots of code blocks (curl + JSON), tables for scopes and rate limits.`,

  pitch: `Seed pitch for "Cabin" — autonomous engineering agent that finishes and ships your half-built side project.

Problem: 80% of indie hackers abandon projects before launch; today's agents write code but don't deploy, monitor, or iterate.
Solution: pick up your repo → finish the gaps → deploy → watch metrics → fix its own breakages.
Traction (last 90 days): 4,200 weekly active devs, $42K MRR growing 28% MoM, 92% of deploys still live after 30 days.
Market: 27M devs with side projects, growing 14% YoY (Stack Overflow 2025).
Why now: frontier models hit ship-quality bar early 2025; sandboxed agent infra (E2B, Modal, Daytona) is production-ready.
Ask: $4M seed, 18-month runway, target $200K MRR by end of 2026.`,

  essay: `Long-form opinion piece, working title "The death of the empty page".

Thesis: the empty page in word processors was never neutral — it was a hostile prompt that rewarded writers who already knew their thesis. The new generation of writing tools start with scaffolding (a question, a structure, a draft), and the writer's job becomes editing rather than invention. This is not laziness; it's honesty about what writing actually is.

Tone: confident, slightly contrarian, literary. No bullet points unless the structure demands. Should feel like an essay you'd find in a thoughtful tech magazine.
Cover: 1) what the empty page actually does to writers, 2) the shift to scaffolded tools, 3) what we lose (romance), 4) what we gain (the writers who never started — busy, dyslexic, second-language, etc.). End with a memorable single-line declaration.`,

  changelog: `Changelog for Happycapy v2.4.0, releasing today (2026-05-19).

Added:
- HTML-Anything tool: any content → 15 hand-crafted styled HTML pages
- Side-by-side compare mode (up to 3 styles)
- Persistent share URLs for generated pages
- New /v1/tools/html-anything API endpoint

Changed:
- Default model upgraded to Sonnet 4.6 for tool calls
- Doubled max output tokens for HTML generation (8K → 16K)

Fixed:
- Race condition when streaming + uploading attachments
- Korean character glitch in PDF export

Also include the previous release v2.3.0 (2026-05-02) which added cross-conversation memory (opt-in), Mac Bridge, and email-as-task; renamed Skills → Tools; trimmed onboarding from 6 to 3 steps.

Format: classic Keep-a-Changelog style, newest version first, sub-sections per version.`,
};
