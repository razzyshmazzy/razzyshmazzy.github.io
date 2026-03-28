/**
 * Fuzzy subsequence scorer.
 * Returns a score in [0, 1] — 1 meaning full match, 0 meaning no match.
 */
export function fuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (!q.length) return 1;
  let qi = 0;
  let matches = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      matches++;
      qi++;
    }
  }
  return matches / q.length;
}

/**
 * Filter and rank repos by fuzzy query.
 * Returns repos whose best-field score exceeds the threshold.
 */
export function fuzzyFilter<T extends { name: string; description: string | null; language: string | null }>(
  repos: T[],
  query: string,
  threshold = 0.3
): T[] {
  const q = query.trim();
  if (!q) return repos;
  return repos
    .map((r) => ({
      repo: r,
      score: Math.max(
        fuzzyScore(q, r.name),
        fuzzyScore(q, r.description ?? '') * 0.7,
        fuzzyScore(q, r.language ?? '') * 0.5
      ),
    }))
    .filter((x) => x.score > threshold)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.repo);
}
