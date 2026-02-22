/* ============================================================
   CURSOR GLOW
   ============================================================ */
(function() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;
  let raf;
  let tx = -999, ty = -999;
  let cx = -999, cy = -999;

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!raf) raf = requestAnimationFrame(render);
  });

  function render() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    glow.style.setProperty('--cx', cx + 'px');
    glow.style.setProperty('--cy', cy + 'px');
    raf = requestAnimationFrame(render);
  }
})();
