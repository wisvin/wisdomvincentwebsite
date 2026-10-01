/* preloader.js — loading screen. The site stays hidden until the page has
   completely finished loading (HTML, CSS, images and fonts).
   - First page of a visit: the full intro with the growth line, shown for
     at least 1.8s so the sentence can be read.
   - Later pages: hidden until loaded; if loading takes longer than a blink
     (350ms) a short version of the same screen appears.
   - Safety: never longer than 15s, so nobody gets stuck if something hangs. */
(function () {
  var KEY = 'wv-intro-seen';
  var firstVisit = true;
  try {
    firstVisit = !sessionStorage.getItem(KEY);
    sessionStorage.setItem(KEY, '1');
  } catch (e) { /* storage blocked — treat as first visit */ }

  var root = document.documentElement;
  var start = Date.now();
  var done = false;
  var minShow = firstVisit ? 1800 : 0;
  root.classList.add('pl-active');

  function build(full) {
    if (document.getElementById('preloader') || !document.body) return;
    var el = document.createElement('div');
    el.id = 'preloader';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-label', 'Loading');
    el.innerHTML = full
      ? '<div class="pl-inner">' +
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

  function reveal() {
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
