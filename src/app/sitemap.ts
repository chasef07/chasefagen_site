import { MetadataRoute } from 'next'
import { archives, parseBlogDate, posts } from '@/content/blog/publication'
import { countryPages } from '@/content/world-journey'
import { siteConfig } from '@/lib/seo'

/**
 * Dynamic sitemap generation for the travel journal.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url
  const currentDate = new Date()

  // Main static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/world`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/vlogs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/packing-checklist`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  const countryPageEntries: MetadataRoute.Sitemap = countryPages.map(
    (country) => ({
      url: `${baseUrl}/countries/${country.slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    }),
  )

  const monthlyArchivePages: MetadataRoute.Sitemap = archives.map((archive) => {
    const archiveDate = parseBlogDate(archive.date)
    const isRecent =
      currentDate.getTime() - archiveDate.getTime() < 90 * 24 * 60 * 60 * 1000

    return {
      url: `${baseUrl}${archive.url}`,
      lastModified: archiveDate,
      changeFrequency: isRecent ? 'weekly' : ('monthly' as const),
      priority: isRecent ? 0.8 : 0.6,
    }
  })

  const individualPostPages: MetadataRoute.Sitemap = posts.map((post) => {
    const postDate = parseBlogDate(post.date)
    const isRecent =
      currentDate.getTime() - postDate.getTime() < 90 * 24 * 60 * 60 * 1000

    return {
      url: `${baseUrl}${post.url}`,
      lastModified: postDate,
      changeFrequency: isRecent ? 'weekly' : ('monthly' as const),
      priority: isRecent ? 0.9 : 0.7,
    }
  })

  return [
    ...staticPages,
    ...countryPageEntries,
    ...monthlyArchivePages,
    ...individualPostPages,
  ]
}
