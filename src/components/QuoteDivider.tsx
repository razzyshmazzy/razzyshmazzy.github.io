'use client';

import { useEffect, useRef, useState } from 'react';

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

export default function QuoteDivider() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.75;
  }, []);

  useEffect(() => {
    fetch('/quotes.txt')
      .then((r) => r.text())
      .then((raw) => {
        const quotes = parseQuotes(raw);
        if (!quotes.length) return;

        // Avoid repeating the quote shown on the previous refresh. We only
        // remember the single last index (in sessionStorage), so a quote can
        // reappear later — just never twice in a row.
        const last = Number(sessionStorage.getItem('lastQuote'));
        let idx = Math.floor(Math.random() * quotes.length);
        if (quotes.length > 1 && idx === last) {
          idx = (idx + 1) % quotes.length;
        }
        sessionStorage.setItem('lastQuote', String(idx));
        setQuote(quotes[idx]);
      })
      .catch(() => {});
  }, []);

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
            <p className="quote-text">{quote.text}</p>
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
