# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Development

Use Bun, with the version specified by `packageManager` in `package.json`.
See `README.md` for setup, commands, routes, and content authoring instructions.
Development and production builds explicitly use Webpack.

Run `bun test` for content and behavior checks, and `bun run check` for
formatting, lint, and a production build.

## Content ownership

Raw Post and Archive records live in `src/content/blog-registry.ts` and
`src/content/blog-posts/`. `src/content/blog/publication.ts` validates calendar
identity and owns canonical paths, reading times, derived Archives, and lookups.
Use its date parser for both ISO calendar dates and legacy display dates.

`src/lib/journal.ts` groups published entries into journal years and months.
`src/lib/seo.ts` owns the site identity, canonical URL, metadata, and structured
data. The App Router exposes the RSS feed, sitemap, and robots directives.

## Configuration

Check `package.json`, `next.config.ts`, and `vercel.json` for current dependencies
and deployment settings. Do not infer runtime behavior from the build package
manager. Use the `@/` alias for imports from `src/`.

Keep content wording intact unless an edit is requested. Keep calendar identity
and route derivation in the publication module rather than duplicating them in
pages or feeds.
