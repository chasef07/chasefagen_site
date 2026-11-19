import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { EntryList } from '@/components/journal/EntryList'
import {
  archiveStaticParams,
  getAdjacentArchives,
  getArchive,
  getPostsForArchive,
} from '@/content/blog/publication'
import { getCountry } from '@/lib/countries'
import { formatDate } from '@/lib/dates'
import { isPreoptimizedImage } from '@/lib/images'
import { generatePageMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ year: string; month: string }>
}

export function generateStaticParams() {
  return archiveStaticParams()
}

export async function generateMetadata({ params }: Props) {
  const { year, month } = await params
  const archive = getArchive(year, month)

  if (!archive) return { title: 'Journal month not found | Chase Fagen' }

  return generatePageMetadata({
    title: `${archive.displayDate} Travel Journal`,
    description: archive.excerpt,
    path: archive.url,
    type: 'article',
  })
}

export default async function ArchivePage({ params }: Props) {
  const { year, month } = await params
  const archive = getArchive(year, month)
  const monthPosts = getPostsForArchive(year, month)
  if (!archive) notFound()

  if (monthPosts.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pt-14 sm:px-8 sm:pt-20">
        <p className="font-mono text-[13px] tracking-[0.08em] text-ink-soft uppercase">
          {archive.displayDate}
        </p>
        <h1 className="font-display text-[clamp(3.5rem,11vw,9rem)] leading-[0.88] font-light tracking-[-0.035em] italic">
          No entries yet
        </h1>
        <p className="max-w-xl text-xl leading-relaxed text-ink-soft">
          This month is on the timeline, but its first post has not been
          published.
        </p>
        <Link
          href="/"
          className="w-fit font-mono text-[13px] tracking-[0.08em] text-accent uppercase underline decoration-1 underline-offset-[6px]"
        >
          ← Return to Today
        </Link>
      </main>
    )
  }

  const oldestFirst = [...monthPosts].reverse()
  const countries = [
    ...new Set(oldestFirst.map((post) => getCountry(post.country)?.name)),
  ].filter(Boolean)
  const subtitle = archive.title.startsWith(`${archive.displayDate}: `)
    ? archive.title.slice(archive.displayDate.length + 2)
    : undefined
  const photos = oldestFirst
    .flatMap((post) =>
      post.images.slice(0, 1).map((image) => ({ post, image })),
    )
    .slice(0, 6)
  const { newer, older } = getAdjacentArchives(archive)

  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-8">
      <header className="flex flex-col gap-5 border-b border-rule pt-14 pb-12 sm:pt-20">
        <p className="font-mono text-[13px] tracking-[0.08em] text-ink-soft uppercase">
          {monthPosts.length} {monthPosts.length === 1 ? 'entry' : 'entries'}
          {countries.length > 0 && ` · ${countries.join(', ')}`}
        </p>
        <h1 className="font-display text-[clamp(3.5rem,11vw,9rem)] leading-[0.88] font-light tracking-[-0.035em] italic">
          {archive.displayDate}
        </h1>
        {subtitle && (
          <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-tight">
            {subtitle}
          </p>
        )}
        <p className="max-w-2xl text-xl leading-relaxed text-ink-soft">
          {archive.excerpt}
        </p>
      </header>

      {photos.length > 0 && (
        <section
          aria-label={`Photos from ${archive.displayDate}`}
          className="grid grid-cols-2 gap-3 pt-10 md:grid-cols-3"
        >
          {photos.map(({ post, image }, index) => (
            <Link
              key={image.src}
              href={post.url}
              className="group flex flex-col gap-2"
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-paper-deep">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={index < 3}
                  unoptimized={isPreoptimizedImage(image.src)}
                  sizes="(max-width: 768px) 50vw, 360px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  style={{ objectPosition: image.imagePosition }}
                />
              </span>
              <span className="font-mono text-xs text-ink-soft group-hover:text-accent">
                {formatDate(post.date, 'short')} · {post.title}
              </span>
            </Link>
          ))}
        </section>
      )}

      <section
        aria-labelledby="entries-heading"
        className="flex flex-col gap-5 pt-12"
      >
        <h2 id="entries-heading" className="font-display text-[34px]">
          Entries
        </h2>
        <EntryList posts={oldestFirst} dateFormat="short" />
      </section>

      <nav
        aria-label="Other months"
        className="mt-14 grid gap-4 border-t border-ink pt-5 font-mono text-[13px] sm:grid-cols-2"
      >
        {older && (
          <Link href={older.url} className="group flex flex-col gap-1">
            <span className="text-ink-soft">← Earlier month</span>
            <span className="font-display text-xl group-hover:text-accent">
              {older.displayDate}
            </span>
          </Link>
        )}
        {newer && (
          <Link
            href={newer.url}
            className="group flex flex-col gap-1 sm:col-start-2 sm:text-right"
          >
            <span className="text-ink-soft">Later month →</span>
            <span className="font-display text-xl group-hover:text-accent">
              {newer.displayDate}
            </span>
          </Link>
        )}
      </nav>
    </main>
  )
}
