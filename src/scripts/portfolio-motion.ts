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
    .filter(el => !el.closest('[data-portfolio-motion-root], [data-detail-scroll-stage]'));
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

function initDetailScrollStage(root: ParentNode) {
  const stages = Array.from(root.querySelectorAll<HTMLElement>('[data-detail-scroll-stage]'));
  if (!stages.length) return;

  const cleanupsForStages: Cleanup[] = [];

  stages.forEach(stage => {
    const copyViewport = stage.querySelector<HTMLElement>('.detail-copy-viewport');
    const copy = stage.querySelector<HTMLElement>('[data-detail-copy]');
    const media = stage.querySelector<HTMLElement>('[data-detail-preview-media]');
    if (!copyViewport || !copy || !media) return;

    let frame = 0;

    const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const easeInOut = (value: number) => {
      const t = clamp(value);
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;

    const update = () => {
      frame = 0;

      if (window.matchMedia('(max-width: 1100px), (max-height: 680px)').matches) {
        stage.style.removeProperty('--detail-stage-height');
        stage.style.removeProperty('--detail-preview-left');
        stage.style.removeProperty('--detail-preview-width');
        stage.style.removeProperty('--detail-copy-y');
        stage.dataset.detailPreviewReady = 'true';
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const copyScrollDistance = Math.max(0, copy.scrollHeight - copyViewport.clientHeight);
      const slotDistance = viewportHeight * 1.05;
      const copyDistance = Math.max(copyScrollDistance, viewportHeight * 0.9);
      const stageHeight = viewportHeight + slotDistance + copyDistance;
      stage.style.setProperty('--detail-stage-height', `${Math.round(stageHeight)}px`);

      const rect = stage.getBoundingClientRect();
      const scrollDistance = Math.max(1, stageHeight - viewportHeight);
      const progress = clamp(-rect.top / scrollDistance);
      const slotStart = 0.18;
      const slotEnd = 0.46;
      const slotProgress = easeInOut((progress - slotStart) / (slotEnd - slotStart));
      const copyProgress = clamp((progress - slotEnd) / (1 - slotEnd));
      const initialWidth = Math.min(viewportWidth * 0.72, viewportHeight * 1.42, 1040);
      const finalWidth = Math.min(viewportWidth * 0.54, viewportHeight * 1.22, 920);
      const finalLeft = viewportWidth - 14 - finalWidth / 2;
      const left = mix(viewportWidth / 2, finalLeft, slotProgress);
      const width = mix(initialWidth, finalWidth, slotProgress);

      stage.style.setProperty('--detail-preview-left', `${left.toFixed(1)}px`);
      stage.style.setProperty('--detail-preview-width', `${width.toFixed(1)}px`);
      stage.style.setProperty('--detail-copy-y', `${Math.round(-copyScrollDistance * copyProgress)}px`);
      stage.style.setProperty('--detail-copy-opacity', String(clamp((slotProgress - 0.62) / 0.24)));
      stage.dataset.detailPreviewReady = slotProgress > 0.7 ? 'true' : 'false';
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    cleanupsForStages.push(() => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    });
  });

  addCleanup(() => cleanupsForStages.forEach(cleanup => cleanup()));
}

export function initPortfolioMotion(root: ParentNode = document) {
  cleanupPortfolioMotion();

  const hasMotionRoot = root.querySelector('[data-portfolio-motion-root]');
  const hasMotionCards = root.querySelector('[data-motion-card]');
  const hasDetailScrollStage = root.querySelector('[data-detail-scroll-stage]');
  const hasRevealCandidates = getRevealCandidates(root).length > 0;
  if (!hasMotionRoot && !hasMotionCards && !hasDetailScrollStage && !hasRevealCandidates) return;

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
  initDetailScrollStage(root);
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:before-swap', cleanupPortfolioMotion);
  document.addEventListener('astro:page-load', () => initPortfolioMotion());
}
