# Wisdom Portfolio — CLAUDE.md

Complete documentation for the portfolio codebase. Read this before making any changes.

---

## File Structure

```
portfolio/
├── CLAUDE.md
├── index.html              ← home page
├── about.html / reviews.html / faq.html / contact.html / 404.html / privacy.html
├── projects.html           ← case study grid with filter (rendered from projects-data.js)
├── case-study-<slug>.html  ← one static case study page per project (generated)
├── case-study.html         ← redirects old ?p=<slug> links (noindex)
├── scripts/                ← build-static.js + make-og-images.py (run locally, output committed)
├── claude-code.html, n8n.html, make.html, zapier.html,
│   ai-website.html, openclaw.html, gohighlevel.html   ← service pages
├── vercel.json            ← Vercel hosting: cache + security headers
├── site.webmanifest, sitemap.xml, robots.txt, favicon.ico + PNG icons
├── assets/
│   ├── images/             ← profile.jpg, og-card.jpg (share image), posters/, projects/ (screenshots), avatars/
│   ├── projects/           ← interactive demo builds shown in iframes
│   └── videos/             ← client demos (full, 720p) + *-preview.mp4 12s loops for cards
├── css/style.css           ← all styles (single file)
└── js/
    ├── nav.js              ← injects nav + footer; contact constants
    ├── main.js             ← all interactive behaviour + rendering
    ├── preloader.js        ← intro screen (first page of a visit only)
    ├── analytics.js        ← Vercel Web Analytics + Speed Insights + click/form events (live site only)
    ├── projects-data.js    ← case studies (single source of truth)
    └── reviews-data.js     ← reviews
```

No build tools. Open `index.html` directly or serve with any static host.

---

## Design Tokens

All tokens live in `:root` in `css/style.css`. Never hardcode colour or font values inline.

Light editorial theme inspired by thirdway.com, with a bright sun-yellow accent and an "AI developer" layer (JetBrains Mono labels, dot-grid heroes, the agent-log terminal in the home hero).

| Token | Value | Use |
|---|---|---|
| `--bg` | `#F7F1E9` | Warm cream page background |
| `--card` | `#EEE8DF` | Flat cards and alternate section backgrounds |
| `--surface` | `#FFFDF9` | Raised white surfaces (forms, pills, cards on `--card`) |
| `--border` | `#DDD6CB` | Hairlines and dividers |
| `--text` | `#20221A` | Primary text, headings, primary buttons |
| `--text-soft` | `#3A3D30` | Primary button hover |
| `--muted` | `#66675F` | Secondary text, labels |
| `--accent` | `#8E7000` | Deep gold accent — use sparingly |
| `--accent-dim` | `#FFE7A6` | Butter panels (CTA banner, lead magnet) |
| `--sun` | `#FDD02E` | Bright hero yellow (matches the profile photo); highlights, client badges, metric cards |
| `--brand-*` | WhatsApp/LinkedIn/Upwork/Calendly/Gmail | Authentic brand colours for contact logos (`.brand-whatsapp` etc.) |
| `--terminal*`, `--grid-dot` | dark / dim | Agent-log terminal and hero dot grid |
| `--green` / `--green-dim` | `#2F7A4B` / `#DEEFE3` | Outcome chips, Upwork badge |
| `--tint-*` | various | Emoji thumbnail backgrounds (`thumb-claude`, `thumb-n8n`, …) |
| `--font-heading` / `--font-body` | Inter Tight | Headings (weight 500, tight tracking) and body |
| `--font-serif` | Instrument Serif (italic) | Small editorial labels and `<em>` accents |
| `--font-code` | JetBrains Mono | Section labels, tags, badges, terminal |
| `--radius` | `8px` | Small cards, inputs |
| `--radius-lg` | `14px` | Cards |
| `--radius-xl` | `20px` | CTA banner, form wrap, footer panel |
| `--nav-height` | `72px` | Reserved for fixed nav |

---

## Messaging

Lead with the problem and the outcome; tools are supporting detail. Headings talk about what the client gets ("Stop losing leads after the first click"), with platforms listed underneath ("Tools: GoHighLevel · n8n").

---

## Coding Rules

1. **No frameworks, no npm.** Pure HTML, CSS, vanilla JS only. The only tooling is the two scripts in `scripts/`, run locally; their output is committed, so hosting needs no build step.
2. **Single CSS file.** All styles in `css/style.css`. Never add `<style>` tags to HTML.
3. **Use CSS variables.** Never hardcode hex values. Always use `var(--token)`.
4. **Use semantic HTML.** `<main>`, `<section>`, `<nav>`, `<footer>`, `<h1>`–`h4>`, etc.
5. **Mobile-first.** Write base styles for mobile, override for larger screens in media queries.
6. **Motion is small and complementary.** All keyframes and transitions live inside `@media (prefers-reduced-motion: no-preference)` in the MOTION block of `style.css`. No scroll-reveal scripts, preloaders or cursor effects.
7. **Nav and footer are injected** by `js/nav.js` — never add them to HTML files directly.
8. **Each HTML page** must include:
   - Correct `<title>` and `<meta name="description">`
   - `<link rel="stylesheet" href="css/style.css" />`
   - `<script src="js/nav.js" defer></script>`
   - `<script src="js/main.js" defer></script>`
   - A single `<main>` element as the content wrapper

---

## Social Links

Update these in `js/nav.js` inside the `SOCIALS` array:

Contact constants at the top of `nav.js`: `EMAIL` (wvemofficial@gmail.com), `CALENDLY` (https://calendly.com/wvemofficial/30min), `LINKEDIN`, `UPWORK`, `WHATSAPP`. Each `SOCIALS` entry has a `key` that maps to its brand colour class (`brand-linkedin`, `brand-upwork`, `brand-whatsapp`).

When CSS/JS change, bump the `?v=N` query on the `<link>`/`<script>` tags in every page so browsers fetch the new files.

Update once in `nav.js` and they propagate everywhere automatically.

---

## Adding a New Project (case study)

Projects are data-driven. Add an object to `window.PROJECTS` in `js/projects-data.js`; the home page, `projects.html` and every service page render from it.

```js
{
  title: "Project name",
  kind: "client",            // "client" = delivered client work, "build" = demo build (shown as a badge)
  cat: "ai-automation",      // ai-automation | lead-generation | ai-development | web-development (projects filter)
  catLabel: "Workflow Automation",
  problem: "The business problem, in one or two sentences.",
  desc: "What was built, one sentence.",
  result: "Headline outcome shown on the card",
  // thumbnail — use ONE of:
  video: "assets/videos/x.mp4", poster: "assets/images/posters/x.jpg",
  metric: { before: "3 days", after: "2 hours", label: "to onboard a client" },
  previewClass: "tp-01", projectFile: "assets/projects/…html",
  stack: ["n8n", "Xero"],
  services: ["n8n"],         // service pages that list it: claude-code, n8n, make, zapier, ai-website, openclaw, gohighlevel
  slug: "project-name",      // URL: case-study.html?p=project-name (also add it to sitemap.xml)
  flow: ["Trigger", "Tool", "Step", "Step"],   // optional workflow-diagram thumbnail (2nd node highlighted)
  caseStudy: {
    clientBrief: "What the client came with",
    plan: ["The plan I drafted, as bullets"],
    whatWasBuilt: "Optional overview paragraph",
    steps: [{ title, detail }],               // the process, step by step
    bottleneck: { title, detail },
    fix: "How I fixed it",
    results: ["…"],
    feedback: "James T."                      // must match a name in reviews-data.js — only when that review is about this project
  }
}
```

Only add real work. Keep the portfolio curated: strong case studies, no generic filler.

**After editing `projects-data.js` or `reviews-data.js`, regenerate the static HTML** (this is what search engines read):

```bash
python scripts/make-og-images.py   # share image per case study (needs Pillow)
node scripts/build-static.js       # case-study-<slug>.html pages, static lists, sitemap
```

Markup for cards, reviews and case studies lives only in `js/render.js` (used by both the browser and the generator). Lists marked `data-static` are pre-rendered; the browser only fills a list that is still empty.

---

## Background Platform Animations

Add `data-bg="<type>"` to a section (or `.page-hero`) to place a mini animated app window behind it, drawn in the platform's real colours so visitors recognise the tool:

| Type | Looks like | Used on |
|---|---|---|
| `n8n` | n8n editor running an AI Agent workflow | Home "What I help with", n8n.html |
| `claude` | Claude Code terminal session | Home "My process", claude-code.html |
| `make` | Make.com scenario with modules + "Run once" | Home "Selected work", make.html |
| `ghl` | GoHighLevel Opportunities pipeline | Home "Client results", gohighlevel.html |
| `zapier` | Zapier Zap editor (the CompanyCam ↔ PaintScout Zap) | Home "By the numbers", zapier.html |
| `chat` | Website AI chat widget booking a call | Home "Let's connect", ai-website.html |
| `scrape` | OpenClaw scraping a directory into a lead sheet | openclaw.html |

Built in `main.js` (`BG` object), colours from the `--pf-*` tokens in `style.css`. The script splits the section header (or `.page-hero` container) into two columns — text left, the live app window right (stacked on phones) — so windows are fully visible, never cropped. Opacity: `--bg-anim-opacity` (0.95). They animate only while on screen and freeze for reduced-motion users.

---

## Adding a New Review

Reviews render from `window.REVIEWS` in `js/reviews-data.js` (`name`, `country`, `countryName`, `photo`, `text`). Cards show name and country only — no platform tag. Only add a platform/source label if it is where the review genuinely came from.

---

## Adding a New FAQ

In `faq.html`, copy a `.faq-item` block into either the left or right column div:

```html
<div class="faq-item">
  <button class="faq-question">
    Your question here?
    <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  </button>
  <div class="faq-answer">
    <div class="faq-answer-inner">
      <p>Your answer here.</p>
    </div>
  </div>
</div>
```

The accordion JS in `main.js` picks up any `.faq-question` button automatically.

---

## Formspree Setup

The contact form in `contact.html` uses Formspree.

1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form — copy the form ID (looks like `xpzgkqrb`)
3. In `contact.html`, update the form action:

```html
<form id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

The form ID is already set to `mqevdzyr`. Formspree handles spam protection, email delivery, and stores submissions. The JS success state fires on a 200 response — no page redirect needed.

---

## Navigation

The nav is defined entirely in `js/nav.js`. To add a new page to the nav:

```js
const PAGES = [
  { href: 'index.html',    label: 'Home' },
  { href: 'about.html',   label: 'About' },
  // add new pages here
];
```

Service/tool pages live in the `SERVICES` array and appear in the dropdown:

```js
const SERVICES = [
  { href: 'claude-code.html', label: 'Custom AI Tools', icon: '🤖' },
  // add new service pages here
];
```

---

## Adding a New Service Page

1. Create `new-service.html` using an existing service page as a template
2. Add it to the `SERVICES` array in `nav.js`
3. Link to it from relevant project cards in `projects.html`
4. Structure:
   - Page hero (`page-hero`)
   - What is it (`tool-what` two-column)
   - Process (`tool-process` section, three `.process-step` cards)
   - Projects: `<div class="projects-grid" data-service="<key>"></div>` (rendered from `projects-data.js`), plus `<script src="js/projects-data.js" defer>` in the head
   - CTA banner

---

## Running Locally

```bash
# Option 1 — open directly (some browsers block local scripts)
start index.html

# Option 2 — Python server (recommended)
python -m http.server 3000
# then open http://localhost:3000

# Option 3 — VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

---

## Deployment (Vercel)

Hosted on Vercel from the GitHub repo (`main` branch, root `/`, no build step). Live URL: `https://wisdom-vincent.vercel.app` — it's used in every canonical/og tag, `sitemap.xml` and `robots.txt`, so update all of them if the domain changes.

- `vercel.json` caches `/css` and `/js` for a year (immutable) — **always bump the `?v=N` query** on every page's `<link>`/`<script>` tags when CSS/JS changes, or visitors keep old files.
- Analytics: enable **Web Analytics** and **Speed Insights** in the Vercel project. `js/analytics.js` loads them on the live site only and sends events for Book-call/WhatsApp/Email/Upwork/LinkedIn/Credly clicks, case-study opens and form submits (custom events need Vercel Pro; page views are free). Cookieless, covered in `privacy.html`.

- Google Search Console is verified with `googlef98bd7c75eb94ea2.html` in the site root — **never delete or rename it**, or ownership is lost.

## Plans (no public prices)

The home page `#plans` section shows three engagement types (Quick automation, Growth system, Ongoing partner) with timelines and what's included, but **no prices** — each card links to `contact.html?plan=<key>#contact-form`, where `main.js` fills the hidden `plan` field, retitles the form and sets the Formspree subject ("Tailored plan request: …"). The promise is a written plan and cost breakdown within 48 hours. Budget on the contact form is optional. Don't reintroduce prices in the page or structured data without the owner's say-so.
