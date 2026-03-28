'use client';

import { useEffect, useRef } from 'react';
import { parseGIF, decompressFrames } from 'gifuct-js';
import type { ParsedFrame } from 'gifuct-js';

const HEIGHT = 96;
const FALL_HEIGHT = 300;
const STARE_MS = 3000;
const DRAG_Z = 9999;
const NORMAL_Z = 3;
const MIN_FALL_DURATION = 200;
const G_PX_PER_MS2 = 0.002;
const RESCAN_INTERVAL = 5;

const WALK_MIN_MS = 5000;
const WALK_MAX_MS = 12000;
const STAND_PAUSE_MIN_MS = 1000;
const STAND_PAUSE_MAX_MS = 2500;
const EMOTE_DURATION_MS = 3000;
const EMOTE_MIN_COUNT = 1;
const EMOTE_MAX_COUNT = 3;
const RUN_SPEED_MULT = 2.2;

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imgRef.current || !canvasRef.current) return;
    const img: HTMLImageElement = imgRef.current;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx = canvas.getContext('2d')!;

    const basePageY = img.getBoundingClientRect().top + window.scrollY;

    // ── state ──
    let x = -HEIGHT;
    let fallY = 0;
    let direction = 1;
    type Phase = 'idle' | 'walking' | 'standing' | 'emoting' | 'falling' | 'staring' | 'dragging';
    let phase: Phase = 'idle';
    let isAnimating = false;
    let scrollFallDone = false;
    let rafId: number;
    let stareTimer: ReturnType<typeof setTimeout> | null = null;
    let lastCursorX = 0;

    // idle sequence state
    let walkStartTime = 0;
    let walkStopAfter = randRange(WALK_MIN_MS, WALK_MAX_MS);
    let moveMode: 'walk' | 'run' = 'walk';
    let emotesRemaining = 0;
    let lastEmoteIndex = -1;

    // drag state
    let grabOffsetX = 0;
    let grabOffsetY = 0;

    // fall animation state
    let fallStartY = 0;
    let fallDistance = 0;
    let fallDuration = 0;
    let fallStartTime = 0;
    let fallFrameOffset = 0;
    let rescanCounter = 0;

    // surface tracking
    let targetSurface: Element | null = null;
    let landedSurface: Element | null = null;

    // gif frame data
    let gifFrames: ParsedFrame[] = [];
    let gifWidth = 0;
    let gifHeight = 0;
    let compositeFrames: ImageData[] = [];

    const baseSpeed = () => (window.innerWidth + HEIGHT * 2) / (48 * 60);
    const moveSpeed = () => moveMode === 'run' ? baseSpeed() * RUN_SPEED_MULT : baseSpeed();

    // Preload sticker images for smooth transitions
    [STANDING_SRC, RUN_SRC, ...EMOTE_SRCS].forEach(src => {
      const preload = new Image();
      preload.src = src;
    });

    // ── decode gif frames ──
    fetch('/neco-falling.gif')
      .then(r => r.arrayBuffer())
      .then(buf => {
        const parsed = parseGIF(buf);
        gifFrames = decompressFrames(parsed, true);
        gifWidth = parsed.lsd.width;
        gifHeight = parsed.lsd.height;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = gifWidth;
        tempCanvas.height = gifHeight;
        const tempCtx = tempCanvas.getContext('2d')!;

        for (let i = 0; i < gifFrames.length; i++) {
          const frame = gifFrames[i];
          if (i > 0) {
            const prev = gifFrames[i - 1];
            if (prev.disposalType === 2) {
              tempCtx.clearRect(prev.dims.left, prev.dims.top, prev.dims.width, prev.dims.height);
            }
          }
          const frameImageData = new ImageData(
            new Uint8ClampedArray(frame.patch),
            frame.dims.width,
            frame.dims.height
          );
          const patchCanvas = document.createElement('canvas');
          patchCanvas.width = frame.dims.width;
          patchCanvas.height = frame.dims.height;
          patchCanvas.getContext('2d')!.putImageData(frameImageData, 0, 0);
          tempCtx.drawImage(patchCanvas, frame.dims.left, frame.dims.top);
          compositeFrames.push(tempCtx.getImageData(0, 0, gifWidth, gifHeight));
        }

        canvas.width = gifWidth;
        canvas.height = gifHeight;
      });

    // ── helpers ──
    function cancelSequence() {
      if (stareTimer) { clearTimeout(stareTimer); stareTimer = null; }
      isAnimating = false;
    }

    function startIdleSequence() {
      phase = 'standing';
      img.src = STANDING_SRC;
      applyImgTransform();

      emotesRemaining = randInt(EMOTE_MIN_COUNT, EMOTE_MAX_COUNT);
      lastEmoteIndex = -1;

      stareTimer = setTimeout(doNextEmote, randRange(STAND_PAUSE_MIN_MS, STAND_PAUSE_MAX_MS));
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
      applyImgTransform();
      emotesRemaining--;

      stareTimer = setTimeout(() => {
        if (emotesRemaining > 0) {
          // Brief standing pause between emotes
          phase = 'standing';
          img.src = STANDING_SRC;
          applyImgTransform();
          stareTimer = setTimeout(doNextEmote, randRange(500, 1200));
        } else {
          resumeMoving();
        }
      }, EMOTE_DURATION_MS);
    }

    function resumeMoving() {
      direction = Math.random() < 0.5 ? -1 : 1;
      moveMode = Math.random() < 0.35 ? 'run' : 'walk';
      img.src = moveMode === 'run' ? RUN_SRC : '/neco-walk.gif';
      walkStartTime = performance.now();
      walkStopAfter = randRange(WALK_MIN_MS, WALK_MAX_MS);
      phase = 'walking';
      applyImgTransform();
    }

    const VISUAL_TAGS = new Set([
      'IMG', 'SVG', 'CANVAS', 'VIDEO', 'INPUT', 'BUTTON', 'SELECT',
      'TEXTAREA', 'HR', 'PICTURE', 'IFRAME', 'OBJECT', 'EMBED',
    ]);

    // Viable ground: any element with visual presence that is substantial
    // enough to serve as a landing surface. Based on the "razzyshmazzy" h1
    // as the baseline — visible text with no background/border still counts.
    const CONTENT_TAGS = new Set([
      'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'A',
      'LABEL', 'LI', 'TD', 'TH', 'STRONG', 'EM', 'B', 'I', 'SMALL',
      'CODE', 'PRE', 'BLOCKQUOTE', 'FIGCAPTION', 'DT', 'DD',
    ]);
    const MIN_TEXT_SURFACE_WIDTH = 60;

    function isVisualElement(el: Element): boolean {
      if (el === img || el === canvas) return false;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      if (parseFloat(style.opacity) === 0) return false;
      // Decorative overlays are not ground
      if (style.pointerEvents === 'none') return false;

      // Intrinsically visual elements (img, svg, canvas, button, etc.)
      if (VISUAL_TAGS.has(el.tagName)) return true;

      // Has visible background
      const bg = style.backgroundColor;
      if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') return true;

      // Has background image
      if (style.backgroundImage && style.backgroundImage !== 'none') return true;

      // Has visible border on any side
      const bw = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
        + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
      if (bw > 0) {
        const bc = style.borderColor;
        if (bc && bc !== 'transparent' && bc !== 'rgba(0, 0, 0, 0)') return true;
      }

      // Has box-shadow
      if (style.boxShadow && style.boxShadow !== 'none') return true;

      // Visible text in a content element — must be wide enough to walk on
      // (filters out individual letter spans while keeping headings, paragraphs)
      if (rect.width >= MIN_TEXT_SURFACE_WIDTH) {
        const text = el.textContent?.trim();
        if (text && text.length > 0) {
          if (el.children.length === 0 || CONTENT_TAGS.has(el.tagName)) return true;
        }
      }

      return false;
    }

    type SurfaceInfo = { element: Element | null; pageY: number };

    function findNearestSurface(
      charBottomPageY: number,
      charLeft: number,
      charRight: number
    ): SurfaceInfo {
      const viewportFloor = window.scrollY + window.innerHeight;
      let nearest = viewportFloor;
      let nearestElement: Element | null = null;

      const candidates = document.body.querySelectorAll('*');
      for (let i = 0; i < candidates.length; i++) {
        const el = candidates[i];
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        const elTopPage = rect.top + window.scrollY;
        if (elTopPage <= charBottomPageY) continue;
        if (elTopPage >= nearest) continue;
        if (elTopPage > charBottomPageY + 2000) continue;
        const elLeft = rect.left;
        const elRight = rect.right;
        if (charRight <= elLeft || charLeft >= elRight) continue;
        if (!isVisualElement(el)) continue;
        nearest = elTopPage;
        nearestElement = el;
      }

      return { element: nearestElement, pageY: nearest };
    }

    function showImg() {
      img.style.display = '';
      canvas.style.display = 'none';
    }

    function showCanvas() {
      img.style.display = 'none';
      canvas.style.display = '';
    }

    function drawFrame(index: number) {
      if (compositeFrames.length === 0) return;
      const clamped = Math.max(0, Math.min(index, compositeFrames.length - 1));
      ctx.putImageData(compositeFrames[clamped], 0, 0);
    }

    function applyCanvasTransform(posY: number) {
      const scaleX = direction === -1 ? -1 : 1;
      canvas.style.transform =
        `translateX(${x}px) translateY(${posY}px) scaleX(${scaleX})`;
    }

    function applyImgTransform() {
      const scaleX = direction === -1 ? -1 : 1;
      img.style.height = `${HEIGHT}px`;
      img.style.transform =
        `translateX(${x}px) translateY(${fallY}px) scaleX(${scaleX})`;
    }

    function getCharDisplayWidth(): number {
      return gifWidth > 0 ? (FALL_HEIGHT / gifHeight) * gifWidth : FALL_HEIGHT;
    }

    // ── unified fall function (shared by drag-drop and scroll-trigger) ──
    function beginFall(cursorX: number | null) {
      // fallY must be pre-set for canvas FALL_HEIGHT before calling this
      const charBottomPageY = basePageY + fallY + FALL_HEIGHT;
      const displayWidth = getCharDisplayWidth();
      const charLeft = x;
      const charRight = x + displayWidth;

      const surface = findNearestSurface(charBottomPageY, charLeft, charRight);
      targetSurface = surface.element;

      fallStartY = fallY;
      fallDistance = surface.pageY - charBottomPageY;

      if (fallDistance <= 0) {
        fallY = surface.pageY - basePageY - FALL_HEIGHT;
        land();
        return;
      }

      if (cursorX !== null) {
        x = cursorX - displayWidth / 2;
      }

      fallDuration = Math.max(MIN_FALL_DURATION, Math.sqrt(2 * fallDistance / G_PX_PER_MS2));
      fallStartTime = performance.now();
      fallFrameOffset = 0;
      rescanCounter = 0;

      phase = 'falling';
      isAnimating = true;
      landedSurface = null;
      showCanvas();
      canvas.style.height = `${FALL_HEIGHT}px`;
      canvas.style.width = 'auto';
      canvas.style.zIndex = String(DRAG_Z);
      drawFrame(0);
      applyCanvasTransform(fallY);
    }

    // ── landing ──
    function land() {
      phase = 'staring';
      landedSurface = targetSurface;
      targetSurface = null;

      // Adjust fallY so img bottom aligns with surface top
      if (landedSurface) {
        const surfPageY = landedSurface.getBoundingClientRect().top + window.scrollY;
        fallY = surfPageY - basePageY - HEIGHT;
      } else {
        fallY = window.scrollY + window.innerHeight - basePageY - HEIGHT;
      }

      showImg();
      img.src = '/neco-stare.png';
      img.style.height = `${HEIGHT}px`;
      img.style.zIndex = String(NORMAL_Z);
      img.style.pointerEvents = '';
      applyImgTransform();

      stareTimer = setTimeout(() => {
        isAnimating = false;
        resumeMoving();
      }, STARE_MS);
    }

    // ── edge fall (walk off surface edge → fall to next surface) ──
    function triggerEdgeFall() {
      cancelSequence();

      // Adjust fallY from img HEIGHT to canvas FALL_HEIGHT, keeping bottom at surface top
      if (landedSurface) {
        const surfPageY = landedSurface.getBoundingClientRect().top + window.scrollY;
        fallY = surfPageY - basePageY - FALL_HEIGHT;
      }
      landedSurface = null;

      beginFall(null);
    }

    // ── render loop ──
    function tick() {
      // ── walking phase ──
      if (phase === 'walking') {
        if (landedSurface) {
          // Walk on landed surface — track its Y live
          const surfRect = landedSurface.getBoundingClientRect();
          const surfPageY = surfRect.top + window.scrollY;
          fallY = surfPageY - basePageY - HEIGHT;

          x += moveSpeed() * direction;

          // Edge detection: char center beyond surface edge → fall
          const charRect = img.getBoundingClientRect();
          const charCenter = charRect.left + charRect.width / 2;
          if (charCenter < surfRect.left || charCenter > surfRect.right) {
            triggerEdgeFall();
          } else {
            applyImgTransform();
          }
        } else {
          // No surface — walk across full viewport (pre-fall)
          x += moveSpeed() * direction;
          if (direction === 1 && x > window.innerWidth + HEIGHT) x = -HEIGHT;
          if (direction === -1 && x < -HEIGHT) x = window.innerWidth + HEIGHT;
          applyImgTransform();
        }

        // Random idle stop — only when on-screen
        if (phase === 'walking' && x > 0 && x < window.innerWidth &&
            performance.now() - walkStartTime > walkStopAfter) {
          startIdleSequence();
        }
      }

      // ── standing / emoting — track surface Y ──
      if ((phase === 'standing' || phase === 'emoting') && landedSurface) {
        const surfPageY = landedSurface.getBoundingClientRect().top + window.scrollY;
        fallY = surfPageY - basePageY - HEIGHT;
        applyImgTransform();
      }

      // ── falling phase ──
      if (phase === 'falling' && compositeFrames.length > 0) {
        const elapsed = performance.now() - fallStartTime;
        const tNorm = Math.min(elapsed / fallDuration, 1);
        const posProgress = tNorm * tNorm; // quadratic ease-in

        fallY = fallStartY + posProgress * fallDistance;
        applyCanvasTransform(fallY);

        // Map progress to frame index (offset preserves continuity after rescan)
        const totalFrames = compositeFrames.length - 1;
        const remainingFrames = totalFrames - fallFrameOffset;
        const frameIndex = fallFrameOffset + Math.floor(posProgress * remainingFrames);
        drawFrame(frameIndex);

        // Live collision check against target surface
        const charBottomPageY = basePageY + fallY + FALL_HEIGHT;
        let surfacePageY: number;
        if (targetSurface) {
          surfacePageY = targetSurface.getBoundingClientRect().top + window.scrollY;
        } else {
          surfacePageY = window.scrollY + window.innerHeight;
        }

        if (charBottomPageY >= surfacePageY) {
          // Contact — snap and land
          fallY = surfacePageY - basePageY - FALL_HEIGHT;
          applyCanvasTransform(fallY);
          drawFrame(totalFrames);
          land();
        } else if (posProgress >= 1) {
          // Time-based fallback
          fallY = fallStartY + fallDistance;
          applyCanvasTransform(fallY);
          drawFrame(totalFrames);
          land();
        } else {
          // Lightweight re-scan for closer surfaces
          rescanCounter++;
          if (rescanCounter >= RESCAN_INTERVAL) {
            rescanCounter = 0;
            const displayWidth = getCharDisplayWidth();
            const surface = findNearestSurface(charBottomPageY, x, x + displayWidth);

            if (surface.pageY < surfacePageY) {
              // Closer surface found — remap remaining fall
              const currentFrame = Math.min(
                fallFrameOffset + Math.floor(posProgress * remainingFrames),
                totalFrames - 1
              );
              fallFrameOffset = currentFrame;
              fallStartY = fallY;
              fallStartTime = performance.now();
              fallDistance = surface.pageY - charBottomPageY;
              fallDuration = Math.max(
                MIN_FALL_DURATION,
                Math.sqrt(2 * fallDistance / G_PX_PER_MS2)
              );
              targetSurface = surface.element;
            }
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    }

    // ── drag ──
    function startDrag(clientX: number, clientY: number) {
      cancelSequence();
      phase = 'dragging';
      landedSurface = null;

      const r = img.style.display === 'none'
        ? canvas.getBoundingClientRect()
        : img.getBoundingClientRect();
      grabOffsetX = clientX - r.left;
      grabOffsetY = clientY - r.top;
      lastCursorX = clientX;

      showCanvas();
      canvas.style.height = `${FALL_HEIGHT}px`;
      canvas.style.width = 'auto';
      canvas.style.zIndex = String(DRAG_Z);
      drawFrame(0);

      img.style.pointerEvents = 'none';

      // Apply initial canvas position immediately (before any mousemove)
      moveDrag(clientX, clientY);

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    }

    function moveDrag(clientX: number, clientY: number) {
      lastCursorX = clientX;
      x = clientX - grabOffsetX;
      fallY = clientY - grabOffsetY + window.scrollY - basePageY;
      applyCanvasTransform(fallY);
    }

    function endDrag() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);

      // fallY already set by drag — canvas bottom is at basePageY + fallY + FALL_HEIGHT
      beginFall(lastCursorX);
    }

    // ── event handlers ──
    function onMouseDown(e: MouseEvent) {
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
    }
    function onMouseMove(e: MouseEvent) {
      moveDrag(e.clientX, e.clientY);
    }
    function onMouseUp() {
      endDrag();
    }
    function onTouchStart(e: TouchEvent) {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
    function onTouchMove(e: TouchEvent) {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
    function onTouchEnd() {
      endDrag();
    }

    img.addEventListener('mousedown', onMouseDown);
    img.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });

    // ── scroll handling ──
    if (window.scrollY >= 200) {
      walkStartTime = performance.now();
      phase = 'walking';
    }

    function onScroll() {
      if (phase === 'idle' && window.scrollY >= 200) {
        walkStartTime = performance.now();
        phase = 'walking';
        return;
      }

      if (phase === 'walking' && !isAnimating && !scrollFallDone && x > 0) {
        if (window.scrollY >= basePageY) {
          scrollFallDone = true;
          // Adjust fallY from img HEIGHT to canvas FALL_HEIGHT (keep bottom aligned)
          fallY = fallY + HEIGHT - FALL_HEIGHT;
          beginFall(null);
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    canvas.style.display = 'none';
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      cancelSequence();
      img.removeEventListener('mousedown', onMouseDown);
      img.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src="/neco-walk.gif"
        alt=""
        aria-hidden="true"
        className="neco-walker"
        style={{ transform: 'translateX(-96px)' }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="neco-walker"
        style={{ display: 'none', imageRendering: 'pixelated' }}
      />
    </>
  );
}
