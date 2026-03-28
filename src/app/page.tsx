'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import NecoWalker from '@/components/NecoWalker';
import QuoteDivider from '@/components/QuoteDivider';
import RepoGrid from '@/components/RepoGrid';
import AboutMe from '@/components/AboutMe';
import type { Repo, ReposData } from '@/types/repo';

export default function HomePage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/repos.json').then((r) => r.json()),
      fetch('/repoHeroes').then((r) => r.text()).catch(() => null),
    ])
      .then(([data, heroesRaw]: [ReposData, string | null]) => {
        let repoList = data.repos ?? [];

        if (heroesRaw) {
          const heroNames = [...heroesRaw.matchAll(/\{(\S+)/g)].map((m) => m[1]);
          if (heroNames.length) {
            repoList = repoList.filter((r) => heroNames.includes(r.name));
          }
        }

        const sorted = repoList.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setRepos(sorted);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Hero />
      <NecoWalker />
      <QuoteDivider />

      <div className="page">
        {loading ? (
          <div className="grid-empty">Loading repositories…</div>
        ) : error ? (
          <div className="grid-empty">
            Could not load repos.json — make sure it exists in the public directory.
          </div>
        ) : (
          <RepoGrid repos={repos} />
        )}
      </div>

      <AboutMe />
    </>
  );
}
