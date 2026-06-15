import { animate, stagger } from 'motion';

type MotionControl = {
  stop?: () => void;
  cancel?: () => void;
};

type Cleanup = () => void;

let cleanups: Cleanup[] = [];
let revealObserver: IntersectionObserver | undefined;

const REVEAL_SELECTOR = [
  '.page-header',
  '.page-split',
  '.section-split',
  '.catalog-section',
  '.detail-hero',
  '.detail-section',
  '.not-found-shell',
  '[data-motion-card]',
  '[data-motion-reveal]',
].join(',');

export function prefersReducedMotion(win: Pick<Window, 'matchMedia'> = window): boolean {
  return typeof win.matchMedia === 'function'
    && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function cleanupPortfolioMotion() {
  cleanups.forEach(cleanup => cleanup());
  cleanups = [];
}

function addCleanup(cleanup: Cleanup) {
  cleanups.push(cleanup);
}

function stopControl(control: MotionControl | undefined) {
  control?.stop?.();
  control?.cancel?.();
}

function motionAnimate(target: unknown, keyframes: Record<string, unknown>, options?: Record<string, unknown>): MotionControl {
  return animate(target as never, keyframes as never, options as never) as MotionControl;
}

function markReady(root: ParentNode) {
  root.querySelectorAll<HTMLElement>('[data-motion-item], [data-motion-card], [data-motion-reveal]')
    .forEach(el => {
      el.dataset.motionReady = 'true';
    });
}

export function getRevealCandidates(root: ParentNode = document): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR))
    .filter(el => !el.closest('[data-portfolio-motion-root]'));
}

function markRevealCandidates(root: ParentNode) {
  getRevealCandidates(root).forEach((el, index) => {
    el.dataset.motionReveal = 'pending';
    el.style.setProperty('--motion-reveal-index', String(index));
  });
}

function initHeroEntrance(root: ParentNode) {
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-motion-item]'));
  const activityDays = Array.from(root.querySelectorAll<HTMLElement>('[data-github-activity-day]'));
  const controls: MotionControl[] = [];

  if (items.length) {
    controls.push(motionAnimate(items, { opacity: [0.86, 1], y: [8, 0] }, {
      duration: 0.42,
      delay: stagger(0.075),
      easing: [0.22, 1, 0.36, 1],
    }));
  }

  if (activityDays.length) {
    controls.push(motionAnimate(activityDays, { opacity: [0.72, 1], scale: [0.96, 1] }, {
      duration: 0.18,
      delay: stagger(0.003, { startDelay: 0.22 }),
      easing: [0.22, 1, 0.36, 1],
    }));
  }

  addCleanup(() => controls.forEach(stopControl));
}

function initGithubActivityPulse(root: ParentNode) {
  const activityDays = Array.from(root.querySelectorAll<HTMLElement>('[data-github-activity-day]'));
  if (!activityDays.length) return;

  const pulse = motionAnimate(activityDays, {
    opacity: [1, 0.64, 1],
    scale: [1, 0.92, 1],
  }, {
    duration: 1.8,
    delay: stagger(0.01, { from: 'last' }),
    repeat: Infinity,
    repeatDelay: 1.2,
    easing: 'ease-in-out',
  });

  addCleanup(() => stopControl(pulse));
}

function initCards(root: ParentNode) {
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-motion-card]'));
  const controls = new WeakMap<HTMLElement, MotionControl>();

  const setActive = (card: HTMLElement, active: boolean) => {
    stopControl(controls.get(card));
    controls.set(card, motionAnimate(card, {
      y: active ? -4 : 0,
      scale: active ? 1.006 : 1,
    }, {
      duration: 0.22,
      easing: [0.22, 1, 0.36, 1],
    }));

    const proof = card.querySelector<HTMLElement>('[data-motion-proof]');
    if (proof) {
      motionAnimate(proof, {
        opacity: active ? 1 : 0.84,
        y: active ? -1 : 0,
      }, {
        duration: 0.18,
        easing: 'ease-out',
      });
    }
  };

  cards.forEach(card => {
    const onEnter = () => setActive(card, true);
    const onLeave = () => setActive(card, false);
    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointerleave', onLeave);
    card.addEventListener('focusin', onEnter);
    card.addEventListener('focusout', onLeave);
    addCleanup(() => {
      stopControl(controls.get(card));
      card.removeEventListener('pointerenter', onEnter);
      card.removeEventListener('pointerleave', onLeave);
      card.removeEventListener('focusin', onEnter);
      card.removeEventListener('focusout', onLeave);
    });
  });
}

function initScrollFade(root: ParentNode) {
  const reveals = getRevealCandidates(root);
  if (!reveals.length) return;

  if (typeof window.IntersectionObserver !== 'function') {
    reveals.forEach(el => {
      el.dataset.motionReveal = 'visible';
    });
    return;
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target as HTMLElement;
      const index = Number.parseInt(el.style.getPropertyValue('--motion-reveal-index') || '0', 10);
      revealObserver?.unobserve(el);
      el.dataset.motionReveal = 'visible';

      const reveal = motionAnimate(el, {
        opacity: [0, 1],
        y: [18, 0],
        filter: ['blur(6px)', 'blur(0px)'],
      }, {
        duration: 0.52,
        delay: Math.min(index % 4, 3) * 0.035,
        easing: [0.22, 1, 0.36, 1],
      });

      addCleanup(() => stopControl(reveal));
    });
  }, {
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.08,
  });

  reveals.forEach(el => revealObserver?.observe(el));
  addCleanup(() => {
    revealObserver?.disconnect();
    revealObserver = undefined;
  });
}

export function initPortfolioMotion(root: ParentNode = document) {
  cleanupPortfolioMotion();

  const hasMotionRoot = root.querySelector('[data-portfolio-motion-root]');
  const hasMotionCards = root.querySelector('[data-motion-card]');
  const hasRevealCandidates = getRevealCandidates(root).length > 0;
  if (!hasMotionRoot && !hasMotionCards && !hasRevealCandidates) return;

  markRevealCandidates(root);
  markReady(root);

  if (prefersReducedMotion()) {
    document.documentElement.dataset.portfolioMotion = 'reduced';
    getRevealCandidates(root).forEach(el => {
      el.dataset.motionReveal = 'visible';
    });
    return;
  }

  document.documentElement.dataset.portfolioMotion = 'enhanced';
  initHeroEntrance(root);
  initScrollFade(root);
  initGithubActivityPulse(root);
  initCards(root);
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:before-swap', cleanupPortfolioMotion);
  document.addEventListener('astro:page-load', () => initPortfolioMotion());
}
