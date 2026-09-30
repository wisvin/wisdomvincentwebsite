/* preloader.js — short intro screen shown on the first page of a visit.
   Stays until the page has loaded (min 1.8s so the line can be read,
   max ~3.2s), then fades out. Skipped for the rest of the session. */
(function () {
  var KEY = 'wv-intro-seen';
  try {
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, '1');
  } catch (e) { /* storage blocked — just show it */ }

  var root = document.documentElement;
  var start = Date.now();
  var done = false;
  root.classList.add('pl-active');

  function build() {
    if (document.getElementById('preloader')) return;
    var el = document.createElement('div');
    el.id = 'preloader';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-label', 'Loading');
    el.innerHTML =
      '<div class="pl-inner">' +
        '<div class="pl-logo">Wisdom<span>.</span></div>' +
        '<p class="pl-line">Clients don&rsquo;t care how much I build &mdash; until they see how much they <span class="hl">grow.</span></p>' +
        '<div class="pl-status"><span class="pl-dot" aria-hidden="true"></span>booting growth systems&hellip;</div>' +
        '<div class="pl-bar" aria-hidden="true"><i></i></div>' +
      '</div>';
    document.body.insertBefore(el, document.body.firstChild);
  }

  function finish() {
    if (done) return;
    done = true;
    var wait = Math.max(0, 1800 - (Date.now() - start));
    setTimeout(function () {
      root.classList.add('pl-out');
      setTimeout(function () {
        root.classList.remove('pl-active', 'pl-out');
        var el = document.getElementById('preloader');
        if (el) el.parentNode.removeChild(el);
      }, 450);
    }, wait);
  }

  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
  window.addEventListener('load', finish);
  setTimeout(finish, 3200);
})();
