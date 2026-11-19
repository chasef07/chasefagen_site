export {}

const base = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '')

const sitemap = await fetch(`${base}/sitemap.xml`).then((response) =>
  response.text(),
)
const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  ([, loc]) => new URL(loc).pathname,
)
if (sitemapPaths.length === 0) throw new Error('sitemap.xml listed no pages')

const expectations: [path: string, status: number][] = [
  ...sitemapPaths.map((path): [string, number] => [path, 200]),
  ['/blog', 200],
  ['/countries', 200],
  ['/feed.xml', 200],
  ['/robots.txt', 200],
  ['/blog/2026/anywhere', 200],
  ['/blog/2026/november/no-such-entry', 404],
  ['/no-such-page', 404],
]

const failures: string[] = []
for (const [path, expected] of expectations) {
  const response = await fetch(`${base}${path}`)
  if (response.status !== expected) {
    failures.push(`${path} returned ${response.status}, expected ${expected}`)
  }
}

console.log(
  `${expectations.length - failures.length}/${expectations.length} routes as expected`,
)
if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exit(1)
}
