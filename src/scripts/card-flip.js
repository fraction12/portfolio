/* ============================================================
   CARD FLIP — click to toggle .flipped
   ============================================================ */
function initCardFlip() {
  document.querySelectorAll('.card').forEach(card => {
    if (card.dataset.flipInit === 'true') return;
    card.dataset.flipInit = 'true';

    card.addEventListener('click', (e) => {
      // Don't flip when clicking links inside the card
      if (e.target.closest('a')) return;
      card.classList.toggle('flipped');
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
}

document.addEventListener('astro:page-load', initCardFlip);
