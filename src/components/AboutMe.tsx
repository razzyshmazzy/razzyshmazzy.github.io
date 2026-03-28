'use client';

import { useEffect, useState } from 'react';

export default function AboutMe() {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    fetch('/aboutme.txt')
      .then((r) => r.text())
      .then((t) => setText(t.trim()))
      .catch(() => {});
  }, []);

  if (!text) return null;

  return (
    <section className="about-me">
      <h2 className="about-me-heading">About Me</h2>
      <p className="about-me-text">{text}</p>
    </section>
  );
}
