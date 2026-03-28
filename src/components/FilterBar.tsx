'use client';

interface Props {
  languages: string[];
  activeLang: string;
  sort: string;
  search: string;
  onLangChange: (lang: string) => void;
  onSortChange: (sort: string) => void;
  onSearchChange: (q: string) => void;
}

export default function FilterBar({
  languages,
  activeLang,
  sort,
  search,
  onLangChange,
  onSortChange,
  onSearchChange,
}: Props) {
  return (
    <div className="filter-bar">
      <span className="filter-label">Language</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        <button
          className={`lang-btn${activeLang === 'all' ? ' active' : ''}`}
          data-lang="all"
          onClick={() => onLangChange('all')}
        >
          All
        </button>
        {languages.map((lang) => (
          <button
            key={lang}
            className={`lang-btn${activeLang === lang ? ' active' : ''}`}
            data-lang={lang}
            onClick={() => onLangChange(lang)}
          >
            {lang}
          </button>
        ))}
      </div>
      <div className="filter-sep" />
      <span className="filter-label">Sort</span>
      <select
        id="sort-select"
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="updatedAt">Recently updated</option>
        <option value="name">Name A–Z</option>
        <option value="stars">Most stars</option>
      </select>
      <div className="filter-sep" />
      <input
        id="search-input"
        type="search"
        placeholder="Search repos…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          color: 'var(--muted)',
          padding: '0.3rem 0.65rem',
          fontSize: '0.8rem',
          outline: 'none',
          width: '180px',
        }}
      />
    </div>
  );
}
