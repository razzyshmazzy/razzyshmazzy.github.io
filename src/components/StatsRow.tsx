import type { Repo } from '@/types/repo';

interface Props {
  repos: Repo[];
  lastUpdated: string;
}

function timeAgo(iso: string): string {
  if (!iso) return '';
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
  return `${Math.floor(s / 2592000)}mo ago`;
}

export default function StatsRow({ repos, lastUpdated }: Props) {
  const totalStars = repos.reduce((acc, r) => acc + (r.stars || 0), 0);
  const langs: Record<string, number> = {};
  for (const r of repos) {
    const l = r.language || 'Unknown';
    langs[l] = (langs[l] || 0) + 1;
  }
  const langCount = Object.keys(langs).length;
  const topLang = Object.entries(langs).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  return (
    <div className="stats-row-wrapper">
      <div className="stats-row">
        <div className="stat-item">
          <span className="stat-value">{repos.length}</span>
          <span className="stat-label">Repos</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{totalStars}</span>
          <span className="stat-label">Stars</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{langCount}</span>
          <span className="stat-label">Languages</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{topLang}</span>
          <span className="stat-label">Top Language</span>
        </div>
      </div>
      {lastUpdated && (
        <p className="stats-synced">
          Last synced {timeAgo(lastUpdated)}
        </p>
      )}
    </div>
  );
}
