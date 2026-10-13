import { Metadata } from 'next'
import { BlogPost } from '@/types/blog'
import type { PublishedPost } from '@/content/blog/publication'
import { monthSlug, parseBlogDate, postPath } from '@/content/blog/publication'

/**
 * SEO configuration and utilities for Chase Fagen's travel journal.
 */

export const siteConfig = {
  name: 'Chase Fagen Blog',
  description: 'Travel stories and notes from Chase Fagen.',
  url: 'https://chasefagen.com',
  socialImage: '/opengraph-image',
  author: {
    name: 'Chase Fagen',
    email: 'fagenchase@gmail.com',
    twitter: '@chasef07',
    instagram: '@chasef07',
  },
  keywords: [
    'travel journal',
    'travel stories',
    'authentic travel stories',
    'travel photography',
  ],
} as const

/**
 * Generate comprehensive metadata for pages
 */
export function generatePageMetadata({
  title,
  description,
  path = '',
  type = 'website',
  publishedTime,
  modifiedTime,
  keywords = [],
}: {
  title: string
  description: string
  path?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  keywords?: string[]
}): Metadata {
  const url = `${siteConfig.url}${path}`
  const fullTitle = title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`

  const socialImage = `${siteConfig.url}${siteConfig.socialImage}`

  return {
    title: fullTitle,
    description,
    keywords: [...siteConfig.keywords, ...keywords].join(', '),
    authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: siteConfig.name,
      description: siteConfig.description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
      locale: 'en_US',
      type,
      ...(type === 'article' &&
        publishedTime && {
          publishedTime,
          modifiedTime: modifiedTime || publishedTime,
          authors: [siteConfig.author.name],
          section: 'Travel',
          tags: keywords,
        }),
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name,
      description: siteConfig.description,
      images: [socialImage],
      creator: siteConfig.author.twitter,
      site: siteConfig.author.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function generatePostMetadata(post: PublishedPost): Metadata {
  return generatePageMetadata({
    title: post.title,
    description: post.excerpt,
    path: post.url,
    type: 'article',
    publishedTime: parseBlogDate(post.date).toISOString(),
    modifiedTime: parseBlogDate(post.date).toISOString(),
    keywords: [
      `${post.location} travel`,
      ...(post.country ? [`${post.country} travel journal`] : []),
      'solo travel stories',
      'travel photography',
    ],
  })
}

/**
 * Generate JSON-LD structured data for articles
 */
export function generateArticleJsonLd(
  post: BlogPost,
  images: string[] = [],
): object {
  const imageUrls =
    images.length > 0
      ? images
      : post.images?.map((img) =>
          img.src.startsWith('http') ? img.src : `${siteConfig.url}${img.src}`,
        ) || []

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: imageUrls,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
      sameAs: [
        `https://twitter.com/${siteConfig.author.twitter?.replace('@', '')}`,
        `https://instagram.com/${siteConfig.author.instagram?.replace('@', '')}`,
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    datePublished: parseBlogDate(post.date).toISOString(),
    dateModified: parseBlogDate(post.date).toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}${postPath(
        post.year,
        monthSlug(post.date),
        post.slug,
      )}`,
    },
    articleSection: 'Travel',
    keywords: [
      'travel',
      post.location,
      `${post.location} travel`,
      'travel blog',
    ],
    locationCreated: {
      '@type': 'Place',
      name: post.location,
    },
    ...(post.readingTime && {
      timeRequired: `PT${post.readingTime}M`,
    }),
  }
}

/**
 * Generate JSON-LD for website/organization
 */
export function generateWebsiteJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    sameAs: [
      `https://twitter.com/${siteConfig.author.twitter?.replace('@', '')}`,
      `https://instagram.com/${siteConfig.author.instagram?.replace('@', '')}`,
    ],
  }
}

/**
 * Generate JSON-LD for breadcrumb navigation
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
