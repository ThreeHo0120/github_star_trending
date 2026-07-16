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
git clone https://gitee.com/ThreeHo/git-hub_-star_-trending.git
cd git-hub_-star_-trending

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
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
