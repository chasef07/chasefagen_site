import { siteConfig } from '@/lib/seo'
import { parseBlogDate, posts } from '@/content/blog/publication'

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const baseUrl = siteConfig.url

  const sortedPosts = [...posts].sort(
    (a, b) => parseBlogDate(b.date).getTime() - parseBlogDate(a.date).getTime(),
  )

  const rssItems = sortedPosts
    .map((post) => {
      const postUrl = `${baseUrl}${post.url}`
      const pubDate = parseBlogDate(post.date).toUTCString()

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <author>${siteConfig.author.email} (${siteConfig.author.name})</author>
      <category>Travel</category>
    </item>`
    })
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>${escapeXml(siteConfig.name)}</title>
      <link>${baseUrl}</link>
    </image>
    <managingEditor>${siteConfig.author.email} (${siteConfig.author.name})</managingEditor>
    <webMaster>${siteConfig.author.email} (${siteConfig.author.name})</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} ${siteConfig.author.name}</copyright>
    <ttl>60</ttl>
${rssItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
