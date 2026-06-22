'use client';

import type { Repo } from '@/types/repo';
import styles from './RepoCard.module.css';

interface Props {
  repos: Repo[];
}

const HREF_OVERRIDES: Record<string, string> = {
  library: '../library/',
  doccer: '../doccer/',
  atlens: '../atlens/',
  cipher: '../cipher/',
  basher: '../basher/',
};

const IMAGE_OVERRIDES: Record<string, string> = {
  library: '/screenshots/library.png',
  atlens: '/screenshots/atlens.png',
  cipher: '/screenshots/cipher.png',
};

function RepoCard({ repo }: { repo: Repo }) {
  const href = HREF_OVERRIDES[repo.name] ?? repo.homepage ?? repo.url;
  const image = IMAGE_OVERRIDES[repo.name] ?? repo.image;

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
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={repo.name} className={styles.image} />
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
