/**
 * sync-repos.js — Daily repo sync script (runs in GitHub Actions)
 *
 * Fetches repo metadata from the GitHub API and writes it to repos.json.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPOS_JSON = path.resolve(__dirname, '../../repos.json');

const OWNER        = process.env.REPO_OWNER || 'razzyshmazzy';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// ── Helpers ──────────────────────────────────────────────────────────────────

const ghHeaders = {
  Accept: 'application/vnd.github.v3+json',
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

async function ghFetch(url) {
  const res = await fetch(url, { headers: ghHeaders });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${url}`);
  return res.json();
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Load existing repos.json
  let existing = { lastUpdated: '', owner: OWNER, repos: [] };
  try {
    const raw = await fs.readFile(REPOS_JSON, 'utf8');
    existing = JSON.parse(raw);
  } catch {
    console.log('No existing repos.json — starting fresh.');
  }

  // Fetch current repo list from GitHub
  console.log(`Fetching repos for ${OWNER}…`);
  const apiRepos = await ghFetch(
    `https://api.github.com/users/${OWNER}/repos?per_page=100&sort=updated`
  );

  // Build updated list: keep existing entries, add new ones
  const updatedRepos = [...existing.repos];

  for (const r of apiRepos) {
    const idx = updatedRepos.findIndex(e => e.name === r.name);

    const meta = {
      name:        r.name,
      description: r.description,
      language:    r.language,
      stars:       r.stargazers_count,
      url:         r.html_url,
      homepage:    r.homepage || null,
      updatedAt:   r.updated_at,
      topics:      r.topics || [],
    };

    if (idx !== -1) {
      updatedRepos[idx] = { ...meta, summary: updatedRepos[idx].summary };
    } else {
      console.log(`New repo found: ${r.name}`);
      updatedRepos.push({ ...meta, summary: null });
    }
  }

  // Sort by updatedAt descending
  updatedRepos.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const output = {
    lastUpdated: new Date().toISOString(),
    owner: OWNER,
    repos: updatedRepos,
  };

  await fs.writeFile(REPOS_JSON, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Done. ${updatedRepos.length} repos written to repos.json.`);
}

main().catch(e => { console.error(e); process.exit(1); });
