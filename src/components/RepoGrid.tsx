'use client';

import { useRef, useCallback, useEffect } from 'react';
import type { Repo } from '@/types/repo';
import styles from './RepoCard.module.css';

function timeAgo(iso: string | null): string {
  if (!iso) return '';
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
  return `${Math.floor(s / 2592000)}mo ago`;
}

interface Props {
  repos: Repo[];
}

function RepoCard({ repo }: { repo: Repo }) {
  const s = repo.summary;
  const techItems = s
    ? [...(s.techStack?.languages ?? []), ...(s.techStack?.frameworks ?? [])].slice(0, 5)
    : [];

  return (
    <div className={styles.perspective}>
    <article className={`repo-card ${styles.card}`}>
      <div className="card-top">
        <a
          className={`repo-name-link ${styles.cardTitle}`}
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {repo.name}
        </a>
        {repo.language && (
          <span className="lang-badge">
            {repo.language}
          </span>
        )}
      </div>
      {repo.description && (
        <p className="repo-desc">{repo.description}</p>
      )}
      <div className="summary-box">
        {s ? (
          <>
            <p className="summary-purpose">{s.purpose}</p>
            {techItems.length > 0 && (
              <div className="tech-pills">
                {techItems.map((t) => (
                  <span key={t} className="tech-pill">{t}</span>
                ))}
              </div>
            )}
            {s.architecture && (
              <p className="summary-arch">
                {s.architecture.length > 160
                  ? s.architecture.slice(0, 160) + '…'
                  : s.architecture}
              </p>
            )}
          </>
        ) : (
          <p style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
            Analysis pending — runs nightly via GitHub Actions.
          </p>
        )}
      </div>
      <div className="card-meta">
        {repo.stars ? <span>&#9733; {repo.stars}</span> : null}
        <span>{timeAgo(repo.updatedAt)}</span>
        <a
          className="card-meta-link"
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub &rarr;
        </a>
      </div>
    </article>
    </div>
  );
}

export default function RepoGrid({ repos }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const speedRef = useRef(1);
  const targetRef = useRef(1);

  const lerp = useCallback(() => {
    const diff = targetRef.current - speedRef.current;
    if (Math.abs(diff) > 0.001) {
      speedRef.current += diff * 0.06;
      const el = trackRef.current;
      if (el) {
        el.getAnimations().forEach((a) => {
          a.playbackRate = Math.max(0, speedRef.current);
        });
      }
      rafRef.current = requestAnimationFrame(lerp);
    } else {
      speedRef.current = targetRef.current;
      trackRef.current?.getAnimations().forEach((a) => {
        a.playbackRate = speedRef.current;
      });
    }
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const handleEnter = useCallback(() => {
    targetRef.current = 0;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(lerp);
  }, [lerp]);

  const handleLeave = useCallback(() => {
    targetRef.current = 1;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(lerp);
  }, [lerp]);

  if (!repos.length) {
    return (
      <div className="repos-slider">
        <div className="grid-empty">No repos match your search.</div>
      </div>
    );
  }

  const duration = repos.length * 8;

  return (
    <div
      className="repos-slider"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        className="repos-slider-track"
        ref={trackRef}
        style={{ animationDuration: `${duration}s` }}
      >
        {repos.map((repo) => (
          <RepoCard key={repo.name} repo={repo} />
        ))}
        {repos.map((repo) => (
          <RepoCard key={`dup-${repo.name}`} repo={repo} />
        ))}
      </div>
    </div>
  );
}
