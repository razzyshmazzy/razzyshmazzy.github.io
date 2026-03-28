'use client';

import { useEffect, useState } from 'react';

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
      <div className="quote-inner">
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
