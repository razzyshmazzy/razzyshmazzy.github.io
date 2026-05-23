'use client';

import type { Repo } from '@/types/repo';
import styles from './RepoCard.module.css';

interface Props {
  repos: Repo[];
}

const HREF_OVERRIDES: Record<string, string> = {
  library: 'https://razzyshmazzy.com/library/',
  doccer: 'https://doccer.razzyshmazzy.com',
};

function RepoCard({ repo }: { repo: Repo }) {
  const href = HREF_OVERRIDES[repo.name] ?? repo.homepage ?? repo.url;

  return (
    <div className={styles.perspective}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.card} repo-card`}
        data-repo={repo.name}
      >
        <div className={styles.imageWrap}>
          {repo.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={repo.image} alt={repo.name} className={styles.image} />
          ) : (
            <div className={styles.imagePlaceholder}>{repo.name}</div>
          )}
        </div>
        <div className={styles.body}>
          <span className={styles.name}>{repo.name}</span>
          {repo.description && (
            <p className={styles.desc}>{repo.description}</p>
          )}
        </div>
      </a>
    </div>
  );
}

export default function RepoGrid({ repos }: Props) {
  if (!repos.length) {
    return (
      <div className="repos-grid">
        <div className="grid-empty">No repos to show.</div>
      </div>
    );
  }

  return (
    <div className="repos-grid">
      {repos.map((repo) => (
        <RepoCard key={repo.name} repo={repo} />
      ))}
    </div>
  );
}
