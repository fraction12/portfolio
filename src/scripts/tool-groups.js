/* ============================================================
   TOOL GROUPS — collapsible sections with scroll-triggered expand
   • Click header to toggle.
   • IntersectionObserver auto-expands once when the header scrolls
     into view. No collapse on scroll-out.
   • Respects prefers-reduced-motion (state toggles, transitions are
     suppressed via CSS media query).
   ============================================================ */

function initToolGroups() {
  const groups = document.querySelectorAll('[data-tool-group]');
  if (!groups.length) return;

  function expand(group) {
    if (group.dataset.expanded === 'true') return;
    group.dataset.expanded = 'true';
    const toggle = group.querySelector('[data-tool-group-toggle]');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }

  function collapse(group) {
    group.dataset.expanded = 'false';
    const toggle = group.querySelector('[data-tool-group-toggle]');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  groups.forEach(group => {
    if (group.dataset.tgInit === 'true') return;
    group.dataset.tgInit = 'true';

    const toggle = group.querySelector('[data-tool-group-toggle]');
    toggle?.addEventListener('click', () => {
      if (group.dataset.expanded === 'true') collapse(group);
      else expand(group);
    });
  });

  // Auto-expand the first group immediately so there's visible content
  // without requiring a scroll.
  if (groups[0]) expand(groups[0]);

  // Auto-expand each subsequent group once when its header comes into view.
  if (!('IntersectionObserver' in window)) {
    // Fallback: expand everything.
    groups.forEach(expand);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        expand(entry.target);
        io.unobserve(entry.target);
      }
    }
  }, {
    rootMargin: '0px 0px -20% 0px',
    threshold: 0.1
  });

  groups.forEach((group, i) => {
    if (i === 0) return; // first is already expanded
    io.observe(group);
  });
}

document.addEventListener('astro:page-load', initToolGroups);
