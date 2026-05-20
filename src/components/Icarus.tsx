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
      const atlens = document.querySelector<HTMLElement>('[data-repo="atlens"]');
      if (!about || !aboutText || !atlens) {
        setPlace(null);
        return;
      }

      const aboutRect = about.getBoundingClientRect();
      const aboutTextRect = aboutText.getBoundingClientRect();
      const atlensRect = atlens.getBoundingClientRect();
      const scrollY = window.scrollY;

      const aboutMidDoc = aboutRect.top + scrollY + aboutRect.height / 2;
      const viewportBottomDoc = scrollY + window.innerHeight;
      const triggerScrollY = aboutMidDoc - window.innerHeight;
      const maxScrollY =
        document.documentElement.scrollHeight - window.innerHeight;

      if (viewportBottomDoc < aboutMidDoc) {
        setPlace(null);
        return;
      }

      // Base: Icarus starts just above the viewport at trigger (bottom = viewport top).
      const baseTopDoc = triggerScrollY - HEIGHT;

      // Target (at page bottom): bottom of Icarus aligned with bottom of about-me paragraph.
      const aboutTextBottomDoc = aboutTextRect.top + scrollY + aboutTextRect.height;
      const targetTopDoc = aboutTextBottomDoc - HEIGHT;

      const maxDelta = Math.max(1, maxScrollY - triggerScrollY);
      const t = Math.min(1, Math.max(0, (scrollY - triggerScrollY) / maxDelta));
      const eased = t * t; // quadratic ease-in → rushes faster as you near the bottom

      const topDoc = baseTopDoc + (targetTopDoc - baseTopDoc) * eased;
      const topViewport = topDoc - scrollY;

      const left = atlensRect.left + atlensRect.width / 2 - WIDTH / 2 + 100;
      setPlace({ top: topViewport, left });
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Repos load async — re-check periodically until atlens shows up, then stop.
    const interval = window.setInterval(() => {
      if (document.querySelector('[data-repo="atlens"]')) {
        update();
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

  if (!place) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icarus.png"
      alt="icarus"
      style={{
        position: 'fixed',
        left: place.left,
        top: place.top,
        width: WIDTH,
        height: HEIGHT,
        objectFit: 'contain',
        pointerEvents: 'none',
        zIndex: -10,
      }}
    />
  );
}
