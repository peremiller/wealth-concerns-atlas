# Wealth Concerns Atlas

Interactive explorer of the topmost concerns of millionaires, billionaires, and the apex tier — **24 concerns × 120 rated solutions = 2,880 total**. Built with React + Vite.

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

## Data
`public/data.json` holds the full rated dataset. Regenerate it from the source `millionaire-solutions` parts if ratings change.

> Ratings are directional editorial judgments, not personalized financial, legal, or security advice.

<!-- deployed via GitHub auto-deploy -->
