/* ============================================================
   CARD FLIP — click to toggle .flipped
   ============================================================ */
(function() {
  document.querySelectorAll('.card').forEach(card => {
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
})();
