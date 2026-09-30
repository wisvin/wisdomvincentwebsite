/* analytics.js — Vercel Web Analytics + Speed Insights (cookieless,
   no personal data) plus the key conversion events. Runs only on the
   live site, never on localhost. Enable "Web Analytics" and
   "Speed Insights" in the Vercel project dashboard for data to appear.
   Note: custom events (track) need a Vercel Pro plan; page views and
   Speed Insights work on the free plan. */
(function () {
  var host = location.hostname;
  if (!host || host === 'localhost' || host === '127.0.0.1') return;

  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
  ['/_vercel/insights/script.js', '/_vercel/speed-insights/script.js'].forEach(function (src) {
    var s = document.createElement('script');
    s.defer = true;
    s.src = src;
    document.head.appendChild(s);
  });

  function track(name, data) {
    try { window.va('event', { name: name, data: data || {} }); } catch (e) { /* ignore */ }
  }
  window.wvTrack = track;

  function page() { return location.pathname.replace(/^\//, '') || 'index.html'; }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('calendly.com') > -1) track('Book call click', { page: page() });
    else if (href.indexOf('wa.me') > -1) track('WhatsApp click', { page: page() });
    else if (href.indexOf('mailto:') === 0) track('Email click', { page: page() });
    else if (href.indexOf('upwork.com') > -1) track('Upwork click', { page: page() });
    else if (href.indexOf('linkedin.com') > -1) track('LinkedIn click', { page: page() });
    else if (href.indexOf('credly.com') > -1) track('Credential checked', { page: page() });
    else if (href.indexOf('case-study.html') > -1) track('Case study opened', { from: page() });
  });

  document.addEventListener('submit', function (e) {
    track('Form submitted', { form: e.target.id || 'form', page: page() });
  });
})();
