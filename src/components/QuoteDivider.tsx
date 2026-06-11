'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface Quote {
  text: string;
  author: string;
}

function parseQuotes(raw: string): Quote[] {
  const matches = [...raw.matchAll(/\{([\s\S]*?)\}/g)];
  return matches.map((m) => {
    // The last line of each block is the author/source; everything above it is
    // the quote body. A leading "-" on the author line is optional (older
    // entries used it). Line breaks within the body are author-authored and
    // preserved verbatim.
    const lines = m[1].replace(/^\n+|\n+$/g, '').split('\n');
    if (lines.length > 1) {
      const author = lines.pop()!.trim().replace(/^-\s*/, '');
      return { text: lines.join('\n'), author };
    }
    return { text: lines[0]?.trim() ?? '', author: '' };
  });
}

// Smallest the quote may shrink to before we just accept a tight fit. Keeps a
// comma-less line that overflows even tiny type from becoming illegible.
const MIN_FONT_PX = 11;

/**
 * Reflow a quote so it never runs off the screen horizontally.
 *
 * For each author-authored line we (a) keep it as-is if it already fits the
 * available width, otherwise (b) break it at its commas — at the space that
 * follows each comma — packing the comma-delimited segments greedily so every
 * emitted line fits. If a line has no comma to break on (or a single segment is
 * still wider than the screen) we shrink the font and re-try the whole reflow,
 * stepping down until everything fits or we hit MIN_FONT_PX.
 *
 * Returns the rewrapped text (explicit '\n's, rendered under `white-space: pre`)
 * and the font size in px to apply.
 */
function reflow(
  text: string,
  available: number,
  baseFontPx: number,
  measure: (s: string, fontPx: number) => number,
): { text: string; fontPx: number } {
  const sourceLines = text.split('\n');

  // Break one source line at its commas, greedily packing segments that fit.
  const wrapAtCommas = (line: string, fontPx: number): string[] => {
    if (measure(line, fontPx) <= available) return [line];
    // Split at whitespace that immediately follows a comma — the comma stays
    // attached to the segment before it, the trailing space is dropped.
    const segments = line.split(/(?<=,)\s+/);
    const out: string[] = [];
    let cur = '';
    for (const seg of segments) {
      const trial = cur ? `${cur} ${seg}` : seg;
      if (cur && measure(trial, fontPx) > available) {
        out.push(cur);
        cur = seg;
      } else {
        cur = trial;
      }
    }
    if (cur) out.push(cur);
    return out;
  };

  for (let fontPx = baseFontPx; ; fontPx -= 0.5) {
    const wrapped = sourceLines.flatMap((line) => wrapAtCommas(line, fontPx));
    const fits = wrapped.every((line) => measure(line, fontPx) <= available);
    if (fits || fontPx <= MIN_FONT_PX) {
      return { text: wrapped.join('\n'), fontPx };
    }
  }
}

export default function QuoteDivider() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [display, setDisplay] = useState<{ text: string; fontPx: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.75;
  }, []);

  useEffect(() => {
    fetch('/quotes.txt')
      .then((r) => r.text())
      .then((raw) => {
        const quotes = parseQuotes(raw);
        if (quotes.length) {
          setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        }
      })
      .catch(() => {});
  }, []);

  // Measure + reflow once we have a quote, after fonts load, and on resize.
  useLayoutEffect(() => {
    if (!quote || !textRef.current) return;

    const el = textRef.current;

    // Hidden single-line ruler that inherits the quote's font/letter-spacing so
    // measurements match the real render. `pre` keeps it from wrapping.
    const ruler = document.createElement('span');
    ruler.className = 'quote-text';
    ruler.style.cssText =
      'position:absolute;visibility:hidden;white-space:pre;left:-9999px;top:0;margin:0;';
    el.parentElement!.appendChild(ruler);

    const measure = (s: string, fontPx: number) => {
      ruler.style.fontSize = `${fontPx}px`;
      ruler.textContent = s;
      return ruler.getBoundingClientRect().width;
    };

    const compute = () => {
      // Available width = the text column (quote-inner), minus its own padding.
      const inner = el.parentElement!;
      const cs = getComputedStyle(inner);
      const available =
        inner.clientWidth -
        parseFloat(cs.paddingLeft) -
        parseFloat(cs.paddingRight);
      // Base size is whatever the CSS clamp resolves to (no inline override).
      const baseFontPx = parseFloat(getComputedStyle(ruler).fontSize);
      setDisplay(reflow(quote.text, available, baseFontPx, measure));
    };

    compute();

    let cleanedUp = false;
    // Re-measure once webfonts settle (metrics shift when Orbitron swaps in).
    document.fonts?.ready.then(() => {
      if (!cleanedUp) compute();
    });

    window.addEventListener('resize', compute);
    return () => {
      cleanedUp = true;
      window.removeEventListener('resize', compute);
      ruler.remove();
    };
  }, [quote]);

  return (
    <div className="quote-divider">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.4,
        }}
      >
        <source src="/roses.mp4" type="video/mp4" />
      </video>
      <div className="quote-inner" style={{ position: 'relative', zIndex: 1 }}>
        {quote ? (
          <>
            <p
              ref={textRef}
              className="quote-text"
              style={display ? { fontSize: `${display.fontPx}px` } : undefined}
            >
              {display ? display.text : quote.text}
            </p>
            {quote.author && (
              <span className="quote-author">{quote.author}</span>
            )}
          </>
        ) : (
          <p className="quote-text" style={{ opacity: 0 }}>Loading…</p>
        )}
      </div>
    </div>
  );
}
