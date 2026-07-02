/* =========================================================
   JAN MARK BASAN — PORTFOLIO
   Sticky nav, mobile menu, scroll reveal, counters, skill bars
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky nav ---------- */
  const nav = document.getElementById('nav');
  const onNavScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
  onNavScroll();
  window.addEventListener('scroll', onNavScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active nav link ---------- */
  const ids = ['home', 'about', 'services', 'experience', 'work', 'skills', 'tools', 'testimonials', 'contact'];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  const navLinkEls = Array.from(navLinks.querySelectorAll('.nav__link'));
  const setActive = (id) => navLinkEls.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`));
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Skill bars fill on scroll ---------- */
  const fills = document.querySelectorAll('.skillbar__fill');
  const fillObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const pct = e.target.getAttribute('data-pct') || '0';
        e.target.style.width = pct + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  fills.forEach((el) => fillObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.statsbar__num');
  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    if (prefersReducedMotion) { el.textContent = target + suffix; return; }
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => { if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  counters.forEach((el) => counterObserver.observe(el));

  /* ---------- Certificate lightbox ---------- */
  const certTrigger = document.getElementById('certTrigger');
  const certLightbox = document.getElementById('certLightbox');
  const certClose = document.getElementById('certClose');
  if (certTrigger && certLightbox && certClose) {
    let lastFocused = null;
    const open = () => { lastFocused = document.activeElement; certLightbox.hidden = false; document.body.style.overflow = 'hidden'; certClose.focus(); };
    const close = () => { certLightbox.hidden = true; document.body.style.overflow = ''; if (lastFocused) lastFocused.focus(); };
    certTrigger.addEventListener('click', open);
    certClose.addEventListener('click', close);
    certLightbox.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !certLightbox.hidden) close(); });
  }

  /* ---------- Back to top ---------- */
  document.getElementById('toTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
});
