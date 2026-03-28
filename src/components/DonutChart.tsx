import type { Repo } from '@/types/repo';

const LANG_COLOR: Record<string, string> = {
  JavaScript: '#e0e0e0',
  TypeScript:  '#c8c8c8',
  HTML:        '#b0b0b0',
  CSS:         '#989898',
  Java:        '#808080',
  Python:      '#686868',
  Go:          '#585858',
  Rust:        '#484848',
  Ruby:        '#383838',
};

function langColor(lang: string): string {
  return LANG_COLOR[lang] ?? '#555555';
}

interface Props {
  repos: Repo[];
}

export default function DonutChart({ repos }: Props) {
  const langs: Record<string, number> = {};
  for (const r of repos) {
    const l = r.language || 'Unknown';
    langs[l] = (langs[l] || 0) + 1;
  }

  const total = repos.length;
  const entries = Object.entries(langs).sort((a, b) => b[1] - a[1]);

  const cx = 100, cy = 100, R = 82, r = 52;
  let angle = -Math.PI / 2;

  const paths: React.ReactNode[] = [];

  for (const [lang, count] of entries) {
    const slice = (count / total) * 2 * Math.PI;
    const end = angle + slice;
    const color = langColor(lang);
    const largeArc = slice > Math.PI ? 1 : 0;

    if (entries.length === 1) {
      paths.push(
        <circle
          key={lang}
          cx={cx}
          cy={cy}
          r={(R + r) / 2}
          fill="none"
          stroke={color}
          strokeWidth={R - r}
        />
      );
    } else {
      const x1 = cx + R * Math.cos(angle);
      const y1 = cy + R * Math.sin(angle);
      const x2 = cx + R * Math.cos(end);
      const y2 = cy + R * Math.sin(end);
      const ix1 = cx + r * Math.cos(end);
      const iy1 = cy + r * Math.sin(end);
      const ix2 = cx + r * Math.cos(angle);
      const iy2 = cy + r * Math.sin(angle);

      paths.push(
        <path
          key={lang}
          d={`M ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${r} ${r} 0 ${largeArc} 0 ${ix2} ${iy2} Z`}
          fill={color}
          style={{ cursor: 'pointer' }}
        >
          <title>{lang}</title>
        </path>
      );
    }

    angle = end;
  }

  return (
    <section className="chart-section">
      <h2>Language Distribution</h2>
      <div className="chart-wrapper">
        <svg id="donut-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {paths}
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill="#d0d0d0"
            fontSize="22"
            fontWeight="700"
          >
            {total}
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill="#666666" fontSize="10">
            repos
          </text>
        </svg>
        <div id="chart-legend">
          {entries.map(([lang, count]) => (
            <div key={lang} className="legend-item">
              <span className="legend-dot" style={{ background: langColor(lang) }} />
              <span className="legend-name">{lang}</span>
              <span className="legend-count">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
