import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'

import { parseBlogDate, posts } from '@/content/blog/publication'

test('RSS publication dates preserve calendar days outside UTC', () => {
  const result = spawnSync(
    process.execPath,
    [
      '-e',
      `import { GET } from ${JSON.stringify(new URL('./route.ts', import.meta.url).pathname)}; console.log(await (await GET()).text())`,
    ],
    { env: { ...process.env, TZ: 'America/New_York' }, encoding: 'utf8' },
  )

  expect(result.status).toBe(0)
  const items = result.stdout.match(/<item>[\s\S]*?<\/item>/g) ?? []
  const orderedPosts = [...posts].sort(
    (left, right) =>
      parseBlogDate(right.date).getTime() - parseBlogDate(left.date).getTime(),
  )
  expect(items).toHaveLength(posts.length)
  for (const [index, post] of orderedPosts.entries()) {
    expect(items[index]).toContain(
      `<guid isPermaLink="true">https://chasefagen.com${post.url}</guid>`,
    )
    expect(items[index]).toContain(
      `<pubDate>${parseBlogDate(post.date).toUTCString()}</pubDate>`,
    )
  }
})
