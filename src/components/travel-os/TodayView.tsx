import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Globe2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { DetailLink } from '@/components/travel-os/DetailLink'
import type { PublishedPost } from '@/content/blog/publication'
import { parseBlogDate } from '@/content/blog/publication'
import { isPreoptimizedImage } from '@/lib/images'
import type { JournalEcho, JournalMonth } from '@/lib/journal'

function proximityLabel(offsetDays: number) {
  if (offsetDays === 0) return 'Same day'
  const days = Math.abs(offsetDays)
  return `${days} day${days === 1 ? '' : 's'} ${offsetDays < 0 ? 'before' : 'after'}`
}

function fullDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

function entryDate(post: PublishedPost) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parseBlogDate(post.date))
}

export function TodayView({
  today,
  echoes,
  latestMonth,
  latestPost,
}: {
  today: Date
  echoes: JournalEcho[]
  latestMonth: JournalMonth
  latestPost: PublishedPost
}) {
  const latestImage = latestPost.images[0]

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10">
      <header className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
          {fullDate(today)}
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="rounded-full"
          >
            <Link href={latestMonth.href}>{latestMonth.displayDate}</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link href="/world">
              <Globe2 data-icon="inline-start" />
              World
            </Link>
          </Button>
        </div>
      </header>

      <Separator />

      <DetailLink
        detailId={latestPost.id}
        href={latestPost.url}
        className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Card
          className={`h-full gap-0 overflow-hidden py-0 transition-colors group-hover:bg-accent/40 ${
            latestImage
              ? 'lg:grid lg:grid-cols-[minmax(20rem,0.85fr)_minmax(0,1.15fr)]'
              : ''
          }`}
        >
          {latestImage && (
            <div className="relative aspect-[4/3] overflow-hidden bg-muted lg:aspect-auto lg:min-h-96">
              <Image
                src={latestImage.src}
                alt=""
                fill
                unoptimized={isPreoptimizedImage(latestImage.src)}
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-contain"
                style={{ objectPosition: latestImage.imagePosition }}
              />
            </div>
          )}
          <div className="flex flex-col justify-center gap-5 py-6 lg:py-8">
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="shrink-0 rounded-xl bg-muted p-3 text-primary">
                <BookOpen className="size-5" aria-hidden="true" />
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                <CardDescription>
                  {latestPost.location} · {entryDate(latestPost)}
                </CardDescription>
                <CardTitle className="text-2xl leading-tight sm:text-3xl">
                  {latestPost.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {latestPost.excerpt}
              </p>
            </CardContent>
          </div>
        </Card>
      </DetailLink>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Around this date
          </h2>
          <p className="text-sm text-muted-foreground">
            The nearest entry from each year.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {echoes.map((echo) => (
            <DetailLink
              key={echo.year}
              detailId={echo.post.id}
              href={echo.post.url}
              className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card className="h-full gap-4 py-5 transition-colors group-hover:bg-accent/40">
                <CardHeader className="px-5">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <Badge variant="outline">{echo.year}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {proximityLabel(echo.offsetDays)}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2 text-base leading-snug">
                    {echo.post.title}
                  </CardTitle>
                  <CardDescription>
                    {echo.post.location} · {entryDate(echo.post)}
                  </CardDescription>
                </CardHeader>
              </Card>
            </DetailLink>
          ))}
        </div>
      </section>
    </main>
  )
}
