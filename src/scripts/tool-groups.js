/* ============================================================
   TOOL GROUPS — collapsible sections driven by scroll position
   • IntersectionObserver expands a group whenever any part of it
     is in the viewport and collapses it once it's fully above
     or below. Scrolling back reopens it.
   • Changes that happen ENTIRELY above the viewport are applied
     without animation and compensate scrollY by the height delta,
     so the user's visible content stays anchored.
   • Click toggles manually. A manual click pins the state for
     ~800ms so a concurrent IO callback doesn't undo the tap.
   • Respects prefers-reduced-motion via CSS (transitions drop
     to none while the dataset state still toggles).
   ============================================================ */

function initToolGroups() {
  const groups = document.querySelectorAll('[data-tool-group]');
  if (!groups.length) return;

  // Flip expanded state. If the group is entirely above the viewport,
  // do it without animation and adjust scrollY so the visible content
  // below doesn't jump.
  function setExpanded(group, next) {
    const current = group.dataset.expanded === 'true';
    if (current === next) return;

    const rect = group.getBoundingClientRect();
    const entirelyAbove = rect.bottom < 0;

    if (entirelyAbove) {
      group.classList.add('tg-no-anim');
      // Force layout to get an accurate "before" height after the
      // class addition lands.
      const before = group.offsetHeight;
      group.dataset.expanded = next ? 'true' : 'false';
      const after = group.offsetHeight;
      const delta = after - before;
      if (delta !== 0) window.scrollBy(0, delta);
      requestAnimationFrame(() => group.classList.remove('tg-no-anim'));
    } else {
      group.dataset.expanded = next ? 'true' : 'false';
    }

    const toggle = group.querySelector('[data-tool-group-toggle]');
    toggle?.setAttribute('aria-expanded', String(next));
  }

  // Manual clicks pin briefly so a concurrent IO event can't flip state.
  function pinForManualClick(group) {
    group.dataset.tgPinned = String(Date.now() + 800);
  }
  function isPinned(group) {
    return Date.now() < Number(group.dataset.tgPinned || 0);
  }

  groups.forEach(group => {
    if (group.dataset.tgInit === 'true') return;
    group.dataset.tgInit = 'true';

    const toggle = group.querySelector('[data-tool-group-toggle]');
    toggle?.addEventListener('click', () => {
      pinForManualClick(group);
      setExpanded(group, group.dataset.expanded !== 'true');
    });
  });

  if (!('IntersectionObserver' in window)) {
    groups.forEach(g => setExpanded(g, true));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (isPinned(entry.target)) continue;
      setExpanded(entry.target, entry.isIntersecting);
    }
  }, {
    rootMargin: '-5% 0px -5% 0px',
    threshold: 0
  });

  groups.forEach(g => io.observe(g));
}

document.addEventListener('astro:page-load', initToolGroups);
