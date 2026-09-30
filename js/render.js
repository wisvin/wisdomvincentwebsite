/* render.js — the single source of markup for project cards, review
   cards and case study pages. Used in the browser (window.WVRender)
   and by scripts/build-static.js, which writes the same markup into
   the HTML so search engines can read it without running JavaScript. */
(function (root) {
  var KIND_LABEL = { client: 'Client project', build: 'Demo build' };
  var CALENDLY = 'https://calendly.com/wvemofficial/30min';

  function caseUrl(p) { return 'case-study-' + p.slug + '.html'; }

  function flowDiagram(flow) {
    return '<div class="flow" aria-hidden="true">' + flow.map(function (n, i) {
      return (i ? '<span class="flow-link"><i></i></span>' : '') +
        '<span class="flow-node' + (i === 1 ? ' flow-core' : '') + '">' + n + '</span>';
    }).join('') + '</div>';
  }

  function projectThumb(p, autoplay) {
    if (p.video) {
      var media = autoplay
        ? '<video class="feat-video" data-src="' + (p.preview || p.video) + '" poster="' + p.poster + '" preload="none" muted loop playsinline></video>'
        : '<img class="thumb-img" src="' + p.poster + '" alt="' + p.title + ' demo" loading="lazy" />';
      return '<div class="project-thumb project-thumb-video">' + media +
        '<span class="thumb-play" aria-hidden="true">&#9654; Watch demo</span>';
    }
    if (p.flow) return '<div class="project-thumb thumb-flow">' + flowDiagram(p.flow);
    return '<div class="project-thumb">' + (p.previewClass ? '<div class="thumb-preview ' + p.previewClass + '" role="img" aria-label="' + p.title + ' screenshot"></div>' : '');
  }

  function projectCard(p, opts) {
    opts = opts || {};
    var tags = (p.stack || []).slice(0, 3).map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('');
    var kind = p.kind ? '<span class="kind-badge kind-' + p.kind + '">' + KIND_LABEL[p.kind] + '</span>' : '';
    return '<a class="project-card" href="' + caseUrl(p) + '" data-category="' + (p.cat || '') + '">' +
      projectThumb(p, opts.autoplay) + kind +
        '<span class="project-category">' + (p.catLabel || '') + '</span></div>' +
      '<div class="project-body"><h3>' + p.title + '</h3>' +
        (p.problem ? '<p class="project-problem"><span>The problem</span>' + p.problem + '</p>' : '<p>' + p.desc + '</p>') +
        (p.result ? '<p class="project-result">' + p.result + '</p>' : '') +
        '<div class="project-footer"><div class="project-stack">' + tags + '</div>' +
          '<span class="project-link">Read the full case study →</span>' +
        '</div></div></a>';
  }

  function reviewCard(r) {
    return '<div class="review-card">' +
      '<div class="review-avatar"><img src="' + r.photo + '" alt="' + r.name + '" loading="lazy" onerror="this.style.display=\'none\'" /></div>' +
      '<div class="review-stars" aria-label="5 out of 5 stars">★★★★★</div>' +
      '<p class="review-text">"' + r.text + '"</p>' +
      '<div class="review-footer"><div class="review-name">' + r.name + '</div>' +
      '<div class="review-meta">' + r.countryName + '</div>' +
      '</div></div>';
  }

  /* Full <main> content of a case study page */
  function caseStudy(p, list, reviews) {
    var cs = p.caseStudy || {};
    var idx = list.indexOf(p);
    var next = list[(idx + 1) % list.length];
    var tags = (p.stack || []).map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('');
    var visual = p.video
      ? '<video class="cs-video" src="' + p.video + '#t=20" poster="' + p.poster + '" controls preload="none" playsinline></video>'
      : p.projectFile
        ? '<div class="cs-frame"><iframe src="' + p.projectFile + '" title="' + p.title + ' — live build" loading="lazy" sandbox="allow-scripts allow-same-origin"></iframe></div>' +
          '<a class="cs-open" href="' + p.projectFile + '" target="_blank" rel="noopener">Open the live build full screen ↗</a>'
        : p.flow ? '<div class="cs-flow">' + flowDiagram(p.flow) + '</div>' : '';

    var sections = [];
    function sec(id, title, body) { if (body) sections.push({ id: id, title: title, body: body }); }
    sec('brief', p.kind === 'build' ? 'The brief' : 'What the client came with', cs.clientBrief ? '<p class="cs-lead">' + cs.clientBrief + '</p>' : '');
    sec('plan', 'The plan I drafted', (cs.plan || []).length ? '<ul class="cs-plan">' + cs.plan.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : '');
    sec('process', 'The process, step by step',
      (cs.whatWasBuilt ? '<p>' + cs.whatWasBuilt + '</p>' : '') +
      ((cs.steps || []).length ? '<ol class="cs-steps">' + cs.steps.map(function (st) {
        return '<li><strong>' + st.title + '</strong><p>' + st.detail + '</p></li>';
      }).join('') + '</ol>' : ''));
    sec('bottleneck', 'The bottleneck', cs.bottleneck ? '<div class="cs-callout cs-warn"><span class="cs-callout-tag">! bottleneck</span><strong>' + cs.bottleneck.title + '</strong><p>' + cs.bottleneck.detail + '</p></div>' : '');
    sec('fix', 'How I fixed it', cs.fix ? '<div class="cs-callout cs-ok"><span class="cs-callout-tag">&#10003; fix</span><p>' + cs.fix + '</p></div>' : '');
    sec('results', 'The result',
      (p.metric ? '<div class="cs-metric"><div><span>Before</span><b class="was">' + p.metric.before + '</b></div><div class="arrow">&rarr;</div><div><span>After</span><b>' + p.metric.after + '</b></div><em>' + p.metric.label + '</em></div>' : '') +
      ((cs.results || []).length ? '<ul class="pcs-list cs-results">' + cs.results.map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul>' : ''));
    var review = cs.feedback && reviews ? reviews.filter(function (r) { return r.name === cs.feedback; })[0] : null;
    sec('feedback', 'Client feedback', review ?
      '<figure class="cs-review"><div class="review-stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote>&ldquo;' + review.text + '&rdquo;</blockquote>' +
      '<figcaption><img src="' + review.photo + '" alt="' + review.name + '" loading="lazy" /><span><b>' + review.name + '</b>' + review.countryName + '</span></figcaption></figure>' : '');

    var pad = function (i) { return (i < 9 ? '0' : '') + (i + 1); };
    var toc = sections.map(function (x, i) { return '<li><a href="#' + x.id + '"><span>' + pad(i) + '</span>' + x.title + '</a></li>'; }).join('');
    var body = sections.map(function (x, i) {
      return '<section class="cs-sec" id="' + x.id + '"><span class="cs-num">' + pad(i) + ' /</span><h2>' + x.title + '</h2>' + x.body + '</section>';
    }).join('');

    return '<div class="page-hero cs-hero"><div class="container">' +
        '<nav class="cs-crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="projects.html">Case studies</a> / <span>' + p.title + '</span></nav>' +
        '<span class="section-label">' + KIND_LABEL[p.kind] + ' &middot; ' + p.catLabel + '</span>' +
        '<h1>' + p.title + '</h1>' +
        '<p>' + p.desc + '</p>' +
        '<div class="cs-meta">' + (p.result ? '<span class="cs-result">' + p.result + '</span>' : '') + '<div class="cs-tags">' + tags + '</div></div>' +
      '</div></div>' +
      (visual ? '<section class="cs-visual"><div class="container">' + visual + '</div></section>' : '') +
      '<section class="cs-content"><div class="container cs-grid">' +
        '<aside class="cs-toc"><span class="cs-toc-title">On this page</span><ol>' + toc + '</ol>' +
          '<a class="btn btn-primary" href="' + CALENDLY + '" target="_blank" rel="noopener">Book a free call</a></aside>' +
        '<article class="cs-article">' + body + '</article>' +
      '</div></section>' +
      '<section class="cs-next"><div class="container">' +
        '<a class="cs-next-card" href="' + caseUrl(next) + '"><span class="section-label">Next case study</span><h2>' + next.title + '</h2><p>' + (next.problem || next.desc) + '</p><span class="project-link">Read it &rarr;</span></a>' +
      '</div></section>';
  }

  root.WVRender = {
    KIND_LABEL: KIND_LABEL, caseUrl: caseUrl, flowDiagram: flowDiagram,
    projectCard: projectCard, reviewCard: reviewCard, caseStudy: caseStudy
  };
})(typeof window !== 'undefined' ? window : this);
