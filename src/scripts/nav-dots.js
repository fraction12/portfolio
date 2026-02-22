/* ============================================================
   NAVIGATION DOTS — Active Section Tracking
   ============================================================ */
(function() {
  const dots = document.querySelectorAll('.nav-dot');
  const sectionIds = Array.from(dots).map(d => d.dataset.target);
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dots.forEach(dot => {
          dot.classList.toggle('active', dot.dataset.target === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
})();
