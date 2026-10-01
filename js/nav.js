/* nav.js — injects shared nav and footer into every page */
(function () {
  const UPWORK    = 'https://www.upwork.com/freelancers/~01435b77ef70754170?mp_source=share';
  const LINKEDIN  = 'https://ng.linkedin.com/in/wisdom-vincent-b9aa72349';
  const WHATSAPP  = 'https://wa.me/2349136538627';
  const EMAIL     = 'mailto:wvemofficial@gmail.com';
  const CALENDLY  = 'https://calendly.com/wvemofficial/30min';

  const PAGES = [
    { href: 'index.html',    label: 'Home' },
    { href: 'about.html',   label: 'About' },
    { href: 'projects.html',label: 'Projects' },
    { href: 'reviews.html', label: 'Reviews' },
    { href: 'faq.html',     label: 'FAQ' },
    { href: 'contact.html', label: 'Contact' },
  ];

  const SERVICES = [
    { href: 'claude-code.html', label: 'Custom AI Tools',          icon: '🤖' },
    { href: 'n8n.html',         label: 'Workflow Automation',      icon: '⚡' },
    { href: 'make.html',        label: 'Process Automation (Make)', icon: '🔗' },
    { href: 'zapier.html',      label: 'App Sync (Zapier)',        icon: '🟠' },
    { href: 'ai-website.html',  label: 'AI-Powered Websites',      icon: '🌐' },
    { href: 'openclaw.html',    label: 'Lead Generation & Data',   icon: '🎯' },
    { href: 'gohighlevel.html', label: 'CRM & Lead Follow-up',     icon: '🚀' },
  ];

  const SOCIALS = [
    {
      href: LINKEDIN,
      label: 'LinkedIn',
      key: 'linkedin',
      svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
    },
    {
      href: UPWORK,
      label: 'Upwork',
      key: 'upwork',
      svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.546-1.405 0-2.543-1.14-2.543-2.546V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/></svg>`,
    },
    {
      href: WHATSAPP,
      label: 'WhatsApp',
      key: 'whatsapp',
      svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.99 2h-.003C6.453 2 2 6.454 2 12.002c0 1.766.461 3.424 1.271 4.872L2 22l5.243-1.25A9.936 9.936 0 0 0 11.99 22h.004C17.543 22 22 17.496 22 11.948 22 6.404 17.543 2 11.99 2z"/></svg>`,
    },
  ];

  function getCurrentPage() {
    const path = window.location.pathname;
    return path.split('/').pop() || 'index.html';
  }

  function isActive(href) {
    const current = getCurrentPage();
    if (current === '' && href === 'index.html') return true;
    return current === href;
  }

  function buildNavLinks() {
    return PAGES.map(p => `
      <li>
        <a href="${p.href}" class="${isActive(p.href) ? 'active' : ''}">${p.label}</a>
      </li>
    `).join('');
  }

  function buildDropdown() {
    const isServiceActive = SERVICES.some(s => isActive(s.href));
    return `
      <li class="nav-dropdown">
        <a href="#" class="dropdown-toggle ${isServiceActive ? 'active' : ''}">
          Services
          <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <ul class="dropdown-menu">
          ${SERVICES.map(s => `
            <li>
              <a href="${s.href}" class="${isActive(s.href) ? 'active' : ''}">
                <span class="dm-icon">${s.icon}</span>
                ${s.label}
              </a>
            </li>
          `).join('')}
        </ul>
      </li>
    `;
  }

  function buildSocialIcons() {
    return SOCIALS.map(s => `
      <a href="${s.href}" target="_blank" rel="noopener" aria-label="${s.label}" class="brand-${s.key}">${s.svg}</a>
    `).join('');
  }

  function buildNav() {
    return `
      <nav class="nav" id="navbar">
        <div class="nav-inner">
          <a href="index.html" class="nav-logo">Wisdom<span class="accent">.</span></a>
          <ul class="nav-links" id="navLinks">
            ${buildNavLinks()}
            ${buildDropdown()}
          </ul>
          <div class="nav-actions">
            <div class="nav-socials">${buildSocialIcons()}</div>
            <a href="${CALENDLY}" target="_blank" rel="noopener" class="btn btn-primary nav-cta">Book a Call <span class="btn-arrow" aria-hidden="true">&rarr;</span></a>
            <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
      <div class="nav-overlay" id="navOverlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
        <nav class="nav-overlay-links">
          <span class="nav-overlay-section">Pages</span>
          ${PAGES.map(p => `<a href="${p.href}" class="${isActive(p.href) ? 'active' : ''}">${p.label}</a>`).join('')}
          <span class="nav-overlay-section">Services</span>
          ${SERVICES.map(s => `<a href="${s.href}" class="${isActive(s.href) ? 'active' : ''}">${s.label}</a>`).join('')}
        </nav>
        <div class="nav-overlay-actions">
          ${buildSocialIcons()}
          <a href="${CALENDLY}" target="_blank" rel="noopener" class="btn btn-primary" style="margin-left:auto;">Book a Call</a>
        </div>
      </div>
    `;
  }

  function buildFooter() {
    const year = new Date().getFullYear();
    return `
      <footer class="footer">
        <div class="container">
          <div class="footer-card">
            <div class="footer-cta">
              <h2>Have a process that should <em>run itself?</em></h2>
              <div class="footer-cta-side">
                <a href="${EMAIL}" class="footer-email">wvemofficial@gmail.com</a>
                <a href="${CALENDLY}" target="_blank" rel="noopener" class="btn btn-primary">Book a Free Call <span class="btn-arrow" aria-hidden="true">&rarr;</span></a>
              </div>
            </div>
            <div class="footer-inner">
              <div class="footer-brand">
                <a href="index.html" class="nav-logo">Wisdom<span class="accent">.</span></a>
                <p>I help businesses win back time and stop losing leads — with AI, automation and websites built around how they actually work.</p>
                <div class="footer-socials">${buildSocialIcons()}</div>
              </div>
              <div class="footer-links">
                <div class="footer-col">
                  <h4>Pages</h4>
                  <ul>
                    ${PAGES.map(p => `<li><a href="${p.href}">${p.label}</a></li>`).join('')}
                  </ul>
                </div>
                <div class="footer-col">
                  <h4>Services</h4>
                  <ul>
                    ${SERVICES.map(s => `<li><a href="${s.href}">${s.label}</a></li>`).join('')}
                  </ul>
                </div>
                <div class="footer-col">
                  <h4>Connect</h4>
                  <ul>
                    <li><a href="${CALENDLY}" target="_blank" rel="noopener">Book a Call</a></li>
                    <li><a href="${UPWORK}" target="_blank" rel="noopener">Upwork Profile</a></li>
                    <li><a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a></li>
                    <li><a href="${WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a></li>
                    <li><a href="${EMAIL}">Email Me</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="footer-bottom">
              <p>© ${year} Wisdom. All rights reserved.</p>
              <p>Based in Nigeria · Working Globally · <a href="privacy.html">Privacy</a></p>
              <a href="#main">Back to top ↑</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }


  /* Drifting magenta ribbon behind the whole page (see .bg-ribbon in style.css) */
  function buildRibbon() {
    var g = function (id, a, b, c) {
      return '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="' + a + '"/><stop offset=".5" stop-color="' + b + '"/><stop offset="1" stop-color="' + c + '"/></linearGradient>';
    };
    return '<div class="bg-ribbon" aria-hidden="true"><svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">' +
      '<defs>' + g('rb1', '#1A0620', '#B0176E', '#2A0830') + g('rb2', '#2A0830', '#F0559F', '#3A0B3C') + g('rb3', '#140418', '#7A1258', '#140418') +
      '<filter id="rbBlur"><feGaussianBlur stdDeviation="6"/></filter></defs>' +
      '<g filter="url(#rbBlur)" fill="none" stroke-linecap="round">' +
      '<path d="M120,780 C300,520 520,880 700,560 S960,260 1080,420" stroke="url(#rb3)" stroke-width="210" opacity=".9"/>' +
      '<path d="M60,620 C260,360 480,760 680,440 S920,140 1060,300" stroke="url(#rb1)" stroke-width="150" opacity=".95"/>' +
      '<path d="M90,640 C280,400 490,770 690,460 S930,170 1060,320" stroke="url(#rb2)" stroke-width="26" opacity=".85"/>' +
      '</g></svg></div>';
  }

  function inject() {
    const mainEl = document.querySelector('main');
    if (!mainEl) return;

    const navEl = document.createElement('div');
    navEl.innerHTML = buildNav();
    mainEl.parentNode.insertBefore(navEl.firstElementChild, mainEl);
    const overlay = navEl.firstElementChild;
    if (overlay) mainEl.parentNode.insertBefore(overlay, mainEl);

    const ribbonEl = document.createElement('div');
    ribbonEl.innerHTML = buildRibbon();
    document.body.insertBefore(ribbonEl.firstElementChild, document.body.firstChild);

    const footerEl = document.createElement('div');
    footerEl.innerHTML = buildFooter();
    mainEl.parentNode.appendChild(footerEl.firstElementChild);
  }

  document.addEventListener('DOMContentLoaded', inject);
})();
