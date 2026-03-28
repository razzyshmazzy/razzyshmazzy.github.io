'use client';

import { useRef, useCallback, useEffect } from 'react';

const LETTERS = 'razzyshmazzy'.split('');
const SPRING_K = 0.08;
const DAMPING = 0.93;
const HOVER_TARGET = -5;
const LEAVE_IMPULSE = 4;
const RIPPLE_AMPLITUDE = 4;
const RIPPLE_DECAY = 0.6;
const RIPPLE_DELAY = 60; // ms per letter distance

interface LetterState {
  offsets: Float64Array;
  velocities: Float64Array;
  hovered: boolean[];
  activeIndex: number; // which letter the cursor is on, -1 if none
  animating: boolean;
  rafId: number | null;
}

export default function NewtonCradleText() {
  const n = LETTERS.length;
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const stateRef = useRef<LetterState>({
    offsets: new Float64Array(n),
    velocities: new Float64Array(n),
    hovered: new Array(n).fill(false),
    activeIndex: -1,
    animating: false,
    rafId: null,
  });
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const animate = useCallback(() => {
    const s = stateRef.current;
    let anyMoving = false;

    for (let i = 0; i < n; i++) {
      const target = s.hovered[i] ? HOVER_TARGET : 0;
      const displacement = s.offsets[i] - target;
      const springForce = -SPRING_K * displacement;

      s.velocities[i] += springForce;
      s.velocities[i] *= DAMPING;
      s.offsets[i] += s.velocities[i];

      if (Math.abs(displacement) < 0.05 && Math.abs(s.velocities[i]) < 0.05) {
        s.offsets[i] = target;
        s.velocities[i] = 0;
      } else {
        anyMoving = true;
      }

      const span = spansRef.current[i];
      if (span) {
        span.style.transform = `translateY(${s.offsets[i]}px)`;
      }
    }

    if (anyMoving) {
      s.rafId = requestAnimationFrame(animate);
    } else {
      s.animating = false;
      s.rafId = null;
    }
  }, [n]);

  const ensureAnimating = useCallback(() => {
    const s = stateRef.current;
    if (!s.animating) {
      s.animating = true;
      s.rafId = requestAnimationFrame(animate);
    }
  }, [animate]);

  // Cursor enters a letter — raise it, gently lower the previous one
  const handleLetterEnter = useCallback((index: number) => {
    const s = stateRef.current;
    const prev = s.activeIndex;

    // Un-hover previous letter (gentle spring back, no fling)
    if (prev >= 0 && prev !== index) {
      s.hovered[prev] = false;
    }

    s.activeIndex = index;
    s.hovered[index] = true;
    s.velocities[index] -= 2; // small upward kick
    ensureAnimating();
  }, [ensureAnimating]);

  // Cursor leaves the entire text — fling + ripple from last active letter
  const handleTextLeave = useCallback(() => {
    const s = stateRef.current;
    const index = s.activeIndex;
    if (index < 0) return;

    s.hovered[index] = false;
    s.activeIndex = -1;

    // Downward fling
    s.velocities[index] += LEAVE_IMPULSE;
    ensureAnimating();

    // Propagate ripple outward
    for (let d = 1; d < n; d++) {
      const amplitude = RIPPLE_AMPLITUDE * Math.pow(RIPPLE_DECAY, d);
      if (amplitude < 0.1) break;

      const timer = setTimeout(() => {
        const left = index - d;
        const right = index + d;
        if (left >= 0) s.velocities[left] += amplitude;
        if (right < n) s.velocities[right] += amplitude;
        ensureAnimating();
      }, d * RIPPLE_DELAY);

      timersRef.current.push(timer);
    }
  }, [n, ensureAnimating]);

  useEffect(() => {
    return () => {
      const s = stateRef.current;
      if (s.rafId !== null) cancelAnimationFrame(s.rafId);
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <span
      style={{ display: 'inline-block' }}
      onMouseLeave={handleTextLeave}
    >
      {LETTERS.map((letter, i) => (
        <span
          key={i}
          ref={(el) => { spansRef.current[i] = el; }}
          onMouseEnter={() => handleLetterEnter(i)}
          style={{
            display: 'inline-block',
            cursor: 'pointer',
            willChange: 'transform',
          }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
