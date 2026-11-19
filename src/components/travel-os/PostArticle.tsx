import type { PublishedPost } from '@/content/blog/publication'
import { getArchiveForPost, parseBlogDate } from '@/content/blog/publication'
import {
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  siteConfig,
} from '@/lib/seo'
import { PostBody } from '@/components/travel-os/PostBody'

function readableDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parseBlogDate(date))
}

export function PostArticle({ post }: { post: PublishedPost }) {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-10 sm:px-10 sm:py-14">
      <header className="flex flex-col gap-4">
        <h1
          tabIndex={-1}
          className="font-serif text-4xl leading-tight font-semibold tracking-tight outline-none sm:text-5xl"
        >
          {post.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {post.location} · {readableDate(post.date)}
        </p>
      </header>

      <PostBody post={post} />
    </article>
  )
}

export function PostPresentation({ post }: { post: PublishedPost }) {
  const archive = getArchiveForPost(post)
  const articleJsonLd = generateArticleJsonLd(post)
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Today', url: siteConfig.url },
    ...(archive
      ? [
          {
            name: archive.displayDate,
            url: `${siteConfig.url}${archive.url}`,
          },
        ]
      : []),
    {
      name: post.title,
      url: `${siteConfig.url}${post.url}`,
    },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <PostArticle post={post} />
    </>
  )
}
