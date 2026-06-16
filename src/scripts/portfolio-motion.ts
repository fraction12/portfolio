import { animate, stagger } from 'motion';

type MotionControl = {
  stop?: () => void;
  cancel?: () => void;
};

type Cleanup = () => void;

let cleanups: Cleanup[] = [];
let revealObserver: IntersectionObserver | undefined;

type DetailPreviewLayoutInput = {
  viewportWidth: number;
  viewportHeight: number;
  copyRight: number;
};

export function getDetailPreviewLayout({
  viewportWidth,
  viewportHeight,
  copyRight,
}: DetailPreviewLayoutInput): { width: number; left: number } {
  const rightMargin = Math.max(14, Math.min(48, viewportWidth * 0.03));
  const copyGap = Math.max(36, Math.min(72, viewportWidth * 0.035));
  const availableWidth = viewportWidth - rightMargin - copyRight - copyGap;
  const width = Math.min(
    viewportWidth * 0.54,
    viewportHeight * 1.22,
    920,
    Math.max(280, availableWidth),
  );

  return {
    width,
    left: viewportWidth - rightMargin - width / 2,
  };
}

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
  root.querySelectorAll<HTMLElement>('[data-motion-item], [data-motion-card], [data-motion-reveal], [data-home-work-slot], [data-home-scroll-slot], [data-writing-list], [data-writing-row]')
    .forEach(el => {
      el.dataset.motionReady = 'true';
    });
}

export function getRevealCandidates(root: ParentNode = document): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR))
    .filter(el => !el.closest('[data-portfolio-motion-root], [data-detail-scroll-stage], [data-home-work-section]'));
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

function initNavMagneticField(root: ParentNode) {
  const nav = root.querySelector<HTMLElement>('.top-nav');
  const field = root.querySelector<HTMLElement>('[data-nav-field]');
  if (!nav || !field) return;

  const marks = Array.from(field.querySelectorAll<HTMLElement>('[data-nav-field-dot]')).map((el, index) => ({
    el,
    index,
    x: Number(el.dataset.x || 0),
    y: Number(el.dataset.y || 0),
    opacity: Number(el.dataset.opacity || 0.12),
    offsetX: 0,
    offsetY: 0,
    glow: 0,
    scale: 1,
  }));
  if (!marks.length) return;

  const fieldOpacity = Number.parseFloat(window.getComputedStyle(field).opacity || '0.82') || 0.82;
  const reveal = motionAnimate(field, {
    opacity: [0, fieldOpacity],
  }, {
    duration: 0.7,
    delay: 0.1,
    easing: 'ease-out',
  });

  let frame = 0;
  let fieldRect = field.getBoundingClientRect();
  let pointerX = fieldRect.width * 0.58;
  let pointerY = fieldRect.height * 0.38;
  let targetX = pointerX;
  let targetY = pointerY;
  let hasPointer = false;
  let exclusionRects: Array<{ left: number; top: number; right: number; bottom: number }> = [];

  const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  const measure = () => {
    fieldRect = field.getBoundingClientRect();
    exclusionRects = Array.from(nav.querySelectorAll<HTMLElement>('.top-nav__brand, .top-nav__links'))
      .map(el => {
        const rect = el.getBoundingClientRect();
        const pad = 10;
        return {
          left: rect.left - fieldRect.left - pad,
          top: rect.top - fieldRect.top - pad,
          right: rect.right - fieldRect.left + pad,
          bottom: rect.bottom - fieldRect.top + pad,
        };
      });
  };

  const updatePointer = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    hasPointer = true;
    targetX = event.clientX - fieldRect.left;
    targetY = event.clientY - fieldRect.top;
  };

  const clearPointer = () => {
    hasPointer = false;
  };

  const render = (time = performance.now()) => {
    pointerX += (targetX - pointerX) * 0.08;
    pointerY += (targetY - pointerY) * 0.08;

    marks.forEach(mark => {
      const markX = fieldRect.width * mark.x / 100;
      const markY = fieldRect.height * mark.y / 100;
      const dx = pointerX - markX;
      const dy = pointerY - markY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const radius = Math.min(180, Math.max(110, fieldRect.width * 0.12));
      const influence = hasPointer ? clamp(1 - distance / radius) : 0;
      const attraction = influence * influence;
      const ambientX = Math.sin(time * 0.00022 + mark.index * 0.19) * 0.25;
      const ambientY = Math.cos(time * 0.00018 + mark.index * 0.13) * 0.3;
      const targetOffsetX = dx * attraction * 0.42;
      const targetOffsetY = dy * attraction * 0.42;
      const targetGlow = attraction;
      const targetScale = 1 + attraction * 1.75;

      mark.offsetX += (targetOffsetX - mark.offsetX) * 0.075;
      mark.offsetY += (targetOffsetY - mark.offsetY) * 0.075;
      mark.glow += (targetGlow - mark.glow) * 0.08;
      mark.scale += (targetScale - mark.scale) * 0.08;

      const driftY = ambientY;
      const currentX = markX + ambientX + mark.offsetX;
      const currentY = markY + driftY + mark.offsetY;
      const isExcluded = exclusionRects.some(rect => (
        currentX >= rect.left
        && currentX <= rect.right
        && currentY >= rect.top
        && currentY <= rect.bottom
      ));
      const opacity = isExcluded ? 0 : mark.opacity + mark.glow * 0.62;

      mark.el.style.opacity = opacity.toFixed(3);
      mark.el.style.transform = `translate3d(calc(-50% + ${(ambientX + mark.offsetX).toFixed(2)}px), calc(-50% + ${(driftY + mark.offsetY).toFixed(2)}px), 0) scale(${mark.scale.toFixed(3)})`;
    });

    frame = window.requestAnimationFrame(render);
  };

  measure();
  frame = window.requestAnimationFrame(render);

  window.addEventListener('pointermove', updatePointer, { passive: true });
  window.addEventListener('pointerleave', clearPointer);
  window.addEventListener('blur', clearPointer);
  window.addEventListener('resize', measure);

  addCleanup(() => {
    stopControl(reveal);
    if (frame) window.cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', updatePointer);
    window.removeEventListener('pointerleave', clearPointer);
    window.removeEventListener('blur', clearPointer);
    window.removeEventListener('resize', measure);
  });
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
        x: [-34, 0],
        filter: ['blur(5px)', 'blur(0px)'],
      }, {
        duration: 0.62,
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

function initHomeWorkSlots(root: ParentNode) {
  const section = root.querySelector<HTMLElement>('[data-home-work-section]');
  if (!section) return;

  const slots = Array.from(section.querySelectorAll<HTMLElement>('[data-home-work-slot]'));
  if (!slots.length) return;

  slots.forEach(slot => {
    slot.dataset.homeWorkSlot = 'pending';
  });

  const frame = window.requestAnimationFrame(() => {
    slots.forEach((slot, index) => {
      slot.dataset.homeWorkSlot = 'visible';

      const reveal = motionAnimate(slot, {
        opacity: [0, 1],
        x: [-34, 0],
        filter: ['blur(5px)', 'blur(0px)'],
      }, {
        duration: 0.62,
        delay: 0.28 + index * 0.085,
        easing: [0.22, 1, 0.36, 1],
      });

      addCleanup(() => stopControl(reveal));
    });
  });

  addCleanup(() => window.cancelAnimationFrame(frame));
}

function initHomeScrollSlots(root: ParentNode) {
  const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-home-scroll-section]'));
  if (!sections.length) return;

  const slots = sections.flatMap(section => (
    Array.from(section.querySelectorAll<HTMLElement>('[data-home-scroll-slot]'))
  ));
  if (!slots.length) return;

  if (typeof window.IntersectionObserver !== 'function') {
    slots.forEach(slot => {
      slot.dataset.homeScrollSlot = 'visible';
    });
    return;
  }

  slots.forEach(slot => {
    slot.dataset.homeScrollSlot = 'pending';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const section = entry.target as HTMLElement;
      observer.unobserve(section);

      const sectionSlots = Array.from(section.querySelectorAll<HTMLElement>('[data-home-scroll-slot]'));
      sectionSlots.forEach((slot, index) => {
        slot.dataset.homeScrollSlot = 'visible';

        const reveal = motionAnimate(slot, {
          opacity: [0, 1],
          x: [-34, 0],
          filter: ['blur(5px)', 'blur(0px)'],
        }, {
          duration: 0.62,
          delay: index * 0.085,
          easing: [0.22, 1, 0.36, 1],
        });

        addCleanup(() => stopControl(reveal));
      });
    });
  }, {
    rootMargin: '0px 0px -18% 0px',
    threshold: 0.12,
  });

  sections.forEach(section => observer.observe(section));
  addCleanup(() => observer.disconnect());
}

function initWritingListSlots(root: ParentNode) {
  const lists = Array.from(root.querySelectorAll<HTMLElement>('[data-writing-list]'));
  if (!lists.length) return;

  const setVisible = (list: HTMLElement) => {
    const rows = Array.from(list.querySelectorAll<HTMLElement>('[data-writing-row]'));
    const slots = [list, ...rows];

    slots.forEach((slot, index) => {
      slot.dataset.writingMotion = 'visible';

      const reveal = motionAnimate(slot, {
        opacity: [0, 1],
        x: [-34, 0],
        filter: ['blur(5px)', 'blur(0px)'],
      }, {
        duration: 0.62,
        delay: index * 0.045,
        easing: [0.22, 1, 0.36, 1],
      });

      addCleanup(() => stopControl(reveal));
    });
  };

  lists.forEach(list => {
    list.dataset.writingMotion = 'pending';
    list.querySelectorAll<HTMLElement>('[data-writing-row]').forEach(row => {
      row.dataset.writingMotion = 'pending';
    });
  });

  if (typeof window.IntersectionObserver !== 'function') {
    lists.forEach(setVisible);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const list = entry.target as HTMLElement;
      observer.unobserve(list);
      setVisible(list);
    });
  }, {
    rootMargin: '0px 0px -14% 0px',
    threshold: 0.08,
  });

  lists.forEach(list => observer.observe(list));
  addCleanup(() => observer.disconnect());
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
      const finalLayout = getDetailPreviewLayout({
        viewportWidth,
        viewportHeight,
        copyRight: copyViewport.getBoundingClientRect().right,
      });
      const finalWidth = finalLayout.width;
      const finalLeft = finalLayout.left;
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
  const hasNavField = root.querySelector('[data-nav-field]');
  const hasMotionCards = root.querySelector('[data-motion-card]');
  const hasDetailScrollStage = root.querySelector('[data-detail-scroll-stage]');
  const hasHomeWorkSlots = root.querySelector('[data-home-work-slot]');
  const hasHomeScrollSlots = root.querySelector('[data-home-scroll-slot]');
  const hasWritingListSlots = root.querySelector('[data-writing-list]');
  const hasRevealCandidates = getRevealCandidates(root).length > 0;
  if (!hasMotionRoot && !hasNavField && !hasMotionCards && !hasDetailScrollStage && !hasHomeWorkSlots && !hasHomeScrollSlots && !hasWritingListSlots && !hasRevealCandidates) return;

  markRevealCandidates(root);
  markReady(root);

  if (prefersReducedMotion()) {
    document.documentElement.dataset.portfolioMotion = 'reduced';
    getRevealCandidates(root).forEach(el => {
      el.dataset.motionReveal = 'visible';
    });
    root.querySelectorAll<HTMLElement>('[data-home-work-slot]').forEach(el => {
      el.dataset.homeWorkSlot = 'visible';
    });
    root.querySelectorAll<HTMLElement>('[data-home-scroll-slot]').forEach(el => {
      el.dataset.homeScrollSlot = 'visible';
    });
    root.querySelectorAll<HTMLElement>('[data-writing-list], [data-writing-row]').forEach(el => {
      el.dataset.writingMotion = 'visible';
    });
    return;
  }

  document.documentElement.dataset.portfolioMotion = 'enhanced';
  initNavMagneticField(root);
  initHeroEntrance(root);
  initScrollFade(root);
  initHomeWorkSlots(root);
  initHomeScrollSlots(root);
  initWritingListSlots(root);
  initGithubActivityPulse(root);
  initCards(root);
  initDetailScrollStage(root);
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:before-swap', cleanupPortfolioMotion);
  document.addEventListener('astro:page-load', () => initPortfolioMotion());
}
