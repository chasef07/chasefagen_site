import { describe, expect, test } from 'bun:test'

import { posts } from '@/content/blog/publication'
import {
  generateArticleJsonLd,
  generatePageMetadata,
  generatePostMetadata,
} from '@/lib/seo'

describe('social metadata', () => {
  test('uses the Chase Fagen Blog brand card', () => {
    const metadata = generatePageMetadata({
      title: 'World',
      description: 'Travel notes organized by country.',
      path: '/world',
    })

    expect(metadata.openGraph).toMatchObject({
      title: 'Chase Fagen Blog',
      description: 'Travel stories and notes from Chase Fagen.',
      images: [
        {
          url: 'https://chasefagen.com/opengraph-image',
          width: 1200,
          height: 630,
          alt: 'Chase Fagen Blog',
        },
      ],
    })
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'Chase Fagen Blog',
      description: 'Travel stories and notes from Chase Fagen.',
      images: ['https://chasefagen.com/opengraph-image'],
    })
  })

  test('keeps article metadata while branding its social preview', () => {
    const post = posts[0]
    const metadata = generatePostMetadata(post)

    expect(metadata.title).toBe(`${post.title} | Chase Fagen Blog`)
    expect(metadata.openGraph).toMatchObject({
      title: 'Chase Fagen Blog',
      type: 'article',
      url: `https://chasefagen.com${post.url}`,
    })
  })
})

describe('article structured dates', () => {
  test('uses ISO dates for legacy display-date posts', () => {
    const post = posts.find((post) => post.date === 'July 26, 2026')!
    expect(generateArticleJsonLd(post)).toMatchObject({
      datePublished: '2026-07-26T00:00:00.000Z',
      dateModified: '2026-07-26T00:00:00.000Z',
    })
  })
})
