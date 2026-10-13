# Chase Fagen Travel Journal

A personal travel journal built with Next.js 16 and React 19. The site combines a date-based reader, a 3D world view, country dossiers, and video and packing notes from the route.

## Features

- Journal home with the latest entry and date-matched entries from prior years
- Monthly Archives and individual Posts with canonical paths and reading times
- Interactive Three.js globe with a country flag index and country dossiers
- Country food notes, vlogs, and a carry-on packing collection
- RSS feed, sitemap, structured data, and social metadata
- Responsive App Router interface with parallel-route detail panels
- Vercel Analytics and Speed Insights

## Stack

- Next.js 16.4 and React 19.3
- TypeScript 6
- Tailwind CSS 4 and shadcn/ui primitives
- React Three Fiber, Drei, and Three.js
- Bun 1.4.3

Production builds use Webpack because the globe integration is configured for it.

## Getting started

Install [Bun](https://bun.sh/) 1.4.3 (the packageManager version), then run:

```bash
bun install --frozen-lockfile
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
bun run dev          # Start the development server with Webpack
bun test             # Run the Bun test suite
bun run format       # Format the repository
bun run format:check # Check formatting
bun run lint         # Run ESLint
bun run build        # Create a production build with Webpack
bun run check        # Run format, lint, and build checks
bun run start        # Serve an existing production build
```

## Routes

| Route                             | Purpose                                                        |
| --------------------------------- | -------------------------------------------------------------- |
| `/`                               | Latest journal entry and entries from this date in prior years |
| `/blog/[year]/[month]`            | Monthly Archive                                                |
| `/blog/[year]/[month]/[postSlug]` | Individual Post                                                |
| `/world`                          | Interactive globe and country index                            |
| `/countries/[country]`            | Country dossier with related posts, archives, and food notes   |
| `/vlogs`                          | Travel videos                                                  |
| `/packing-checklist`              | Carry-on packing list                                          |
| `/feed.xml`                       | RSS feed                                                       |

`/blog` redirects to `/`, and `/countries` redirects to `/world`.

## Project structure

```text
src/
├── app/                    # App Router pages, parallel routes, metadata, and feed
├── components/
│   ├── globe/              # 3D globe experience
│   ├── travel-os/          # Journal reader, navigation, and dossier modules
│   └── ui/                 # Shared interface primitives
├── content/
│   ├── blog-posts/         # Raw monthly Post records
│   ├── blog-registry.ts    # Raw Post and Archive registry
│   ├── blog/publication.ts # Canonical publication derivation and lookup interface
│   └── *.ts                # Country, food, and vlog records
├── lib/                    # Journal, SEO, navigation, and shared helpers
├── types/                  # Shared content types
└── utils/                  # Globe and map-data helpers

public/
├── assets/                 # Journal images and other static media
└── data/                   # GeoJSON used by the globe
```

## Adding a Blog Post

1. Add the Post record to `src/content/blog-posts/YYYY-month.ts`.
2. Import and spread that month into `allBlogPosts` in `src/content/blog-registry.ts`.
3. Add an explicit `BlogArchive` record when the month needs curated title, excerpt, or image metadata. The publication module derives an Archive when one is omitted.
4. Put local images under `public/assets/images/` and reference them with `/assets/images/...` paths.
5. Run `bun test && bun run check`.

The raw registry is the source of content records. `src/content/blog/publication.ts` is the sole module that validates calendar identity and derives canonical paths, missing Archives, reading times, static parameters, country projections, and card-image fallbacks.

## Configuration and deployment

The site builds for Vercel with `bun run build`. Set `NEXT_PUBLIC_GA_ID` only when Google Analytics is required; Vercel Analytics and Speed Insights are included directly in the root layout.

Site identity, canonical URL, and social metadata live in `src/lib/seo.ts`.
