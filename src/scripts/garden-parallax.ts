/*
 * Moves the cover garden's painted layers with the pointer. Each layer reads
 * --gx / --gy (in [-1, 1]) and multiplies them by its own travel in CSS, so
 * this only eases two numbers toward the pointer. It idles when the pointer is
 * still and pauses while the window is off screen. Returns a stop function.
 */
export function initGardenParallax(pane: HTMLElement): () => void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  let targetX = 0;
  let targetY = 0;
  let x = 0;
  let y = 0;
  let frame = 0;
  let visible = true;

  const step = () => {
    frame = 0;
    x += (targetX - x) * 0.06;
    y += (targetY - y) * 0.06;
    pane.style.setProperty('--gx', x.toFixed(4));
    pane.style.setProperty('--gy', y.toFixed(4));
    if (visible && (Math.abs(targetX - x) > 0.001 || Math.abs(targetY - y) > 0.001)) {
      frame = requestAnimationFrame(step);
    }
  };

  const onMove = (event: PointerEvent) => {
    // Move against the pointer, so near layers slide past far ones like a real window.
    targetX = -((event.clientX / window.innerWidth) * 2 - 1);
    targetY = -((event.clientY / window.innerHeight) * 2 - 1);
    if (!frame && visible) frame = requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? true;
    if (visible && !frame) frame = requestAnimationFrame(step);
  });
  observer.observe(pane);
  window.addEventListener('pointermove', onMove, { passive: true });

  return () => {
    window.removeEventListener('pointermove', onMove);
    observer.disconnect();
    if (frame) cancelAnimationFrame(frame);
  };
}
