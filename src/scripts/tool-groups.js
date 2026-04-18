/* ============================================================
   TOOL GROUPS — collapsible sections driven by scroll position
   • IntersectionObserver expands a group whenever any part of it
     is in the viewport and collapses it once it scrolls fully
     out of view (above or below). Scrolling back reopens it.
   • Click toggles manually — useful for keyboard users or anyone
     who wants to override the scroll behavior. Manual clicks hold
     for ~800ms against the next IO event so a tap doesn't get
     undone by an in-flight callback.
   • Respects prefers-reduced-motion (state still toggles; CSS
     suppresses the transitions).
   ============================================================ */

function initToolGroups() {
  const groups = document.querySelectorAll('[data-tool-group]');
  if (!groups.length) return;

  function expand(group) {
    if (group.dataset.expanded === 'true') return;
    group.dataset.expanded = 'true';
    const toggle = group.querySelector('[data-tool-group-toggle]');
    toggle?.setAttribute('aria-expanded', 'true');
  }

  function collapse(group) {
    if (group.dataset.expanded !== 'true') return;
    group.dataset.expanded = 'false';
    const toggle = group.querySelector('[data-tool-group-toggle]');
    toggle?.setAttribute('aria-expanded', 'false');
  }

  // Manual clicks pin a group's state briefly so a concurrent IO
  // event doesn't immediately flip it back.
  function pinForManualClick(group) {
    group.dataset.tgPinned = String(Date.now() + 800);
  }
  function isPinned(group) {
    const until = Number(group.dataset.tgPinned || 0);
    return Date.now() < until;
  }

  groups.forEach(group => {
    if (group.dataset.tgInit === 'true') return;
    group.dataset.tgInit = 'true';

    const toggle = group.querySelector('[data-tool-group-toggle]');
    toggle?.addEventListener('click', () => {
      pinForManualClick(group);
      if (group.dataset.expanded === 'true') collapse(group);
      else expand(group);
    });
  });

  if (!('IntersectionObserver' in window)) {
    // Fallback: just expand everything so content is reachable.
    groups.forEach(expand);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (isPinned(entry.target)) continue;
      if (entry.isIntersecting) expand(entry.target);
      else collapse(entry.target);
    }
  }, {
    // Slight vertical inset so expand/collapse triggers shortly
    // before/after the group fully leaves the visible area.
    rootMargin: '-5% 0px -5% 0px',
    threshold: 0
  });

  groups.forEach(g => io.observe(g));
}

document.addEventListener('astro:page-load', initToolGroups);
