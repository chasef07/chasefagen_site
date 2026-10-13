import { describe, expect, test } from 'bun:test'

import {
  archiveStaticParams,
  archives,
  createBlogPublication,
  getArchive,
  getPost,
  getPostsForArchive,
  postStaticParams,
  parseBlogDate,
} from './publication'

describe('Blog publication interface', () => {
  test('gives Archives and Posts explicit canonical paths', () => {
    const archive = getArchive('2026', 'july')
    const post = getPost('2026', 'july', 'european-living-in-ericeira')

    expect(archive?.url).toBe('/blog/2026/july')
    expect(post?.url).toBe('/blog/2026/july/european-living-in-ericeira')
    expect(getPost('2026', 'july', 'missing')).toBeUndefined()
  })

  test('publishes the San Francisco post in the September archive', () => {
    const post = getPost('2026', 'september', 'five-days-in-san-francisco')

    expect(post).toMatchObject({
      date: '2026-09-06',
      location: 'San Francisco, California',
      url: '/blog/2026/september/five-days-in-san-francisco',
    })
    expect(
      getPostsForArchive('2026', 'september').map(({ url }) => url),
    ).toContain('/blog/2026/september/five-days-in-san-francisco')
  })

  test('publishes separate static parameters for Archives and Posts', () => {
    const archivePaths = archiveStaticParams()
    const postPaths = postStaticParams()
    const archiveKeys = archivePaths.map(
      ({ year, month }) => `${year}/${month}`,
    )
    const postKeys = postPaths.map(
      ({ year, month, postSlug }) => `${year}/${month}/${postSlug}`,
    )

    expect(new Set(archiveKeys).size).toBe(archiveKeys.length)
    expect(new Set(postKeys).size).toBe(postKeys.length)
    expect(
      archivePaths.every(({ year, month }) => getArchive(year, month)),
    ).toBe(true)
    expect(
      postPaths.every(({ year, month, postSlug }) =>
        getPost(year, month, postSlug),
      ),
    ).toBe(true)
  })

  test('derives archive routes for months represented by posts', () => {
    const september = getArchive('2025', 'september')

    expect(september?.url).toBe('/blog/2025/september')
    expect(getPostsForArchive('2025', 'september')).toHaveLength(1)
  })

  test('uses deterministic reading times and canonical archive URLs', () => {
    const july = getArchive('2026', 'july')

    expect(july?.url).toBe('/blog/2026/july')
    expect(
      getPostsForArchive('2026', 'july').every((post) => post.readingTime > 0),
    ).toBe(true)
    expect(archives.every((archive) => archive.url.startsWith('/blog/'))).toBe(
      true,
    )
  })

  test('keeps empty Archives addressable without guessing route kind', () => {
    const empty = createBlogPublication([], [archives[0]])

    expect(
      empty.getArchive(String(archives[0].year), archives[0].slug)?.url,
    ).toBe(archives[0].url)
    expect(
      empty.getPostsForArchive(String(archives[0].year), archives[0].slug),
    ).toEqual([])
  })

  test('rejects malformed Archive calendar identities', () => {
    expect(() =>
      createBlogPublication(
        [],
        [{ ...archives[0], slug: 'not-a-month', date: 'not-a-date' }],
      ),
    ).toThrow('Malformed Blog date')
    expect(() =>
      createBlogPublication(
        [],
        [{ ...archives[0], year: archives[0].year - 1 }],
      ),
    ).toThrow('Invalid Archive calendar identity')
  })
})

describe('Blog calendar dates', () => {
  test('reads ISO and legacy display dates as the same UTC calendar day', () => {
    expect(parseBlogDate('2026-07-26').toISOString()).toBe(
      '2026-07-26T00:00:00.000Z',
    )
    expect(parseBlogDate('July 26, 2026').toISOString()).toBe(
      '2026-07-26T00:00:00.000Z',
    )
    expect(parseBlogDate('2024-02-29').toISOString()).toBe(
      '2024-02-29T00:00:00.000Z',
    )
  })

  test('rejects impossible days instead of moving entries into another month', () => {
    for (const date of [
      '2026-02-30',
      'February 29, 2025',
      'April 31, 2026',
      '2026-13-01',
      'not-a-date',
    ]) {
      expect(() => parseBlogDate(date)).toThrow('Malformed Blog date')
    }
  })
})
