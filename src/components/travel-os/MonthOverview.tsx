import { MapPin } from 'lucide-react'

import { DetailLink } from '@/components/travel-os/DetailLink'
import { CountryFlag } from '@/components/travel-os/CountryFlag'
import {
  MonthGallery,
  type MonthGalleryItem,
} from '@/components/travel-os/MonthGallery'
import { Badge } from '@/components/ui/badge'
import type { BlogArchive, PublishedPost } from '@/content/blog/publication'
import { parseBlogDate } from '@/content/blog/publication'

function shortDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(parseBlogDate(date))
}

export function MonthOverview({
  archive,
  posts,
}: {
  archive: BlogArchive
  posts: PublishedPost[]
}) {
  const countries = [
    ...new Set(
      posts
        .map((post) => post.country)
        .filter((country): country is string => Boolean(country)),
    ),
  ]
  const galleryItems = [
    ...new Map(
      posts.flatMap((post): [string, MonthGalleryItem][] => {
        const image = post.images[0]
        if (!image) return []

        return [
          [
            image.src,
            {
              src: image.src,
              alt: image.alt,
              label: post.title,
              meta: `${shortDate(post.date)} · ${post.location}`,
              imagePosition: image.imagePosition,
            },
          ],
        ]
      }),
    ).values(),
  ].slice(0, 8)

  if (galleryItems.length === 0) {
    galleryItems.push({
      src: archive.image,
      alt: `${archive.displayDate} cover`,
      label: archive.displayDate,
      meta: `${posts.length} entries`,
    })
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 sm:py-12">
      <header className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,26rem)] lg:items-center lg:gap-12 lg:pb-12">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {archive.displayDate}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {archive.excerpt}
          </p>
        </div>
        <div className="lg:self-center">
          <MonthGallery
            key={archive.url}
            items={galleryItems}
            title={archive.displayDate}
          />
        </div>
      </header>

      <section
        aria-labelledby="entries-heading"
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="entries-heading" className="text-3xl font-semibold">
            Entries
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Badge>
              <span className="font-mono tabular-nums">{posts.length}</span>
              entries
            </Badge>
            {countries.map((country) => (
              <Badge key={country} variant="outline">
                <CountryFlag country={country} />
                {country}
              </Badge>
            ))}
          </div>
        </div>

        <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id} className="h-full min-w-0">
              <DetailLink
                detailId={post.id}
                href={post.url}
                className="group flex h-full min-h-28 flex-col justify-between gap-4 rounded-xl border bg-card p-5 outline-none transition-colors hover:border-ring/40 hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                  <time dateTime={post.date} className="shrink-0">
                    {shortDate(post.date)}
                  </time>
                  <span className="inline-flex min-w-0 items-center gap-1">
                    <MapPin className="size-3 shrink-0" />
                    <span className="truncate">{post.location}</span>
                  </span>
                </div>
                <span className="font-heading text-base font-semibold leading-snug tracking-tight">
                  {post.title}
                </span>
              </DetailLink>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
