/* ============================================================
   CONNECT LINKS — Ripple
   ============================================================ */
(function() {
  document.querySelectorAll('.connect-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.classList.remove('ripple');
      void link.offsetWidth; // reflow
      link.classList.add('ripple');
    });
    link.addEventListener('animationend', () => {
      link.classList.remove('ripple');
    });
  });
})();
