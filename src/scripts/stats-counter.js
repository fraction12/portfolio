/* ============================================================
   STATS COUNTER
   ============================================================ */
(function() {
  const counters = document.querySelectorAll('.stat-counter');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      observer.unobserve(el);

      // Special: version display (v1.6.0 is stored as data-version)
      if (el.dataset.version) {
        // Just show the version string without counting
        el.textContent = el.dataset.version;
        return;
      }

      const target = parseInt(el.dataset.target, 10);
      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();
