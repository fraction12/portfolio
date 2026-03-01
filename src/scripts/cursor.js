/* ============================================================
   CURSOR GLOW
   ============================================================ */
let glowEl = null;
let raf = 0;
let tx = -999;
let ty = -999;
let cx = -999;
let cy = -999;
let cursorBound = false;

function renderCursorGlow() {
  if (!glowEl) {
    raf = 0;
    return;
  }

  cx += (tx - cx) * 0.12;
  cy += (ty - cy) * 0.12;
  glowEl.style.setProperty('--cx', `${cx}px`);
  glowEl.style.setProperty('--cy', `${cy}px`);
  raf = requestAnimationFrame(renderCursorGlow);
}

function onCursorMove(e) {
  tx = e.clientX;
  ty = e.clientY;
  if (!raf) raf = requestAnimationFrame(renderCursorGlow);
}

function initCursorGlow() {
  glowEl = document.getElementById('cursor-glow');
  if (!glowEl) return;
  if (cursorBound) return;

  cursorBound = true;
  document.addEventListener('mousemove', onCursorMove);
}

document.addEventListener('astro:page-load', initCursorGlow);
