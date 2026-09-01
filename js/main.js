(() => {
  'use strict';

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav shadow ---------- */
  const nav = document.getElementById('siteNav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Smooth scroll offset for sticky header ---------- */
  const headerOffset = () => (nav ? nav.offsetHeight : 0) + 14;
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.acc-item__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc-item');
      const wasOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.acc-item').forEach(i => i.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.split__text, .split__media, .svc-card, .why-card, .step, .reel-card, .acc-item, .ba-slider'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Lazy-load + autoplay-when-visible videos ---------- */
  const lazyVideos = document.querySelectorAll('video[data-src]');
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (!video.src) {
            video.src = video.dataset.src;
            video.load();
          }
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.35 });
    lazyVideos.forEach(v => videoObserver.observe(v));
  } else {
    lazyVideos.forEach(v => { v.src = v.dataset.src; });
  }

  /* ---------- Hero video ---------- */
  const heroVideo = document.querySelector('.hero__video');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroVideo && reduceMotion) {
    heroVideo.pause();
    heroVideo.removeAttribute('autoplay');
  }

  /* ---------- Before & after sliders ---------- */
  document.querySelectorAll('.ba-slider__range').forEach(range => {
    const frame = document.getElementById(range.dataset.target);
    if (!frame) return;
    const update = () => frame.style.setProperty('--pos', range.value + '%');
    range.addEventListener('input', update);
    update();
  });
})();
