# GitHub Star Trending

> Discover the fastest-growing open-source projects on GitHub, ranked by star growth (daily / weekly / monthly).

[中文文档](./README_zh.md) | **English**

## Features

- **Real Star Growth Data** — Scrapes GitHub Trending pages for authentic star growth metrics, not total stars
- **Time Range Filters** — Switch between Daily, Weekly, and Monthly growth rankings
- **Top 20 Projects** — Aggregates multiple language-specific trending pages to ensure 20 results
- **Glassmorphism Dark UI** — Modern dark theme with frosted glass cards, aurora gradient background, and smooth micro-interactions
- **Fully Responsive** — Single column on mobile, dual column on desktop
- **Bilingual** — Chinese / English toggle with `localStorage` persistence
- **5-Minute Cache** — Server-side in-memory cache to reduce repeated requests

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Language | TypeScript |
| Data Source | GitHub Trending HTML scraping |
| HTTP Proxy | undici (ProxyAgent) |
| Fonts | Geist Sans + Geist Mono |

## Getting Started

### Prerequisites

- Node.js 18.17+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://gitee.com/ThreeHo/github_star_trending.git
cd github_star_trending

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Proxy Configuration (Optional)

If you're behind a proxy (e.g. Clash, V2Ray), create a `.env.local` file:

```env
HTTPS_PROXY=http://127.0.0.1:7890
HTTP_PROXY=http://127.0.0.1:7890
```

## Project Structure

```
├── app/
│   ├── api/trending/route.ts   # API route with 5-min cache
│   ├── globals.css             # Global styles (glassmorphism, animations)
│   ├── layout.tsx              # Root layout with fonts
│   └── page.tsx                # Main page
├── components/
│   ├── Header.tsx              # Sticky header with gradient title
│   ├── LocaleSwitcher.tsx      # Language toggle button
│   ├── RepoCard.tsx            # Glassmorphic repo card with growth badge
│   ├── RepoList.tsx            # Grid layout with shimmer skeleton
│   └── TimeTabs.tsx            # Gradient pill tabs (daily/weekly/monthly)
├── lib/
│   ├── github.ts               # GitHub Trending scraper + multi-language merge
│   └── i18n.tsx                # React Context i18n (zh/en)
└── package.json
```

## Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm run start
```

## License

MIT
