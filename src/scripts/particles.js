/* ============================================================
   FLOATING PARTICLES — Featured Card
   ============================================================ */
(function() {
  const visual = document.querySelector('.card-visual');
  if (!visual) return;

  const count = 12;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = 3 + Math.random() * 4;
    const dur = 3 + Math.random() * 4;
    const delay = Math.random() * dur;
    const tx = (Math.random() - 0.5) * 120;
    const ty = -(30 + Math.random() * 80);
    const startX = 20 + Math.random() * 60;
    const startY = 20 + Math.random() * 60;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${startX}%;
      top: ${startY}%;
      --dur: ${dur}s;
      --delay: ${delay}s;
      --tx: ${tx}px;
      --ty: ${ty}px;
      opacity: 0;
    `;
    p.style.animationDelay = `${delay}s`;
    p.style.animationDuration = `${dur}s`;
    visual.appendChild(p);
  }
})();
