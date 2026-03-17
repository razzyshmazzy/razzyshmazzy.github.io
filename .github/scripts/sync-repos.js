/**
 * sync-repos.js — Daily repo sync script (runs in GitHub Actions)
 *
 * Mirrors the atlens analysis pipeline but uses the GitHub Contents API
 * instead of cloning, so it works without git in CI and respects rate limits.
 *
 * Steps for each NEW repo (not yet in repos.json):
 *   1. Fetch file tree via GitHub API
 *   2. Fetch content of key files (README, package.json, main source files)
 *   3. Build a summarised code context string
 *   4. Send to Claude Haiku with the same system prompt atlens uses
 *   5. Parse structured JSON response and write into repos.json
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPOS_JSON = path.resolve(__dirname, '../../repos.json');

const OWNER            = process.env.REPO_OWNER     || 'razzyshmazzy';
const GITHUB_TOKEN     = process.env.GITHUB_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY is not set.');
  process.exit(1);
}

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

/** Files to always fetch first, regardless of position in tree */
const PRIORITY_FILES = new Set([
  'README.md', 'readme.md', 'README',
  'package.json', 'requirements.txt', 'Cargo.toml',
  'pom.xml', 'build.gradle', 'go.mod', 'Makefile',
]);

/** Directories and extensions to skip entirely */
const SKIP_DIRS = ['node_modules', '.git', 'dist', 'build', '.next', 'vendor', '__pycache__', '.venv'];
const CODE_EXTS = new Set(['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.c', '.cpp',
                            '.h', '.go', '.rs', '.lua', '.hs', '.rb', '.swift', '.kt',
                            '.cs', '.php', '.html', '.css', '.scss', '.md', '.json']);

async function getCodeContext(owner, repo) {
  // 1. Get file tree (recursive)
  let tree;
  try {
    const data = await ghFetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`
    );
    tree = data.tree || [];
  } catch {
    return `Repository "${repo}" could not be read (empty or inaccessible).`;
  }

  // 2. Filter to useful files
  const files = tree
    .filter(f => f.type === 'blob')
    .filter(f => !SKIP_DIRS.some(d => f.path.startsWith(d + '/') || f.path.includes('/' + d + '/')))
    .filter(f => {
      const ext = path.extname(f.path).toLowerCase();
      return PRIORITY_FILES.has(path.basename(f.path)) || CODE_EXTS.has(ext);
    })
    .sort((a, b) => {
      const aP = PRIORITY_FILES.has(path.basename(a.path)) ? 0 : 1;
      const bP = PRIORITY_FILES.has(path.basename(b.path)) ? 0 : 1;
      return aP - bP;
    })
    .slice(0, 25); // cap at 25 files

  if (!files.length) {
    return `Repository "${repo}" appears to be empty or contains no recognised source files.`;
  }

  // 3. Fetch file contents (sequential to avoid rate limits)
  const parts = [];
  for (const file of files) {
    try {
      const data = await ghFetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`
      );
      if (data.content && data.encoding === 'base64') {
        const raw  = Buffer.from(data.content, 'base64').toString('utf8');
        const isPriority = PRIORITY_FILES.has(path.basename(file.path));
        const maxLines = isPriority ? 150 : 60;
        const lines = raw.split('\n').slice(0, maxLines).join('\n');
        parts.push(`=== ${file.path} ===\n${lines}`);
      }
    } catch {
      // silently skip unreadable files
    }
  }

  return parts.join('\n\n');
}

async function analyzeRepo(owner, repoName) {
  console.log(`  Analyzing ${repoName}…`);

  const codeContext = await getCodeContext(owner, repoName);

  const systemPrompt = `You are a senior software engineer analyzing a GitHub repository for a developer portfolio.
Given the file contents, return ONLY a JSON object — no markdown fences, no extra text — with this exact shape:
{
  "purpose":       "One sentence: what does this project do?",
  "techStack":     { "languages": [], "frameworks": [], "tools": [] },
  "architecture":  "2-3 sentences describing how the code is structured.",
  "entryPoints":   ["main file(s) to start reading"],
  "keyFiles":      ["most important files for understanding the project"],
  "setup":         "Brief steps to run the project locally.",
  "openQuestions": ["One or two interesting things worth investigating further."]
}`;

  const userMessage = `Repository: ${owner}/${repoName}\n\n${codeContext}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API ${res.status}: ${err}`);
  }

  const msg = await res.json();
  const text = msg.content[0].text.trim();

  try {
    const summary = JSON.parse(text);
    summary.analyzedAt = new Date().toISOString();
    return summary;
  } catch {
    // Claude returned something we can't parse — store the raw text as purpose
    return {
      purpose: text.slice(0, 200),
      techStack: { languages: [], frameworks: [], tools: [] },
      architecture: '',
      entryPoints: [],
      keyFiles: [],
      setup: '',
      openQuestions: [],
      analyzedAt: new Date().toISOString(),
    };
  }
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

  const existingNames = new Set(existing.repos.map(r => r.name));

  // Fetch current repo list from GitHub
  console.log(`Fetching repos for ${OWNER}…`);
  const apiRepos = await ghFetch(
    `https://api.github.com/users/${OWNER}/repos?per_page=100&sort=updated`
  );

  // Build updated list: keep existing entries, add new ones
  const updatedRepos = [...existing.repos];

  for (const r of apiRepos) {
    // Always update metadata (stars, description, updatedAt) for existing repos
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
      // Update metadata but keep existing summary
      updatedRepos[idx] = { ...meta, summary: updatedRepos[idx].summary };
    } else {
      // New repo — analyze it
      console.log(`New repo found: ${r.name}`);
      let summary = null;
      try {
        summary = await analyzeRepo(OWNER, r.name);
      } catch (e) {
        console.warn(`  Could not analyze ${r.name}: ${e.message}`);
      }
      updatedRepos.push({ ...meta, summary });
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
