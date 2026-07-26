# CLAUDE.md

Personal portfolio site for **razzyshmazzy** — a Next.js 16 / React 19 app, statically exported, deployed to GitHub Pages at **razzyshmazzy.com** (custom domain via [CNAME](CNAME)).

## Stack

- **Next.js 16.2.1** (App Router) + **React 19.2** + **TypeScript** (strict)
- **Static export only** — [next.config.ts](next.config.ts) sets `output: "export"`, `images.unoptimized: true`, `basePath: ""`. There is no server runtime in production.
- **Tailwind v4** via `@tailwindcss/postcss`, plus `tw-animate-css` and `shadcn/tailwind.css` imported in [src/app/globals.css](src/app/globals.css).
- **shadcn** style preset `base-nova`, `lucide` icons, `@base-ui/react` primitives, `class-variance-authority`, `clsx`, `tailwind-merge`. Path alias `@/*` → `./src/*`.
- **Fonts** loaded via `next/font/google` in [src/app/layout.tsx](src/app/layout.tsx): Quicksand (`--font-display`), Rationale (`--font-rationale`), Orbitron (`--font-orbitron`).
- **Single dependency outside the React tree:** `gifuct-js` — used to decode the falling-Neco GIF into per-frame `ImageData` for canvas rendering (see NecoWalker).

## Scripts

```bash
npm run dev     # next dev
npm run build   # next build → emits to out/
npm run lint    # eslint (flat config, eslint v9)
```

There is no `start` script that matters in production — the deploy serves `out/` as static files.

## Deploy & sync pipeline

Two GitHub Actions workflows in [.github/workflows/](.github/workflows/):

1. **[deploy.yml](.github/workflows/deploy.yml)** — on push to `main`: `npm ci` → `npm run build` → `touch out/.nojekyll` → `cp CNAME out/CNAME` → upload + deploy to GitHub Pages.
2. **[sync-repos.yml](.github/workflows/sync-repos.yml)** — daily at 06:00 UTC (and `workflow_dispatch`): runs [.github/scripts/sync-repos.js](.github/scripts/sync-repos.js), commits the result with `chore: sync repos [skip ci]`. The `[skip ci]` tag is what prevents the deploy workflow from re-running on every sync — but it also means **a sync alone does not redeploy the site**; a normal commit on `main` is required to push fresh data live.

The sync script:
- Fetches `https://api.github.com/users/razzyshmazzy/repos?per_page=100&sort=updated`.
- Merges with the existing file: preserves the `summary` field on existing entries, adds new repos with `summary: null`.
- Writes to **`repos.json` at the repo root** (not `public/`).
- Uses `GITHUB_TOKEN` for auth. `ANTHROPIC_API_KEY` is wired into the workflow env but the current script does **not** read it — it's reserved for the (not-yet-implemented) summary-generation step.

### ⚠ Known data-pipeline trap: `repos.json` lives in two places

- `repos.json` at repo root — written by the sync workflow, current.
- [public/repos.json](public/repos.json) — what `/repos.json` actually resolves to in the deployed site, last touched 2026-03-25.

The app fetches `/repos.json`, which serves `public/repos.json`. The sync workflow updates the root file but never copies it into `public/`, so **synced data is not reaching the live site** unless someone manually copies it. If you're touching the data pipeline, fix this — either redirect the sync to `public/repos.json` or add a `cp repos.json public/repos.json` step to the deploy workflow before `npm run build`.

## App structure

[src/app/layout.tsx](src/app/layout.tsx) wires the three font CSS variables onto `<html>`, then renders:
- `<NightSky>` — fixed full-viewport starfield (3 twinkle layers, meteors, avatar-comets) behind everything.
- A bare `.sun-orb` div containing `/avatar.png` with three plasma-pulse rings — positioned absolutely as decoration in the upper-right.
- `<div style={{ position: 'relative', zIndex: 1 }}>{children}</div>` so page content stacks above the sky.

[src/app/page.tsx](src/app/page.tsx) is a `'use client'` component (it fetches at runtime). The render order is:

1. `<Hero>` — wraps [NewtonCradleText](src/components/NewtonCradleText.tsx) (the per-letter spring animation on "razzyshmazzy").
2. `<NecoWalker>` — the wandering Neco-Arc sticker (see below).
3. `<QuoteDivider>` — fetches [/quotes.txt](public/quotes.txt), picks one at random, renders text + author.
4. `<RepoGrid>` — fetches `/repos.json`, optionally filters via `/repoHeroes`, sorts by `updatedAt` desc.
5. `<AboutMe>` — fetches [/aboutme.txt](public/aboutme.txt) and renders it.

### `repoHeroes` curation mechanism

`page.tsx` also fetches [/repoHeroes](public/repoHeroes), a plain-text file using `{name` markers (regex `/\{(\S+)/g`). If it exists and contains any names, the repo list is **filtered to only those names**. The current file lists `doccer`, `library`, `atlens` — note `atlens` isn't in `repos.json`, so it's silently dropped. Removing the file (or emptying it) reverts to "show everything."

### `Repo` shape

Defined in [src/types/repo.ts](src/types/repo.ts). Each repo has GitHub metadata plus an optional `summary: RepoSummary | null` (purpose, tech stack, architecture, entry points, key files, setup, open questions, `analyzedAt`). Summaries are populated manually in `repos.json` for now — the cards display "Analysis pending — runs nightly via GitHub Actions" when missing, but no nightly analyzer actually exists yet.

## Components

In use (rendered by `page.tsx` / `layout.tsx`):

- [Hero](src/components/Hero.tsx) + [NewtonCradleText](src/components/NewtonCradleText.tsx) — letter-by-letter spring physics on hover (`SPRING_K`, `DAMPING`, `HOVER_TARGET`); on `mouseleave` the active letter gets a downward fling and a decaying ripple propagates outward to neighbors with `RIPPLE_DELAY` ms per letter distance.
- [NightSky](src/components/NightSky.tsx) — pure-decoration static markup; all motion is CSS keyframes in `globals.css`.
- [NecoWalker](src/components/NecoWalker.tsx) — see dedicated section below.
- [QuoteDivider](src/components/QuoteDivider.tsx) — quote files use `{text\n-author}` format, parsed with `[\s\S]*?` regex blocks.
- [RepoGrid](src/components/RepoGrid.tsx) + inline `RepoCard` — 3/2/1-column responsive grid. `RepoCard` uses the `RepoCard.module.css` perspective hover (translateZ + tilt). `timeAgo` is reimplemented locally rather than shared.
- [AboutMe](src/components/AboutMe.tsx) — renders nothing if the fetch fails or the file is empty.

Built but **currently not wired into any page**:

- [MatrixBackground](src/components/MatrixBackground.tsx) — repeating katakana grid with staggered pulse animations (cyan, not noir).
- [StatsRow](src/components/StatsRow.tsx) — repo count / stars / lang count / top language.
- [FilterBar](src/components/FilterBar.tsx) — lang pills + sort select + search input. The matching CSS for `.filter-bar`, `.lang-btn`, `#sort-select`, `#search-input` already lives in `globals.css`.
- [DonutChart](src/components/DonutChart.tsx) — pure-SVG language donut (greyscale palette in [DonutChart.tsx](src/components/DonutChart.tsx)).
- [BFModal](src/components/BFModal.tsx) + [src/lib/bf.ts](src/lib/bf.ts) — minimal brainf*ck interpreter; `BF_CODE` prints `Hi!`. Modal markup styled by `#bf-modal` rules in `globals.css`.
- [src/lib/fuzzy.ts](src/lib/fuzzy.ts) — fuzzy subsequence scorer + `fuzzyFilter` (weights: name 1.0, description 0.7, language 0.5, threshold 0.3).
- [src/components/ui/button.tsx](src/components/ui/button.tsx) — shadcn button. The shadcn token overrides at the bottom of `globals.css` exist for this; nothing imports it yet.

When wiring any of these in, the CSS is already there — don't re-author it.

## NecoWalker — the nontrivial one

[src/components/NecoWalker.tsx](src/components/NecoWalker.tsx) is the only component with real complexity. It runs a phase machine (`idle | walking | standing | emoting | falling | staring | dragging`) that drives a Neco-Arc sticker around the page. Two render layers:

- An `<img>` (96px tall) for static / walking / emoting / staring frames — animated GIFs and static stickers from [public/neco-stickers/](public/neco-stickers/).
- A `<canvas>` (300px tall) used **only** during fall and drag, drawn from pre-decoded composite frames of `/neco-falling.gif` (parsed once via `gifuct-js`).

Things to know before touching it:

- **Surface detection** (`isVisualElement`, `findNearestSurface`): scans all `document.body` elements and treats anything with a visible background/border/box-shadow, an intrinsic visual tag (`IMG/SVG/CANVAS/VIDEO/INPUT/BUTTON/...`), or visible text in a content tag wider than `MIN_TEXT_SURFACE_WIDTH` (60px) as walkable ground. Elements with `pointer-events: none` are excluded — that's the escape hatch for decorative overlays. The "razzyshmazzy" h1 is the explicit baseline that `MIN_TEXT_SURFACE_WIDTH` is tuned to.
- **Falling physics:** quadratic ease-in (`G_PX_PER_MS2 = 0.002`), with `MIN_FALL_DURATION = 200` ms floor. Every `RESCAN_INTERVAL` (5) ticks the fall re-scans for a closer surface and remaps remaining duration + frame index — this handles content that mounts/expands mid-fall.
- **Edge falls:** while walking on a surface, char-center exiting the surface's left/right edge triggers `triggerEdgeFall()`; the canvas position is shifted by `HEIGHT - FALL_HEIGHT` to keep the visual bottom anchored as the layer swaps.
- **Scroll trigger:** the first time `scrollY >= basePageY` while walking on-screen, Neco falls off the top section onto whatever's below. Guarded by `scrollFallDone` so it fires once.
- **Drag:** mouse + touch handlers on both the img and the canvas. Drag swaps to the canvas at z-index 9999, releases call `beginFall(lastCursorX)`.
- **Idle sequence:** after walking `randRange(WALK_MIN_MS, WALK_MAX_MS)` ms while on-screen, picks `randInt(EMOTE_MIN_COUNT, EMOTE_MAX_COUNT)` random emotes from `EMOTE_SRCS`, with `STAND_PAUSE_MIN_MS..STAND_PAUSE_MAX_MS` between, then resumes walking — `moveMode` flips to `'run'` 35% of the time (`RUN_SPEED_MULT = 2.2`).
- **Preloading:** all stickers + run/standing sprites are eagerly preloaded with `new Image()` so transitions don't pop.

If you change DOM that the walker lands on, sanity-check: does the new element pass `isVisualElement`? If decorative, mark it `pointer-events: none`. If it should be walkable but isn't being detected, check the bg/border/text-width conditions.

## Styling

- **Single monolithic stylesheet:** [src/app/globals.css](src/app/globals.css) (~1070 lines) holds Tailwind imports, design tokens, *all* component styles (hero, night-sky, quote-divider, stats-row, filter-bar, repos-grid, about-me, donut chart, bf-modal, footer), keyframes, and responsive overrides. `RepoCard.module.css` and `MatrixBackground.module.css` are the only CSS modules.
- **Noir B&W token set** in `:root` (`--bg #050505`, `--surface #111`, `--border #222`, `--text #d0d0d0`, `--muted #666`, `--accent #fff`). These are declared **after** the shadcn token block at the bottom of the file specifically to win cascade specificity — don't reorder.
- **Static export = no `next/image`.** All `<img>` tags are raw HTML with `eslint-disable-next-line @next/next/no-img-element`. Don't try to introduce `next/image`; it won't optimize anyway and will fail the export.
- **Body background is `#050505`**, with `<NightSky position: fixed; z-index: 0>` painting the actual visible backdrop. Anything that needs to sit above must establish its own stacking context (the layout's children wrapper does this with `position: relative; z-index: 1`).

## Repo conventions & traps

- **Git hygiene is loose.** [.gitignore](.gitignore) only excludes `node_modules`, so `.next/` and `out/` build artifacts get committed and constantly show up in `git status` (often as duplicate `" 2"`/`" 3"` files from iCloud Drive sync). Don't try to "clean these up" as part of an unrelated change — it's churn. If you're explicitly fixing this, add `.next/`, `out/`, `*.tsbuildinfo` to `.gitignore` and remove from the index in a single dedicated commit.
- **iCloud-Drive duplicate files:** [src/app/page 2.tsx](src/app/page%202.tsx) is a stale copy of [src/app/page.tsx](src/app/page.tsx) (older — missing the `repoHeroes` filter logic). Same pattern with `quotes.txt` (duplicated at [public/quotes.txt](public/quotes.txt) and root-level [quotes.txt](quotes.txt)). The "real" file is the one in `public/` or `src/app/`. The space-numbered copies are noise — safe to delete, but they keep coming back from the sync.
- **Recent commit history is dominated by `chore: sync repos [skip ci]`.** Filter past these when running `git log` to find real changes.
- **Root-level scratch files** ([idea.txt](idea.txt), [writing.txt](writing.txt), [.txt](.txt), [quotes.txt](quotes.txt)) are personal notes; nothing in `src/` or the build references them. Don't ship behavior changes that depend on them.
- **ESLint config** ([eslint.config.mjs](eslint.config.mjs)) explicitly re-asserts the `.next/`, `out/`, `build/`, `next-env.d.ts` ignores because `defineConfig` overrides `eslint-config-next`'s defaults.
- **`neco-arc/` at the repo root** is the source-asset folder (`.gif`/`.png` originals + `stickers/` subfolder). Runtime stickers live in [public/neco-stickers/](public/neco-stickers/) as `.webp`. If you add a new sticker, drop the `.webp` in `public/neco-stickers/` and add the path to `EMOTE_SRCS` in `NecoWalker.tsx`.

## Local development

```bash
npm install
npm run dev       # http://localhost:3000
```

To regenerate `repos.json` locally without waiting for the workflow:

```bash
npm install --prefix .github/scripts
GITHUB_TOKEN=<token> REPO_OWNER=razzyshmazzy node .github/scripts/sync-repos.js
```

Then (until the public/ vs root divergence is fixed) copy it: `cp repos.json public/repos.json`.
