/* build-static.js — writes search-engine-readable HTML from the data files.
   Run after changing js/projects-data.js or js/reviews-data.js:

     node scripts/build-static.js

   It (1) writes one case-study-<slug>.html page per project, with its own
   title, description, canonical URL, share image and structured data,
   (2) fills the project/review lists in index, projects, reviews and the
   service pages, and (3) refreshes the case study entries in sitemap.xml.
   Markup comes from js/render.js, the same code the browser uses. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://wisdom-vincent.vercel.app';
const TODAY = new Date().toISOString().slice(0, 10);
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(ROOT, f), s);

const ctx = { window: {} };
ctx.window.window = ctx.window;
vm.createContext(ctx);
['js/projects-data.js', 'js/reviews-data.js', 'js/render.js'].forEach(f => vm.runInContext(read(f).replace(/^﻿/, ''), ctx));
const PROJECTS = ctx.window.PROJECTS, REVIEWS = ctx.window.REVIEWS, WV = ctx.window.WVRender;

const esc = s => String(s).replace(/&(?![a-z#0-9]+;)/gi, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const plain = s => String(s).replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/gi, m => ({ '&amp;': '&', '&mdash;': '—', '&rarr;': '→', '&middot;': '·', '&hellip;': '…', '&ndash;': '–' }[m] || ' ')).replace(/\s+/g, ' ').trim();
function clip(s, n) {
  s = plain(s);
  if (s.length <= n) return s;
  return s.slice(0, s.lastIndexOf(' ', n - 1)).replace(/[,;:—–-]$/, '') + '…';
}

/* Replace the inner HTML of the first element whose opening tag matches `open` (a regex). */
function fillElement(html, open, inner) {
  const m = open.exec(html);
  if (!m) return html;
  let tag = m[0];
  if (!/data-static/.test(tag)) tag = tag.replace(/>$/, ' data-static>');
  const name = tag.match(/^<(\w+)/)[1];
  const re = new RegExp('<(/?)' + name + '\\b[^>]*>', 'g');
  re.lastIndex = m.index + m[0].length;
  let depth = 1, e;
  while ((e = re.exec(html))) { depth += e[1] ? -1 : 1; if (depth === 0) break; }
  if (!e) throw new Error('unbalanced ' + open);
  return html.slice(0, m.index) + tag + inner + html.slice(e.index);
}

/* ── 1. Case study pages ─────────────────────────────────── */
const template = read('projects.html');
const head = template.slice(0, template.indexOf('<main'));
const personBlock = head.match(/<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@graph"[\s\S]*?<\/script>/)[0];
const ogFor = p => fs.existsSync(path.join(ROOT, 'assets/images/og', p.slug + '.jpg')) ? 'assets/images/og/' + p.slug + '.jpg' : 'assets/images/og-card.jpg';

const pages = [];
PROJECTS.forEach(p => {
  const file = WV.caseUrl(p);
  const url = SITE + '/' + file;
  const title = clip(p.title + ' — Case Study', 48) + ' | Wisdom';
  const desc = clip((p.problem || '') + ' ' + (p.result ? 'Result: ' + p.result + '.' : ''), 155);
  const img = SITE + '/' + ogFor(p);
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: plain(p.title),
        description: desc,
        image: img,
        url: url,
        dateModified: TODAY,
        author: { '@id': SITE + '/#wisdom' },
        publisher: { '@id': SITE + '/#wisdom' },
        about: plain(p.catLabel),
        keywords: (p.stack || []).join(', '),
        isPartOf: { '@id': SITE + '/#website' }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
          { '@type': 'ListItem', position: 2, name: 'Case Studies', item: SITE + '/projects.html' },
          { '@type': 'ListItem', position: 3, name: plain(p.title), item: url }
        ]
      }
    ]
  };
  let h = head
    .replace(/<title>[^<]*<\/title>/, '<title>' + esc(title) + '</title>')
    .replace(/(<meta name="description" content=")[^"]*/, '$1' + esc(desc))
    .replace(/(<link rel="canonical" href=")[^"]*/, '$1' + url)
    .replace(/(<meta property="og:type" content=")[^"]*/, '$1article')
    .replace(/(<meta property="og:url" content=")[^"]*/, '$1' + url)
    .replace(/(<meta property="og:title" content=")[^"]*/, '$1' + esc(title))
    .replace(/(<meta property="og:description" content=")[^"]*/, '$1' + esc(desc))
    .replace(/(<meta property="og:image" content=")[^"]*/, '$1' + img)
    .replace(/(<meta property="og:image:alt" content=")[^"]*/, '$1' + esc(plain(p.title)))
    .replace(/(<meta name="twitter:title" content=")[^"]*/, '$1' + esc(title))
    .replace(/(<meta name="twitter:description" content=")[^"]*/, '$1' + esc(desc))
    .replace(/(<meta name="twitter:image" content=")[^"]*/, '$1' + img)
    .replace(/\s*<script src="js\/projects-data\.js[^"]*" defer><\/script>/, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*<\/head>/, personBlock + '\n  <script type="application/ld+json">\n' + JSON.stringify(ld, null, 2) + '\n  </script>\n</head>');
  write(file, h + '<body>\n<a class="skip-link" href="#main">Skip to content</a>\n\n<main id="main">\n' +
    WV.caseStudy(p, PROJECTS, REVIEWS) + '\n</main>\n\n</body>\n</html>\n');
  pages.push(file);
});
console.log('case study pages:', pages.length);

/* ── 2. Static lists in existing pages ───────────────────── */
const cards = (list, opts) => list.map(p => WV.projectCard(p, opts)).join('\n');
const byService = key => PROJECTS.filter(p => (p.services || []).indexOf(key) !== -1);
const fills = {
  'index.html': [
    [/<div class="feat-videos-grid" id="homeFeatured"[^>]*>/, cards(PROJECTS.filter(p => p.video), { autoplay: true })],
    [/<div class="home-projects-grid" id="homeProjectsGrid"[^>]*>/, cards(PROJECTS.filter(p => p.kind === 'build').slice(0, 6))],
    [/<div class="home-reviews-grid" id="homeReviewsGrid"[^>]*>/, REVIEWS.slice(0, 10).map(WV.reviewCard).join('\n')]
  ],
  'projects.html': [[/<div id="projectsGrid"[^>]*>/, cards(PROJECTS)]],
  'reviews.html': [[/<div id="reviewsGrid"[^>]*>/, REVIEWS.map(WV.reviewCard).join('\n')]]
};
['claude-code', 'n8n', 'make', 'zapier', 'ai-website', 'openclaw', 'gohighlevel'].forEach(k => {
  fills[k + '.html'] = [[new RegExp('<div class="projects-grid" data-service="' + k + '"[^>]*>'), cards(byService(k))]];
});
Object.keys(fills).forEach(f => {
  let html = read(f);
  fills[f].forEach(([re, inner]) => { html = fillElement(html, re, '\n' + inner + '\n'); });
  write(f, html);
});
console.log('static lists filled:', Object.keys(fills).length, 'pages');

/* ── 3. Sitemap ──────────────────────────────────────────── */
let sm = read('sitemap.xml').replace(/\s*<url>\s*<loc>[^<]*case-study[^<]*<\/loc>[\s\S]*?<\/url>/g, '');
sm = sm.replace('\n</urlset>', pages.map(f =>
  '\n  <url>\n    <loc>' + SITE + '/' + f + '</loc>\n    <lastmod>' + TODAY + '</lastmod>\n    <priority>0.7</priority>\n  </url>').join('') + '\n</urlset>');
write('sitemap.xml', sm);
console.log('sitemap updated');
