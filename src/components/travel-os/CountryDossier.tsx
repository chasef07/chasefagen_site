import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Clock, MapPin } from 'lucide-react'

import { CountryFlag } from '@/components/journal/CountryFlag'
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
import type { CountryPage } from '@/content/world-journey'
import { foodData } from '@/content/food-data'
import {
  getArchivesForCountry,
  getPostCardImage,
  getPostCardImagePosition,
  getPostsForCountry,
  parseBlogDate,
} from '@/content/blog/publication'
import { isPreoptimizedImage } from '@/lib/images'

function postDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parseBlogDate(date))
}

export function CountryDossier({ country }: { country: CountryPage }) {
  const posts = getPostsForCountry(country.name)
  const archives = getArchivesForCountry(country.name)
  const dishes = foodData[country.name] ?? []

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-14">
      <header className="flex flex-col gap-6">
        <Button asChild variant="ghost" size="sm" className="w-fit">
          <Link href="/world">
            <ArrowLeft data-icon="inline-start" />
            World
          </Link>
        </Button>

        <div className="flex items-center gap-4">
          <CountryFlag country={country.name} className="text-5xl" />
          <h1
            tabIndex={-1}
            className="text-4xl font-semibold tracking-tight outline-none sm:text-6xl"
          >
            {country.name}
          </h1>
        </div>

        <p className="max-w-3xl text-lg text-muted-foreground">
          {country.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {country.highlights.map((highlight) => (
            <Badge key={highlight} variant="outline">
              {highlight}
            </Badge>
          ))}
        </div>
      </header>

      <Separator />

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ['Entries', posts.length],
          ['Months', archives.length],
          ['Dishes', dishes.length],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-3xl">{value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      {archives.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Months</h2>
          <div className="flex flex-wrap gap-2">
            {archives.map((archive) => (
              <Button key={archive.url} asChild variant="outline" size="sm">
                <Link href={archive.url}>{archive.displayDate}</Link>
              </Button>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-5">
        <h2 className="text-2xl font-semibold">Entries</h2>

        {posts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={post.url}
                className="group block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Card className="h-full overflow-hidden py-0 transition-colors group-hover:bg-accent/40">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={getPostCardImage(post)}
                      alt=""
                      fill
                      unoptimized={isPreoptimizedImage(getPostCardImage(post))}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      style={{
                        objectPosition: getPostCardImagePosition(post),
                      }}
                    />
                  </div>
                  <CardHeader className="pb-6">
                    <div className="mb-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>{postDate(post.date)}</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3" />
                        {post.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        {post.readingTime} min
                      </span>
                    </div>
                    <CardTitle className="leading-snug">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No entries yet</CardTitle>
              <CardDescription>
                This country is mapped, but no journal posts are attached.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </section>

      {dishes.length > 0 && (
        <section className="flex flex-col gap-5">
          <div>
            <h2 className="text-2xl font-semibold">Food</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Dishes worth remembering from {country.name}.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {dishes.map((dish) => (
              <Card key={dish.name} className="overflow-hidden py-0">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    unoptimized={isPreoptimizedImage(dish.image)}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{dish.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {dish.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
