/* ============================================================
   CONNECT LINKS — Ripple
   ============================================================ */
function initConnectLinks() {
  document.querySelectorAll('.connect-link').forEach(link => {
    if (link.dataset.rippleInit === 'true') return;
    link.dataset.rippleInit = 'true';

    link.addEventListener('mouseenter', () => {
      link.classList.remove('ripple');
      void link.offsetWidth; // reflow
      link.classList.add('ripple');
    });
    link.addEventListener('animationend', () => {
      link.classList.remove('ripple');
    });
  });
}

document.addEventListener('astro:page-load', initConnectLinks);
