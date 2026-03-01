/* ============================================================
   CARD MOUSE TRACKING (glassmorphism glow)
   ============================================================ */
function initCardTracking() {
  document.querySelectorAll('.card').forEach(card => {
    if (card.dataset.trackingInit === 'true') return;
    card.dataset.trackingInit = 'true';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });
  });
}

document.addEventListener('astro:page-load', initCardTracking);
