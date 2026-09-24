'use client';

import { useEffect, useRef, useState } from 'react';

const WIDTH = 360;
const HEIGHT = 540;

interface Placement {
  top: number; // viewport-relative
  left: number;
}

export default function Icarus() {
  const [place, setPlace] = useState<Placement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      rafRef.current = null;

      const about = document.querySelector<HTMLElement>('.about-me');
      const aboutText = document.querySelector<HTMLElement>('.about-me-text');
      if (!about || !aboutText) {
        setPlace(null);
        return;
      }

      const aboutRect = about.getBoundingClientRect();
      const aboutTextRect = aboutText.getBoundingClientRect();

      // Only render Icarus if he fits in the gap between the about-me column's
      // right edge and the right wall of the viewport.
      const spaceRight = window.innerWidth - aboutRect.right;
      if (spaceRight < WIDTH) {
        setPlace(null);
        return;
      }

      // Flush to the right wall, bottom-aligned with the about-me text so he
      // sits in line with it. Recomputed on scroll to stay pinned to the text
      // (no descent animation — he just tracks the paragraph).
      const left = window.innerWidth - WIDTH;
      const top = aboutTextRect.bottom - HEIGHT;
      setPlace({ top, left });
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // about-me text loads async (fetch of aboutme.txt) — re-check until it shows
    // up, then stop. Give up after ~5s so we don't poll forever.
    let attempts = 0;
    const interval = window.setInterval(() => {
      if (document.querySelector('.about-me-text')) {
        update();
        window.clearInterval(interval);
      } else if (++attempts >= 25) {
        window.clearInterval(interval);
      }
    }, 200);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.clearInterval(interval);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // The image stays mounted from first render (just transparent when out of
  // range, via opacity) so the browser fetches and decodes it up front and it
  // fades in cleanly once a placement is computed rather than popping in.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icarus.png"
      alt="icarus"
      aria-hidden="true"
      decoding="async"
      style={{
        position: 'fixed',
        left: place ? place.left : 0,
        top: place ? place.top : 0,
        width: WIDTH,
        height: HEIGHT,
        objectFit: 'contain',
        pointerEvents: 'none',
        zIndex: -10,
        opacity: place ? 1 : 0,
      }}
    />
  );
}
