/* main.js — interactive behaviours (no decorative animation) */
document.addEventListener('DOMContentLoaded', function () {

  /* ── Hamburger ────────────────────────────────────────────── */
  var hamburger = document.getElementById('hamburger');
  var overlay   = document.getElementById('navOverlay');
  if (hamburger && overlay) {
    hamburger.addEventListener('click', function() {
      var open = document.body.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', String(open));
    });
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        document.body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
    overlay.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        document.body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Lazy-load demo videos ───────────────────────────────── */
  /* Videos total ~39MB; loading them upfront stalls first paint. */
  var _vidObs;
  function initLazyVideos() {
    if (!_vidObs) {
      _vidObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          var v = entry.target;
          if (entry.isIntersecting) {
            if (!v.src && v.dataset.src) v.src = v.dataset.src;
            var play = v.play();
            if (play && play.catch) play.catch(function() {});
          } else if (v.src) {
            v.pause();
          }
        });
      }, { rootMargin: '250px 0px' });
    }
    document.querySelectorAll('video[data-src]:not([data-lz])').forEach(function(v) {
      v.dataset.lz = '1';
      _vidObs.observe(v);
    });
  }
  initLazyVideos();

  /* ── FAQ Accordion ────────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item   = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(el) { el.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Project Filter (re-callable) ────────────────────────── */
  function initFilters() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.dataset.filter;
        document.querySelectorAll('.project-card').forEach(function(card) {
          card.classList.toggle('hidden', cat !== 'all' && card.dataset.category !== cat);
        });
      });
    });
  }

  /* ── Project + review lists ───────────────────────────────
     Markup comes from js/render.js. scripts/build-static.js writes
     it straight into the HTML (for search engines); these only fill
     a list that is still empty, e.g. if the generator wasn't re-run. */
  var WV = window.WVRender;
  function fill(el, html) {
    if (!el || !WV || el.hasAttribute('data-static')) return;
    el.innerHTML = html;
  }
  function cards(list, opts) {
    return list.map(function(p) { return WV.projectCard(p, opts); }).join('');
  }
  if (window.PROJECTS) {
    fill(document.getElementById('projectsGrid'), cards(window.PROJECTS));
    fill(document.getElementById('homeFeatured'), cards(window.PROJECTS.filter(function(p) { return p.video; }), { autoplay: true }));
    fill(document.getElementById('homeProjectsGrid'), cards(window.PROJECTS.filter(function(p) { return p.kind === 'build'; }).slice(0, 6)));
    document.querySelectorAll('[data-service]').forEach(function(el) {
      var key = el.dataset.service;
      fill(el, cards(window.PROJECTS.filter(function(p) { return (p.services || []).indexOf(key) !== -1; })));
    });
  }
  if (window.REVIEWS) {
    fill(document.getElementById('reviewsGrid'), window.REVIEWS.map(WV.reviewCard).join(''));
    fill(document.getElementById('homeReviewsGrid'), window.REVIEWS.slice(0, 10).map(WV.reviewCard).join(''));
  }
  initFilters();
  initLazyVideos();

  /* Old dynamic case study links (case-study.html?p=<slug>) → static pages */
  if (document.getElementById('caseStudy') && window.PROJECTS && WV) {
    var slug = new URLSearchParams(location.search).get('p');
    var match = window.PROJECTS.filter(function(p) { return p.slug === slug; })[0];
    location.replace(match ? WV.caseUrl(match) : 'projects.html');
  }

  /* ── Contact Form ─────────────────────────────────────────── */
  function initForm(formId, successId) {
    var form    = document.getElementById(formId);
    var success = document.getElementById(successId);
    if (!form || !success) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var submitBtn = form.querySelector('[type="submit"]');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function(res) {
          if (res.ok) { form.style.display = 'none'; success.classList.add('show'); }
          else throw new Error('err');
        })
        .catch(function() {
          submitBtn.textContent = 'Try Again';
          submitBtn.disabled = false;
          alert('Something went wrong. Please email wvemofficial@gmail.com directly.');
        });
    });
  }
  initForm('contactForm', 'formSuccess');

  /* Arriving from a "Get my tailored plan" card: note the plan and adapt the form */
  var planKey = new URLSearchParams(location.search).get('plan');
  var PLAN_NAMES = { 'quick-automation': 'Quick automation', 'growth-system': 'Growth system', 'ongoing-partner': 'Ongoing partner' };
  var planField = document.getElementById('planField');
  if (planField && PLAN_NAMES[planKey]) {
    planField.value = PLAN_NAMES[planKey];
    var wrap = document.getElementById('contact-form');
    var h = wrap && wrap.querySelector('h3');
    var p = h && h.nextElementSibling;
    if (h) h.textContent = 'Get your tailored plan: ' + PLAN_NAMES[planKey];
    if (p) p.textContent = 'Tell me what you want to fix. You\u2019ll get a written plan and cost breakdown within 2 hours \u2014 no obligation.';
    var wa = document.getElementById('planWhatsApp');
    if (wa) {
      wa.href = 'https://wa.me/2349136538627?text=' + encodeURIComponent('Hi Wisdom, I\u2019d like a tailored plan for: ' + PLAN_NAMES[planKey]);
      wa.hidden = false;
    }
    var subject = document.querySelector('#contactForm input[name="_subject"]');
    if (subject) subject.value = 'Tailored plan request: ' + PLAN_NAMES[planKey];
  }
  initForm('leadMagnetForm', 'leadMagnetSuccess');

  /* ── Background platform animations ────────────────────────
     Mini "live" app windows that look like the real tools
     (n8n, Claude Code, Make, GoHighLevel, Zapier, an AI chat
     widget and OpenClaw scraping). Colours come from the
     --pf-* tokens in style.css. Added to any element with
     data-bg="<type>"; animate only while on screen and stay
     frozen for prefers-reduced-motion users. */
  var cssVars = getComputedStyle(document.documentElement);
  function C(name) { return cssVars.getPropertyValue('--pf-' + name).trim(); }

  function R(x, y, w, h, rx, fill, stroke, sw, extra) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 0) + '" fill="' + (fill || 'none') + '"' +
      (stroke ? ' stroke="' + stroke + '" stroke-width="' + (sw || 1.5) + '"' : '') + (extra || '') + '/>';
  }
  /* Rect with an animation child */
  function RA(x, y, w, h, rx, fill, stroke, sw, child) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + rx + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + sw + '">' + child + '</rect>';
  }
  function T(x, y, txt, size, fill, extra) {
    return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + fill + '"' + (extra || '') + '>' + txt + '</text>';
  }
  /* Element hidden until fraction t of the loop, visible until `end`. */
  function show(t, dur, end) {
    end = end || 0.94;
    return '<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;' + t + ';' + (t + 0.02).toFixed(3) + ';' + end + ';1" dur="' + dur + 's" repeatCount="indefinite"/>';
  }
  /* Attribute switches from a to b at fraction t, back at the loop end. */
  function flip(attr, a, b, t, dur) {
    return '<animate attributeName="' + attr + '" values="' + a + ';' + a + ';' + b + ';' + b + ';' + a + '" keyTimes="0;' + t + ';' + (t + 0.02).toFixed(3) + ';0.94;1" dur="' + dur + 's" repeatCount="indefinite"/>';
  }
  /* A dot that travels a path between fractions t1 and t2 of the loop. */
  function travel(path, t1, t2, dur, fill, r) {
    return '<circle r="' + (r || 4) + '" fill="' + fill + '" opacity="0">' +
      '<animateMotion dur="' + dur + 's" repeatCount="indefinite" path="' + path + '" keyPoints="0;0;1;1" keyTimes="0;' + t1 + ';' + t2 + ';1" calcMode="linear"/>' +
      '<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;' + t1 + ';' + (t1 + 0.01).toFixed(3) + ';' + t2 + ';' + (t2 + 0.01).toFixed(3) + ';1" dur="' + dur + 's" repeatCount="indefinite"/></circle>';
  }
  function check(cx, cy, t, dur, color) {
    return '<g opacity="0">' + show(t, dur) +
      '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="' + color + '"/>' +
      '<path d="M' + (cx - 4) + ',' + cy + ' l3,3 l5,-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>';
  }
  function frame(id, bg, inner) {
    return '<svg viewBox="0 0 480 320" class="pf-svg">' +
      '<defs><clipPath id="clip-' + id + '"><rect width="480" height="320" rx="14"/></clipPath></defs>' +
      '<g clip-path="url(#clip-' + id + ')">' + R(0, 0, 480, 320, 0, bg) + inner + '</g>' +
      R(0.75, 0.75, 478.5, 318.5, 14, 'none', C('frame'), 1.5) + '</svg>';
  }
  function titleBar(fill, line) {
    return R(0, 0, 480, 40, 0, fill) + '<line x1="0" y1="40" x2="480" y2="40" stroke="' + line + '"/>';
  }

  var BG = {
    /* n8n — workflow editor executing an AI Agent flow */
    n8n: function() {
      var D = 6, ok = C('n8n-ok'), edge = C('n8n-edge'), txt = C('ink'), s = '';
      s += '<defs><pattern id="n8n-dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="' + C('n8n-dot') + '"/></pattern></defs>';
      s += R(0, 40, 480, 280, 0, 'url(#n8n-dots)');
      s += titleBar('#fff', edge);
      s += T(18, 27, 'n8n', 17, C('n8n'), ' font-weight="800"') + T(62, 25, 'Lead follow-up', 11, C('ink-soft'));
      s += R(300, 13, 26, 14, 7, ok) + '<circle cx="319" cy="20" r="5" fill="#fff"/>' + T(332, 24, 'Active', 10, C('ink-soft'));
      s += R(384, 10, 84, 20, 5, C('n8n-exec')) + T(394, 24, '&#9654; Execute', 10, '#fff', ' font-weight="600"');
      var c1 = 'M94,162 L140,162', c2 = 'M264,148 C297,148 297,112 330,112', c3 = 'M264,176 C297,176 297,212 330,212';
      [[c1, 0.16], [c2, 0.5], [c3, 0.5]].forEach(function(c) {
        s += '<path d="' + c[0] + '" fill="none" stroke="' + edge + '" stroke-width="2">' + flip('stroke', edge, ok, c[1] + 0.08, D) + '</path>';
        s += travel(c[0], c[1], c[1] + 0.08, D, ok);
      });
      s += '<g opacity="0">' + show(0.26, D) + T(100, 154, '1 item', 8, ok) + '</g>';
      s += '<g opacity="0">' + show(0.6, D) + T(282, 124, '1 item', 8, ok) + T(282, 206, '1 item', 8, ok) + '</g>';
      /* trigger node (rounded left edge, like n8n triggers) */
      s += '<path d="M62,130 H84 Q94,130 94,140 V184 Q94,194 84,194 H62 A32,32 0 0 1 62,130 Z" fill="#fff" stroke="' + edge + '" stroke-width="2">' + flip('stroke', edge, ok, 0.1, D) + '</path>';
      s += '<polygon points="66,146 55,165 63,165 59,180 72,158 64,158 69,146" fill="' + C('n8n') + '"/>';
      s += T(62, 214, 'On form submit', 9, C('ink-soft'), ' text-anchor="middle"') + check(88, 134, 0.12, D, ok);
      /* AI Agent node with sub-node ports */
      s += RA(140, 120, 124, 84, 10, '#fff', edge, 2, flip('stroke', edge, ok, 0.44, D));
      s += R(154, 146, 24, 20, 5, C('ink')) + '<circle cx="161" cy="155" r="2.5" fill="#fff"/><circle cx="171" cy="155" r="2.5" fill="#fff"/>';
      s += T(186, 160, 'AI Agent', 12, C('ink'), ' font-weight="700"');
      s += '<circle cx="246" cy="134" r="6" fill="none" stroke="' + C('n8n') + '" stroke-width="2" stroke-dasharray="9 30" opacity="0">' + show(0.24, D, 0.44) +
        '<animateTransform attributeName="transform" type="rotate" from="0 246 134" to="360 246 134" dur="0.8s" repeatCount="indefinite"/></circle>';
      s += check(258, 124, 0.46, D, ok);
      [[172, 'Chat Model', C('ink')], [232, 'Memory', C('n8n-memory')]].forEach(function(n) {
        s += '<polygon points="' + n[0] + ',198 ' + (n[0] + 6) + ',204 ' + n[0] + ',210 ' + (n[0] - 6) + ',204" fill="' + edge + '"/>';
        s += '<line x1="' + n[0] + '" y1="210" x2="' + n[0] + '" y2="242" stroke="' + edge + '" stroke-width="2" stroke-dasharray="4 4"/>';
        s += '<circle cx="' + n[0] + '" cy="262" r="20" fill="#fff" stroke="' + edge + '" stroke-width="2"/>';
        s += '<circle cx="' + n[0] + '" cy="262" r="9" fill="' + n[2] + '"/>';
        s += T(n[0], 296, n[1], 9, C('ink-soft'), ' text-anchor="middle"');
      });
      /* Gmail + Sheets output nodes */
      s += RA(330, 80, 64, 64, 10, '#fff', edge, 2, flip('stroke', edge, ok, 0.62, D));
      s += R(346, 100, 32, 24, 3, '#fff', C('app-gmail'), 2.5) + '<polyline points="346,102 362,114 378,102" fill="none" stroke="' + C('app-gmail') + '" stroke-width="2.5"/>';
      s += T(362, 162, 'Send email', 9, C('ink-soft'), ' text-anchor="middle"') + check(388, 84, 0.64, D, ok);
      s += RA(330, 180, 64, 64, 10, '#fff', edge, 2, flip('stroke', edge, ok, 0.62, D));
      s += R(350, 194, 24, 34, 3, C('app-sheets')) + '<line x1="354" y1="206" x2="370" y2="206" stroke="#fff" stroke-width="2"/><line x1="354" y1="214" x2="370" y2="214" stroke="#fff" stroke-width="2"/>';
      s += T(362, 262, 'Log lead', 9, C('ink-soft'), ' text-anchor="middle"') + check(388, 184, 0.66, D, ok);
      return frame('n8n', C('n8n-canvas'), s);
    },

    /* Claude Code — terminal session */
    claude: function() {
      var D = 10, txt = C('claude-text'), dim = C('claude-dim'), or = C('claude'), s = '';
      s += R(0, 0, 480, 32, 0, C('claude-bar'));
      s += '<circle cx="18" cy="16" r="5" fill="' + C('mac-red') + '"/><circle cx="34" cy="16" r="5" fill="' + C('mac-yellow') + '"/><circle cx="50" cy="16" r="5" fill="' + C('mac-green') + '"/>';
      s += T(240, 20, 'claude &#8212; ~/lead-system', 10, dim, ' text-anchor="middle" class="pf-mono"');
      s += R(20, 44, 310, 46, 8, 'none', or, 1.5);
      s += T(34, 65, '&#10043;', 14, or) + T(52, 65, 'Welcome to Claude Code!', 12, txt, ' font-weight="700" class="pf-mono"');
      s += T(34, 81, '/help for help, /status for your current setup', 8.5, dim, ' class="pf-mono"');
      /* typed prompt */
      s += '<defs><clipPath id="claude-type"><rect x="24" y="100" height="22" width="0"><animate attributeName="width" values="0;0;430;430;0" keyTimes="0;0.02;0.14;0.94;1" dur="' + D + 's" repeatCount="indefinite"/></rect></clipPath></defs>';
      s += '<g clip-path="url(#claude-type)">' + T(24, 116, '&gt; build a lead qualifier that books calls', 11, txt, ' class="pf-mono"') + '</g>';
      var line = function(y, t, parts, end) {
        return '<g opacity="0">' + show(t, D, end) + parts + '</g>';
      };
      s += line(140, 0.2, T(24, 140, '&#9679;', 11, C('claude-ok')) + T(38, 140, 'Read(src/leads.ts)', 11, txt, ' class="pf-mono"'));
      s += line(156, 0.24, T(38, 156, '&#9151;  Read 84 lines', 10, dim, ' class="pf-mono"'));
      s += line(178, 0.34, T(24, 178, '&#9679;', 11, C('claude-ok')) + T(38, 178, 'Update(src/qualify.ts)', 11, txt, ' class="pf-mono"'));
      s += line(196, 0.4, R(36, 186, 340, 15, 2, C('claude-del-bg')) + T(42, 197, '- score = manualScore(lead)', 10, C('claude-del'), ' class="pf-mono"'));
      s += line(213, 0.44, R(36, 203, 340, 15, 2, C('claude-add-bg')) + T(42, 214, '+ score = await claude.qualify(lead)', 10, C('claude-add'), ' class="pf-mono"'));
      s += line(240, 0.52, '<text x="24" y="240" font-size="12" fill="' + or + '">&#10043;<animateTransform attributeName="transform" type="rotate" from="0 29 236" to="360 29 236" dur="1.2s" repeatCount="indefinite"/></text>' +
        T(40, 240, 'Thinking&#8230;', 11, or, ' class="pf-mono"'), 0.7);
      s += line(240, 0.72, T(24, 240, '&#9679;', 11, C('claude-ok')) + T(38, 240, 'Done &#8212; 12/12 tests passing', 11, C('claude-ok'), ' class="pf-mono"'));
      s += R(20, 270, 440, 32, 6, 'none', dim, 1);
      s += T(32, 291, '&gt;', 11, dim, ' class="pf-mono"');
      s += '<rect x="46" y="280" width="8" height="15" fill="' + txt + '"><animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite"/></rect>';
      return frame('claude', C('claude-bg'), s);
    },

    /* Make.com — scenario editor */
    make: function() {
      var D = 5, s = '', line = C('make-line');
      s += '<defs><linearGradient id="make-grad" x1="0" x2="1"><stop offset="0" stop-color="' + C('make') + '"/><stop offset="1" stop-color="' + C('make-2') + '"/></linearGradient></defs>';
      s += titleBar('#fff', C('frame'));
      s += T(18, 28, 'make', 19, 'url(#make-grad)', ' font-weight="800"') + T(76, 25, 'New lead &#8594; CRM', 11, C('ink-soft'));
      s += R(412, 12, 52, 18, 9, C('make')) + T(428, 25, 'ON', 10, '#fff', ' font-weight="700"');
      var A = [80, 160], B = [200, 160], G = [340, 95], S = [340, 225];
      var ab = 'M' + A[0] + ',' + A[1] + ' L' + B[0] + ',' + B[1];
      var bg = 'M' + B[0] + ',' + B[1] + ' C270,160 270,95 ' + G[0] + ',' + G[1];
      var bs = 'M' + B[0] + ',' + B[1] + ' C270,160 270,225 ' + S[0] + ',' + S[1];
      [ab, bg, bs].forEach(function(p) {
        s += '<path d="' + p + '" fill="none" stroke="' + line + '" stroke-width="4" stroke-linecap="round" stroke-dasharray="0.1 9"/>';
      });
      s += travel(ab, 0.12, 0.3, D, C('make'), 6) + travel(bg, 0.38, 0.58, D, C('make'), 6) + travel(bs, 0.38, 0.58, D, C('make'), 6);
      var mod = function(p, color, icon, label, sub, t) {
        return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="38" fill="none" stroke="' + C('make') + '" stroke-width="3" opacity="0">' + show(t - 0.06, D, t + 0.06) + '</circle>' +
          '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="31" fill="' + color + '"/>' + icon +
          T(p[0], p[1] + 50, label, 10, C('ink'), ' text-anchor="middle" font-weight="700"') +
          T(p[0], p[1] + 63, sub, 8.5, C('ink-soft'), ' text-anchor="middle"') +
          '<g opacity="0">' + show(t, D) + '<circle cx="' + (p[0] + 24) + '" cy="' + (p[1] - 24) + '" r="10" fill="#fff" stroke="' + C('make') + '" stroke-width="2"/>' +
          T(p[0] + 24, p[1] - 20, '1', 10, C('make'), ' text-anchor="middle" font-weight="700"') + '</g>';
      };
      s += mod(A, C('make-2'), '<path d="M70,168 a10,10 0 1 1 10,-18 M80,150 l-6,14 h14" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>', 'Webhooks', 'Custom webhook', 0.12);
      s += mod(B, C('make-router'), '<path d="M188,160 h10 M198,160 l12,-10 M198,160 l12,10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>', 'Router', '2 routes', 0.34);
      s += mod(G, C('app-gmail'), R(326, 85, 28, 20, 3, '#fff') + '<polyline points="326,87 340,97 354,87" fill="none" stroke="' + C('app-gmail') + '" stroke-width="2.5"/>', 'Gmail', 'Send an email', 0.6);
      s += mod(S, C('app-sheets'), R(330, 211, 20, 28, 3, '#fff') + '<line x1="333" y1="222" x2="347" y2="222" stroke="' + C('app-sheets') + '" stroke-width="2"/><line x1="333" y1="229" x2="347" y2="229" stroke="' + C('app-sheets') + '" stroke-width="2"/>', 'Google Sheets', 'Add a row', 0.6);
      s += '<g>' + R(20, 272, 104, 32, 16, 'url(#make-grad)') + '<polygon points="36,281 36,295 47,288" fill="#fff"/>' + T(54, 293, 'Run once', 11, '#fff', ' font-weight="700"') +
        '<animate attributeName="opacity" values="1;0.75;1" dur="2.5s" repeatCount="indefinite"/></g>';
      return frame('make', C('make-canvas'), s);
    },

    /* GoHighLevel — Opportunities pipeline */
    ghl: function() {
      var D = 9, s = '', blue = C('ghl');
      s += R(0, 0, 56, 320, 0, C('ghl-nav'));
      s += '<polygon points="14,34 20,22 26,34" fill="' + C('ghl-yellow') + '"/><polygon points="22,34 28,18 34,34" fill="' + blue + '"/><polygon points="30,34 36,24 42,34" fill="' + C('ghl-green') + '"/>';
      [60, 92, 124, 156, 188].forEach(function(y) { s += R(18, y, 20, 20, 5, y === 124 ? blue : C('ghl-nav-icon')); });
      s += T(70, 28, 'Opportunities', 14, C('ghl-ink'), ' font-weight="700"');
      s += R(186, 13, 104, 22, 6, '#fff', C('ghl-line'), 1) + T(196, 28, 'Sales Pipeline &#9662;', 9.5, C('ghl-ink'));
      s += R(360, 12, 108, 24, 6, blue) + T(372, 28, '+ Add opportunity', 9.5, '#fff', ' font-weight="600"');
      var stages = [['New Lead', blue, '3 · $7,200'], ['Contacted', C('ghl-yellow'), '2 · $5,300'], ['Qualified', C('ghl-purple'), '2 · $8,100'], ['Booked', C('ghl-green'), '2 · $6,400']];
      stages.forEach(function(st, i) {
        var x = 64 + i * 103;
        s += R(x, 48, 97, 264, 8, C('ghl-col')) + R(x, 48, 97, 3, 0, st[1]);
        s += T(x + 8, 67, st[0], 10, C('ghl-ink'), ' font-weight="700"') + T(x + 8, 80, st[2], 8, C('ghl-muted'));
      });
      var card = function(x, y, name, val, extra) {
        return '<g' + (extra || '') + '>' + R(x, y, 85, 46, 6, '#fff', C('ghl-line'), 1) +
          T(x + 8, y + 16, name, 9, C('ghl-ink'), ' font-weight="700"') + T(x + 8, y + 30, val, 9, C('ghl-green'), ' font-weight="700"') +
          R(x + 8, y + 35, 30, 7, 3.5, C('ghl-tag')) + '</g>';
      };
      s += card(70, 90, 'Sarah K.', '$1,800') + card(70, 142, 'Mike D.', '$3,200');
      s += card(173, 90, 'Lena P.', '$2,100') + card(276, 90, 'Omar A.', '$4,500') + card(379, 90, 'Grace N.', '$2,900');
      /* the lead that moves through the pipeline */
      s += '<g opacity="0">' + card(70, 194, 'Tom B. &#183; new', '$2,600') +
        R(70, 194, 85, 46, 6, 'none', blue, 2) +
        '<animateTransform attributeName="transform" type="translate" values="0,0;0,0;103,-52;103,-52;206,-52;206,-52;309,-52;309,-52" keyTimes="0;0.18;0.26;0.42;0.5;0.66;0.74;1" dur="' + D + 's" repeatCount="indefinite"/>' +
        '<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.05;0.94;1" dur="' + D + 's" repeatCount="indefinite"/></g>';
      var toast = function(t, end, txt) {
        return '<g opacity="0">' + show(t, D, end) + R(300, 270, 168, 30, 7, C('ghl-ink')) + T(312, 289, txt, 9.5, '#fff') + '</g>';
      };
      s += toast(0.1, 0.26, '&#128172; SMS sent to Tom &#183; 0:05') + toast(0.76, 0.94, '&#128197; Call booked &#8212; Tue 2pm');
      return frame('ghl', '#fff', s);
    },

    /* Zapier — Zap editor (the CompanyCam ↔ PaintScout Zap) */
    zapier: function() {
      var D = 6, s = '', or = C('zapier'), edge = C('zapier-line');
      s += titleBar('#fff', edge);
      s += R(18, 24, 10, 4, 0, or) + T(30, 27, 'zapier', 16, C('ink'), ' font-weight="800"');
      s += T(98, 25, 'Sync new estimates', 11, C('ink-soft'));
      s += R(400, 11, 66, 20, 4, or) + T(412, 25, 'Publish', 10, '#fff', ' font-weight="700"');
      s += '<line x1="240" y1="92" x2="240" y2="254" stroke="' + edge + '" stroke-width="2"/>';
      s += travel('M240,92 L240,254', 0.08, 0.8, D, or, 4);
      var steps = [
        ['app-leadconnector', '1. Pipeline Stage Changed', 'LeadConnector'],
        ['zapier', '2. Only continue if&#8230;', 'Filter by Zapier'],
        ['app-companycam', '3. Add Project', 'CompanyCam'],
        ['app-paintscout', '4. Create Contact', 'PaintScout'],
        ['zapier', '5. Send Outbound Email', 'Email by Zapier']
      ];
      steps.forEach(function(st, i) {
        var y = 54 + i * 50, t = 0.08 + i * 0.16;
        s += RA(110, y, 260, 38, 6, '#fff', edge, 1.5, flip('stroke', edge, or, t, D));
        s += R(120, y + 9, 20, 20, 4, C(st[0]));
        s += T(148, y + 17, st[1], 10, C('ink'), ' font-weight="700"') + T(148, y + 30, st[2], 8.5, C('ink-soft'));
        s += check(354, y + 19, t + 0.06, D, C('zapier-ok'));
        if (i < 4) s += '<circle cx="240" cy="' + (y + 44) + '" r="6" fill="#fff" stroke="' + edge + '"/>' + T(240, y + 47.5, '+', 9, C('ink-soft'), ' text-anchor="middle"');
      });
      return frame('zapier', C('zapier-canvas'), s);
    },

    /* AI website chat widget booking a call */
    chat: function() {
      var D = 10, s = '', ink = C('ink');
      s += R(0, 0, 480, 30, 0, C('chat-bar'));
      s += '<circle cx="16" cy="15" r="4.5" fill="' + C('mac-red') + '"/><circle cx="30" cy="15" r="4.5" fill="' + C('mac-yellow') + '"/><circle cx="44" cy="15" r="4.5" fill="' + C('mac-green') + '"/>';
      s += R(120, 7, 240, 16, 8, '#fff') + T(240, 19, 'yourbusiness.com', 9, C('ink-soft'), ' text-anchor="middle"');
      s += R(20, 54, 150, 16, 4, C('chat-skel')) + R(20, 78, 180, 10, 4, C('chat-skel')) + R(20, 94, 160, 10, 4, C('chat-skel')) + R(20, 118, 80, 22, 11, C('sun'));
      s += R(20, 160, 190, 120, 8, C('chat-skel'));
      s += R(232, 42, 232, 266, 12, '#fff', C('chat-line'), 1.5);
      s += '<path d="M232,54 a12,12 0 0 1 12,-12 h208 a12,12 0 0 1 12,12 v34 h-232 z" fill="' + ink + '"/>';
      s += '<circle cx="254" cy="66" r="11" fill="' + C('sun') + '"/>' + T(254, 70, 'AI', 9, ink, ' text-anchor="middle" font-weight="800"');
      s += T(272, 63, 'AI Assistant', 11, '#fff', ' font-weight="700"') + T(272, 77, '&#9679; Online &#183; replies instantly', 8, C('chat-online'));
      var bubble = function(me, y, txt, t) {
        var w = Math.min(190, txt.replace(/&[^;]+;/g, 'x').length * 5.4 + 20), x = me ? 452 - w : 244;
        return '<g opacity="0">' + show(t, D) + R(x, y, w, 24, 12, me ? C('sun') : C('chat-ai')) + T(x + 10, y + 16, txt, 9.5, ink) + '</g>';
      };
      s += bubble(true, 100, 'Do you manage 40+ units?', 0.08);
      s += '<g opacity="0">' + show(0.16, D, 0.28) + R(244, 132, 46, 24, 12, C('chat-ai')) +
        [258, 267, 276].map(function(x, i) { return '<circle cx="' + x + '" cy="144" r="3" fill="' + C('ink-soft') + '"><animate attributeName="cy" values="144;140;144" dur="0.9s" begin="' + (i * 0.15) + 's" repeatCount="indefinite"/></circle>'; }).join('') + '</g>';
      s += bubble(false, 132, 'Yes! Want a free assessment?', 0.3);
      s += bubble(false, 162, 'I have Tue 2pm or Wed 10am.', 0.38);
      s += bubble(true, 194, 'Tue 2pm &#128077;', 0.5);
      s += '<g opacity="0">' + show(0.62, D) + R(244, 226, 208, 34, 8, C('chat-booked-bg')) +
        T(256, 241, '&#10003; Call booked &#183; Tue 2:00 PM', 9.5, C('chat-booked'), ' font-weight="700"') + T(256, 254, 'Synced to your CRM', 8, C('ink-soft')) + '</g>';
      s += R(244, 272, 208, 24, 12, C('chat-ai')) + T(256, 288, 'Type a message&#8230;', 9, C('ink-soft'));
      return frame('chat', '#fff', s);
    },

    /* OpenClaw — scraping a directory into a verified lead sheet */
    scrape: function() {
      var D = 8, s = '', ink = C('ink'), green = C('app-sheets');
      s += R(0, 0, 480, 30, 0, C('chat-bar'));
      s += '<circle cx="16" cy="15" r="4.5" fill="' + C('mac-red') + '"/><circle cx="30" cy="15" r="4.5" fill="' + C('mac-yellow') + '"/><circle cx="44" cy="15" r="4.5" fill="' + C('mac-green') + '"/>';
      s += R(64, 7, 200, 16, 8, '#fff') + T(74, 19, 'directory.com/agencies?page=3', 8.5, C('ink-soft'));
      s += R(330, 6, 140, 18, 9, ink) + T(342, 19, '&#9679; OpenClaw &#183; extracting', 8.5, C('scrape-live'), ' font-weight="700"');
      for (var i = 0; i < 5; i++) {
        var y = 44 + i * 52;
        s += R(16, y, 196, 44, 6, C('scrape-card')) + R(24, y + 8, 28, 28, 6, C('chat-skel')) +
          R(60, y + 11, 110, 8, 4, C('scrape-skel')) + R(60, y + 25, 80, 7, 3.5, C('chat-skel'));
      }
      s += '<rect x="14" y="42" width="200" height="48" rx="7" fill="' + C('sun') + '" opacity="0.35">' +
        '<animate attributeName="y" values="42;94;146;198;250;250" keyTimes="0;0.18;0.36;0.54;0.72;1" dur="' + D + 's" repeatCount="indefinite" calcMode="discrete"/></rect>';
      s += R(236, 44, 228, 260, 6, '#fff', C('chat-line'), 1);
      s += R(236, 44, 228, 24, 0, green) + T(246, 60, 'Company', 9, '#fff', ' font-weight="700"') + T(330, 60, 'Email', 9, '#fff', ' font-weight="700"') + T(412, 60, 'Status', 9, '#fff', ' font-weight="700"');
      var rows = [['Northpeak Co.', 'hello@north&#8230;'], ['Brightline', 'team@bright&#8230;'], ['Oakridge PM', 'info@oakri&#8230;'], ['Harbor &amp; Co', 'ops@harbor&#8230;'], ['Summit Realty', 'sales@summ&#8230;']];
      rows.forEach(function(r, i) {
        var y = 70 + i * 34, t = 0.1 + i * 0.18;
        s += '<g opacity="0">' + show(t, D) + '<line x1="236" y1="' + (y + 32) + '" x2="464" y2="' + (y + 32) + '" stroke="' + C('chat-line') + '"/>' +
          T(246, y + 20, r[0], 9, ink, ' font-weight="600"') + T(330, y + 20, r[1], 8.5, C('ink-soft')) +
          R(408, y + 9, 48, 15, 7.5, C('chat-booked-bg')) + T(414, y + 20, '&#10003; verified', 7.5, C('chat-booked'), ' font-weight="700"') + '</g>';
      });
      return frame('scrape', C('scrape-canvas'), s);
    }
  };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bgObs = 'IntersectionObserver' in window ? new IntersectionObserver(function(entries) {
    entries.forEach(function(en) {
      var svg = en.target.querySelector('svg');
      if (!svg || !svg.pauseAnimations) return;
      if (en.isIntersecting) svg.unpauseAnimations(); else svg.pauseAnimations();
    });
  }, { rootMargin: '100px 0px' }) : null;

  document.querySelectorAll('[data-bg]').forEach(function(host) {
    var build = BG[host.dataset.bg];
    if (!build) return;
    var layer = document.createElement('div');
    layer.className = 'bg-anim bg-' + host.dataset.bg;
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = build();
    /* Split the section header: text on one side, live app window on the other */
    var header = host.classList.contains('page-hero')
      ? host.querySelector('.container')
      : host.querySelector('.section-header, .pillars-header');
    if (header) {
      var textCol = document.createElement('div');
      textCol.className = 'sh-text';
      while (header.firstChild) textCol.appendChild(header.firstChild);
      header.appendChild(textCol);
      header.appendChild(layer);
      header.classList.add('split-header');
    } else {
      host.insertBefore(layer, host.firstChild);
    }
    var svg = layer.querySelector('svg');
    if (reduceMotion) {
      svg.setCurrentTime(4);
      svg.pauseAnimations();
    } else if (bgObs) {
      svg.pauseAnimations();
      bgObs.observe(layer);
    }
  });


  /* ── Services dropdown (click / tap) ─────────────────────── */
  document.querySelectorAll('.dropdown-toggle').forEach(function(toggle) {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      toggle.closest('.nav-dropdown').classList.toggle('open');
    });
  });
  document.addEventListener('click', function(e) {
    document.querySelectorAll('.nav-dropdown.open').forEach(function(dd) {
      if (!dd.contains(e.target)) dd.classList.remove('open');
    });
  });

});
