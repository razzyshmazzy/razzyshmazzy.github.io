'use client';

import { useEffect, useRef, useState } from 'react';

interface Quote {
  text: string;
  author: string;
}

function parseQuotes(raw: string): Quote[] {
  const matches = [...raw.matchAll(/\{([\s\S]*?)\}/g)];
  return matches.map((m) => {
    const block = m[1].trim();
    const authorMatch = block.match(/^([\s\S]+?)\n(-[\s\S]+)$/);
    if (authorMatch) {
      return { text: authorMatch[1].trim(), author: authorMatch[2].trim() };
    }
    return { text: block, author: '' };
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
        if (quotes.length) {
          setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        }
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
