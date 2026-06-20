# Wealth Concerns Atlas

[![CI](https://github.com/peremiller/wealth-concerns-atlas/actions/workflows/ci.yml/badge.svg)](https://github.com/peremiller/wealth-concerns-atlas/actions/workflows/ci.yml)

Interactive explorer of the topmost concerns of millionaires, billionaires, and the apex tier — **24 concerns × 120 rated solutions = 2,880 total**. Built with React + Vite.

**Live:** [wealthconcerns.vercel.app](https://wealthconcerns.vercel.app)

## Features
- **Dashboard** — metric cards + interactive quick-wins bar chart (click a bar to drill in) + tier breakdown + top opportunities.
- **Explore** — full-text search over all 2,880 solutions, filter by tier / priority / effort / cost, and quick-wins-only.
- **Shareable URLs** — every view, filter, search, and open concern is encoded in the URL hash. Copy the link via "Share view".
- **Export CSV** — download the currently filtered solutions.
- **Compare** — two concerns side by side (top 10 each).
- **Print** — print-optimized stylesheet (expands all, hides chrome).
- Light/dark theme, fully responsive.

Each solution is rated on **Priority** (impact), **Effort** (difficulty), and **Cost** ($/$$/$$$). A **quick win** is High priority + Low effort.

## Develop
```bash
npm install
npm run dev      # http://localhost:8100
```

## Build
```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build
```

## Deploy to Vercel
The repo is preconfigured (`vercel.json`, framework: vite). Either:

**CLI**
```bash
npm i -g vercel        # or use npx
vercel login           # one-time auth
vercel --prod          # deploy
```

**Git / Dashboard** — push to GitHub and import the repo at vercel.com; it auto-detects Vite (build `vite build`, output `dist`). No env vars needed.

## Development workflow (preview before promoting)
`main` is the production branch — it auto-deploys to the live domains. Never commit directly to it. Instead:

1. **Branch**: `git checkout -b feat/my-change`
2. **Push & open a PR** to `main`: `git push -u origin feat/my-change` then `gh pr create`
3. **CI runs** automatically (`.github/workflows/ci.yml` → lint + build). The PR can't be merged until it passes.
4. **Preview deploy**: Vercel builds a unique preview URL for the PR and posts it as a check/comment — open it to review the change live (preview deployments are login-gated).
5. **Promote**: merge the PR → `main` auto-deploys to production.

Run the same checks locally before pushing:
```bash
npm run lint
npm run build
```

## Automated maintenance
- **Dependabot** opens weekly grouped dependency PRs (npm + GitHub Actions).
- **Auto-merge** (`.github/workflows/dependabot-automerge.yml`): patch and minor Dependabot PRs are set to auto-merge — they merge themselves once the `build` check passes. Major version bumps are left for manual review.

## Data
`public/data.json` holds the full rated dataset. Regenerate it from the source `millionaire-solutions` parts if ratings change.

> Ratings are directional editorial judgments, not personalized financial, legal, or security advice.

<!-- deployed via GitHub auto-deploy -->
