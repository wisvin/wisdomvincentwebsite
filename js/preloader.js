/* preloader.js — loading screen. The site stays hidden until the page has
   completely finished loading (HTML, CSS, images and fonts).
   - Home page, once a day per visitor: the full intro with the growth line, shown for
     at least 0.6s (kept short: content hidden longer hurts Google's speed score).
   - Every other page and repeat visits: hidden until loaded; if loading takes longer than a blink
     (350ms) a short version of the same screen appears.
   - Safety: never longer than 15s, so nobody gets stuck if something hangs. */
(function () {
  /* The full intro (with the doors) plays only on the home page, and at most once a day per visitor.
     Someone landing on any other page (an email link, a search result) goes straight to the content. */
  var KEY = 'wv-intro-ts';
  var DAY = 24 * 60 * 60 * 1000;
  var path = location.pathname.replace(/\/+$/, '');
  var isHome = path === '' || /\/index\.html$/.test(path);
  var firstVisit = false;
  if (isHome) {
    firstVisit = true;
    try {
      var last = parseInt(localStorage.getItem(KEY), 10);
      if (last && Date.now() - last < DAY) firstVisit = false;
      else localStorage.setItem(KEY, String(Date.now()));
    } catch (e) {
      try { firstVisit = !sessionStorage.getItem(KEY); sessionStorage.setItem(KEY, '1'); } catch (e2) { /* storage blocked: play it */ }
    }
  }

  var root = document.documentElement;
  var start = Date.now();
  var done = false;
  var minShow = firstVisit ? 600 : 0;
  root.classList.add('pl-active');

  function build(full) {
    if (document.getElementById('preloader') || !document.body) return;
    var el = document.createElement('div');
    el.id = 'preloader';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-label', 'Loading');
    var doors = full && !reduceMotion();
    if (doors) el.className = 'pl-has-doors';
    el.innerHTML = full
      ? (doors ? '<i class="pl-door pl-door-l" aria-hidden="true"></i><i class="pl-door pl-door-r" aria-hidden="true"></i>' : '') +
        '<div class="pl-inner">' +
          '<div class="pl-logo">Wisdom<span>.</span></div>' +
          '<p class="pl-line">Clients don&rsquo;t care how much I build &mdash; until they see how much they <span class="hl">grow.</span></p>' +
          '<div class="pl-status"><span class="pl-dot" aria-hidden="true"></span>booting growth systems&hellip;</div>' +
          '<div class="pl-bar" aria-hidden="true"><i></i></div>' +
        '</div>'
      : '<div class="pl-inner pl-short">' +
          '<div class="pl-logo">Wisdom<span>.</span></div>' +
          '<div class="pl-status"><span class="pl-dot" aria-hidden="true"></span>loading&hellip;</div>' +
          '<div class="pl-bar pl-bar-loop" aria-hidden="true"><i></i></div>' +
        '</div>';
    document.body.insertBefore(el, document.body.firstChild);
  }

  function reduceMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }

  function cleanup() {
    root.classList.remove('pl-active', 'pl-out', 'pl-content-out', 'pl-doors-open');
    var el = document.getElementById('preloader');
    if (el) el.parentNode.removeChild(el);
  }

  function reveal() {
    var pre = document.getElementById('preloader');
    if (pre && pre.className.indexOf('pl-has-doors') !== -1) {
      /* first visit: the text fades, then two doors slide apart and the site is already visible behind them */
      root.classList.add('pl-content-out');
      setTimeout(function () {
        root.classList.remove('pl-active');
        root.classList.add('pl-doors-open');
        setTimeout(cleanup, 900);
      }, 200);
      return;
    }
    root.classList.add('pl-out');
    setTimeout(function () {
      root.classList.remove('pl-active', 'pl-out');
      var el = document.getElementById('preloader');
      if (el) el.parentNode.removeChild(el);
    }, 450);
  }

  function finish() {
    if (done) return;
    done = true;
    var wait = Math.max(0, minShow - (Date.now() - start));
    if (!document.getElementById('preloader') && wait === 0) {
      /* page loaded before the screen was needed: just show the site */
      root.classList.remove('pl-active');
      return;
    }
    setTimeout(reveal, wait);
  }

  if (firstVisit) {
    if (document.body) build(true);
    else document.addEventListener('DOMContentLoaded', function () { build(true); });
  } else {
    setTimeout(function () { if (!done) build(false); }, 350);
  }

  /* fully loaded = window "load" (images, CSS) + web fonts ready */
  window.addEventListener('load', function () {
    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fontsReady.then(finish, finish);
  });
  setTimeout(finish, 15000);
})();
