/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
let activeObserver = null;
let pendingTimers = [];

function cleanupScrollReveal() {
  if (activeObserver) {
    activeObserver.disconnect();
    activeObserver = null;
  }
  pendingTimers.forEach(timer => clearTimeout(timer));
  pendingTimers = [];
}

function revealAll(reveals) {
  reveals.forEach(el => el.classList.add('visible'));
}

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initScrollReveal() {
  cleanupScrollReveal();

  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  // For users who prefer reduced motion, skip the IO + delay and mark
  // everything visible up-front. Avoids the translate/fade reveal entirely.
  if (prefersReducedMotion() || typeof window.IntersectionObserver !== 'function') {
    revealAll(reveals);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.style.getPropertyValue('--reveal-delay') || '0') * 1000;
        const timer = setTimeout(() => {
          el.classList.add('visible');
          pendingTimers = pendingTimers.filter(item => item !== timer);
        }, delay);
        pendingTimers.push(timer);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.04 });
  activeObserver = observer;

  reveals.forEach(el => activeObserver.observe(el));
}

document.addEventListener('astro:before-swap', cleanupScrollReveal);
document.addEventListener('astro:page-load', initScrollReveal);
