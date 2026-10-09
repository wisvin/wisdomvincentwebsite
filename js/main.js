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
    fill(document.getElementById('reviewsGrid'), WV.mixReviews(window.REVIEWS).map(WV.reviewCard).join(''));
    fill(document.getElementById('homeReviewsGrid'), WV.homeReviews(window.REVIEWS, 10).map(WV.reviewCard).join(''));
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

  /* ── Claude Code terminal animation ─────────────────────────
     A mini "live" Claude Code terminal session. Colours come from the
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

  /* ── Lead pop-up: a small slide-in form 25 seconds after arriving ───────────
     Not on the contact / privacy / 404 pages. It never shows again after a message is sent,
     and stays away for 7 days after it is closed. It waits while someone is typing or the tab is hidden. */
  (function initLeadPopup() {
    var DELAY = 25000, SNOOZE_DAYS = 7, KEY = 'leadPopup';
    var file = location.pathname.split('/').pop() || 'index.html';
    if (/^(contact|privacy|404)\.html$/.test(file)) return;

    function read() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
    function write(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* storage blocked: fine */ } }
    var saved = read();
    if (saved.done) return;
    if (saved.snoozeUntil && Date.now() < saved.snoozeUntil) return;

    var pop = null;

    function close(snooze) {
      if (!pop) return;
      if (snooze) { var s = read(); s.snoozeUntil = Date.now() + SNOOZE_DAYS * 86400000; write(s); }
      var el = pop; pop = null;
      document.removeEventListener('keydown', onKey);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.remove(); return; }
      el.classList.remove('is-in');
      setTimeout(function () { el.remove(); }, 350);
    }
    function onKey(e) { if (e.key === 'Escape') close(true); }

    function build() {
      pop = document.createElement('aside');
      pop.className = 'lead-pop';
      pop.setAttribute('role', 'dialog');
      pop.setAttribute('aria-labelledby', 'leadPopTitle');
      pop.innerHTML =
        '<button type="button" class="lead-pop-close" aria-label="Close">&times;</button>' +
        '<div class="lead-pop-body">' +
          '<p class="lead-pop-kicker">&bull; Free plan</p>' +
          '<h2 class="lead-pop-title" id="leadPopTitle">What is slowing your business down?</h2>' +
          '<p class="lead-pop-text">Tell me in a sentence or two. I will reply personally within 24 hours with how I would fix it.</p>' +
          '<form id="leadPopupForm" action="https://formspree.io/f/mqevdzyr" method="POST">' +
            '<input type="hidden" name="_subject" value="New enquiry from the website pop-up" />' +
            '<input type="hidden" name="source" value="Website pop-up" />' +
            '<input type="hidden" name="page" value="" />' +
            '<input type="text" name="_gotcha" class="lead-pop-hp" tabindex="-1" autocomplete="off" aria-hidden="true" />' +
            '<label for="leadPopName">Your name</label>' +
            '<input id="leadPopName" name="name" type="text" class="form-control" autocomplete="name" required />' +
            '<label for="leadPopEmail">Email</label>' +
            '<input id="leadPopEmail" name="email" type="email" class="form-control" autocomplete="email" placeholder="you@company.com" required />' +
            '<label for="leadPopMsg">What do you want to fix or automate?</label>' +
            '<textarea id="leadPopMsg" name="message" class="form-control" rows="3" required></textarea>' +
            '<button type="submit" class="btn btn-primary lead-pop-submit">Send</button>' +
          '</form>' +
          '<p class="lead-pop-note">Only used to reply to you. <a href="privacy.html">Privacy policy</a></p>' +
        '</div>' +
        '<div class="lead-pop-ok" hidden>' +
          '<h2 class="lead-pop-title">Thank you, I got it.</h2>' +
          '<p class="lead-pop-text">I will reply to <strong class="lead-pop-who"></strong> within 24 hours. In a hurry? Message me on WhatsApp.</p>' +
          '<a class="btn btn-primary lead-pop-submit" href="https://wa.me/2349136538627" target="_blank" rel="noopener">Open WhatsApp</a>' +
        '</div>';
      document.body.appendChild(pop);
      pop.querySelector('input[name="page"]').value = location.pathname;
      pop.querySelector('.lead-pop-close').addEventListener('click', function () { close(true); });
      document.addEventListener('keydown', onKey);

      var form = pop.querySelector('form');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = form.querySelector('[type="submit"]');
        btn.textContent = 'Sending…';
        btn.disabled = true;
        fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
          .then(function (res) {
            if (!res.ok) throw new Error('err');
            var s = read(); s.done = true; write(s);
            pop.querySelector('.lead-pop-who').textContent = form.elements.email.value;
            pop.querySelector('.lead-pop-body').hidden = true;
            pop.querySelector('.lead-pop-ok').hidden = false;
          })
          .catch(function () {
            btn.textContent = 'Try again';
            btn.disabled = false;
            alert('Something went wrong. Please email wvemofficial@gmail.com directly.');
          });
      });
      requestAnimationFrame(function () { requestAnimationFrame(function () { if (pop) pop.classList.add('is-in'); }); });
    }

    function tryShow() {
      var a = document.activeElement;
      if (document.hidden || (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) { setTimeout(tryShow, 5000); return; }
      build();
    }
    setTimeout(tryShow, DELAY);
  })();

});
