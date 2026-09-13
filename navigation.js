// Reading position: the last section above the line 24px below the actual sticky
// header. At the document bottom, select Contact. A clicked destination owns the
// indicator until scrolling settles or the user interrupts. No per-frame polling.
(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.nav');
  const menu = document.querySelector('.menu-toggle');
  const links = [...nav.querySelectorAll('a')];
  const sections = [...document.querySelectorAll('main > section[id]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const backTop = document.querySelector('.back-top');
  let positions = [], headerHeight = 81, maxScroll = 0;
  let dirty = true, frame = 0, pending = null, active = '';
  let settleTimer = 0, locationKey = location.href;

  function setActive(id) {
    if (active === id) return;
    active = id;
    links.forEach(link => {
      if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function closeMenu(focus = false) {
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    if (focus) menu.focus();
    invalidate();
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    invalidate();
  });
  function measure() {
    const y = scrollY;
    const nextHeight = header.getBoundingClientRect().height;
    positions = sections.map(section => ({ id: section.id, top: section.getBoundingClientRect().top + y }));
    maxScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    // All geometry reads precede writes, including the CSS anchor offset.
    if (Math.abs(nextHeight - headerHeight) > .1) {
      headerHeight = nextHeight;
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }
    dirty = false;
  }
  function actualSection() {
    if (maxScroll > 0 && scrollY >= maxScroll - 2) return sections.at(-1).id;
    const line = scrollY + headerHeight + 24;
    return positions.findLast(item => item.top <= line)?.id || sections[0].id;
  }
  function update() {
    frame = 0;
    if (matchMedia('print').matches) return;
    if (dirty) measure();
    if (pending?.start) {
      pending.start = false;
      const targetY = Math.max(0, Math.min(maxScroll, positions.find(item => item.id === pending.id).top - headerHeight - 20));
      pending.y = targetY;
      if (Math.abs(scrollY - targetY) < 1) { pending = null; }
      else { scrollTo({ top: targetY, behavior: reduced.matches ? 'instant' : 'smooth' }); }
    }
    setActive(pending?.id || actualSection());
    backTop.hidden = scrollY < (positions[1]?.top || innerHeight) - headerHeight;
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  function invalidate() { dirty = true; schedule(); }
  function settle() {
    clearTimeout(settleTimer);
    // Chromium can deliver the previous scroll's queued scrollend after a new
    // smooth scroll starts. Only settle this destination once it is reached.
    if (pending && (pending.start || Math.abs(scrollY - pending.y) > 2)) return;
    pending = null;
    schedule();
  }
  function interrupt() {
    if (!pending) return;
    pending = null;
    clearTimeout(settleTimer);
    // Stop the native smooth animation; wheel/touch default action still proceeds.
    scrollTo({ top: scrollY, behavior: 'instant' });
    schedule();
  }
  function navigate(hash, push = false, focus = false) {
    const target = sections.find(section => `#${section.id}` === hash);
    if (!target) { interrupt(); invalidate(); return; }
    clearTimeout(settleTimer);
    closeMenu();
    pending = { id: target.id, start: true };
    setActive(target.id);
    if (push && location.hash !== hash) history.pushState(null, '', hash);
    locationKey = location.href;
    if (focus) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    invalidate();
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (link && !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && sections.some(s => `#${s.id}` === link.hash)) {
      event.preventDefault();
      navigate(link.hash, true, true);
    } else if (!event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true);
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key) && !event.target.matches('input,textarea,select,[contenteditable]')) interrupt();
  });
  document.addEventListener('wheel', interrupt, { passive: true });
  document.addEventListener('touchstart', interrupt, { passive: true });
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('a[href^="#"],.menu-toggle')) interrupt();
  }, { passive: true });
  document.addEventListener('scroll', () => {
    schedule();
    // Fallback only for browsers without scrollend; 120ms quiet period, not a
    // guessed animation duration. No timer runs when the page is idle.
    if (!('onscrollend' in document)) {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 120);
    }
  }, { passive: true });
  document.addEventListener('scrollend', settle);
  window.addEventListener('resize', () => { interrupt(); invalidate(); });
  matchMedia('(min-width: 769px)').addEventListener('change', () => closeMenu());
  reduced.addEventListener('change', interrupt);
  function historyChanged() {
    if (location.href === locationKey) return;
    locationKey = location.href;
    if (location.hash) navigate(location.hash);
    else { interrupt(); invalidate(); }
  }
  window.addEventListener('popstate', historyChanged);
  window.addEventListener('hashchange', historyChanged);
  window.addEventListener('pageshow', invalidate);
  window.addEventListener('load', () => { if (location.hash) navigate(location.hash); else invalidate(); });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(invalidate);
    [header, ...sections].forEach(element => observer.observe(element));
  }
  document.fonts?.ready.then(invalidate);
  document.addEventListener('portfolio:filter', invalidate);
  if (location.hash) navigate(location.hash); else invalidate();
})();
