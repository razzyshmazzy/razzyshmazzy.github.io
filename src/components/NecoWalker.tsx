'use client';

import { useEffect, useRef } from 'react';

const HEIGHT = 96;

const WALK_MIN_MS = 5000;
const WALK_MAX_MS = 12000;
const STAND_PAUSE_MIN_MS = 1000;
const STAND_PAUSE_MAX_MS = 2500;
const EMOTE_DURATION_MS = 3000;
const EMOTE_MIN_COUNT = 1;
const EMOTE_MAX_COUNT = 3;
const RUN_SPEED_MULT = 2.2;

const WALK_SRC = '/neco-walk.gif';
const STANDING_SRC = '/neco-stickers/neco-standing.webp';
const RUN_SRC = '/neco-stickers/neco-run.webp';

const EMOTE_SRCS = [
  '/neco-stickers/neco-dance.webp',
  '/neco-stickers/neco-dance-2.webp',
  '/neco-stickers/neco-dance-3.webp',
  '/neco-stickers/neco-hooray.webp',
  '/neco-stickers/neco-laugh.webp',
  '/neco-stickers/neco-scream.webp',
  '/neco-stickers/neco-shrug.webp',
  '/neco-stickers/neco-smart.webp',
  '/neco-stickers/neco-sulk.webp',
  '/neco-stickers/neco-whatever.webp',
  '/neco-stickers/neco-wine.webp',
  '/neco-stickers/neco-chill-2.webp',
  '/neco-stickers/neco-cmon.webp',
];

function randRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function randInt(min: number, max: number) {
  return Math.floor(randRange(min, max + 1));
}

export default function NecoWalker() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;
    const img: HTMLImageElement = imgRef.current;

    // ── her walking line = the quote divider's top border ──
    // Measured so her feet rest exactly on it (and stay there if the layout
    // reflows on resize). Both this element and .quote-divider share the same
    // positioned ancestor, so offsetTop is in the same coordinate space.
    function measureLine() {
      const divider = document.querySelector('.quote-divider') as HTMLElement | null;
      const top = divider ? divider.offsetTop : window.innerHeight;
      img.style.top = `${top - HEIGHT}px`;
    }
    measureLine();

    // ── state ──
    // Start ~20% in from the left edge rather than off-screen.
    let x = window.innerWidth * 0.2;
    let direction = 1;
    type Phase = 'walking' | 'standing' | 'emoting';
    let phase: Phase = 'walking';
    let rafId: number | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    let walkStartTime = performance.now();
    let walkStopAfter = randRange(WALK_MIN_MS, WALK_MAX_MS);
    let moveMode: 'walk' | 'run' = 'walk';
    let emotesRemaining = 0;
    let lastEmoteIndex = -1;

    const baseSpeed = () => (window.innerWidth + HEIGHT * 2) / (48 * 60);
    const moveSpeed = () => (moveMode === 'run' ? baseSpeed() * RUN_SPEED_MULT : baseSpeed());

    function applyTransform() {
      const scaleX = direction === -1 ? -1 : 1;
      img.style.transform = `translateX(${x}px) scaleX(${scaleX})`;
    }

    // Preload sticker images so emote/run transitions don't pop.
    [STANDING_SRC, RUN_SRC, ...EMOTE_SRCS].forEach((src) => {
      const preload = new Image();
      preload.src = src;
    });

    // rAF loop runs only while she's walking; standing/emoting are timer-driven.
    function startLoop() {
      if (rafId == null) rafId = requestAnimationFrame(tick);
    }

    function startIdleSequence() {
      phase = 'standing';
      img.src = STANDING_SRC;
      applyTransform();

      emotesRemaining = randInt(EMOTE_MIN_COUNT, EMOTE_MAX_COUNT);
      lastEmoteIndex = -1;

      timer = setTimeout(doNextEmote, randRange(STAND_PAUSE_MIN_MS, STAND_PAUSE_MAX_MS));
    }

    function doNextEmote() {
      if (emotesRemaining <= 0) {
        resumeMoving();
        return;
      }

      let idx;
      do {
        idx = randInt(0, EMOTE_SRCS.length - 1);
      } while (idx === lastEmoteIndex && EMOTE_SRCS.length > 1);
      lastEmoteIndex = idx;

      phase = 'emoting';
      img.src = EMOTE_SRCS[idx];
      applyTransform();
      emotesRemaining--;

      timer = setTimeout(() => {
        if (emotesRemaining > 0) {
          // Brief standing pause between emotes
          phase = 'standing';
          img.src = STANDING_SRC;
          applyTransform();
          timer = setTimeout(doNextEmote, randRange(500, 1200));
        } else {
          resumeMoving();
        }
      }, EMOTE_DURATION_MS);
    }

    function resumeMoving() {
      direction = Math.random() < 0.5 ? -1 : 1;
      moveMode = Math.random() < 0.35 ? 'run' : 'walk';
      img.src = moveMode === 'run' ? RUN_SRC : WALK_SRC;
      walkStartTime = performance.now();
      walkStopAfter = randRange(WALK_MIN_MS, WALK_MAX_MS);
      phase = 'walking';
      applyTransform();
      startLoop();
    }

    function tick() {
      if (phase === 'walking') {
        x += moveSpeed() * direction;
        if (direction === 1 && x > window.innerWidth + HEIGHT) x = -HEIGHT;
        if (direction === -1 && x < -HEIGHT) x = window.innerWidth + HEIGHT;
        applyTransform();

        // Random idle stop — only when fully on-screen
        if (
          x > 0 &&
          x < window.innerWidth &&
          performance.now() - walkStartTime > walkStopAfter
        ) {
          startIdleSequence();
        }
      }

      // Keep the loop alive only while she's walking.
      if (phase === 'walking') {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    }

    function onResize() {
      measureLine();
    }
    window.addEventListener('resize', onResize);

    applyTransform();
    startLoop();

    return () => {
      window.removeEventListener('resize', onResize);
      if (rafId != null) cancelAnimationFrame(rafId);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={WALK_SRC}
      alt=""
      aria-hidden="true"
      className="neco-walker"
      style={{ transform: 'translateX(-96px)' }}
    />
  );
}
