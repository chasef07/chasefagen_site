import Image from 'next/image'
import Link from 'next/link'

import { EntryList } from '@/components/journal/EntryList'
import { EchoList, MarginNote, Stamp } from '@/components/journal/MarginNotes'
import { posts } from '@/content/blog/publication'
import { upcomingCountries } from '@/content/world-journey'
import { formatDate } from '@/lib/dates'
import { isPreoptimizedImage } from '@/lib/images'
import { findClosestEntriesByYear } from '@/lib/journal'

export const dynamic = 'force-dynamic'

export default function Page() {
  const [latest, ...earlier] = posts
  const echoes = findClosestEntriesByYear(new Date(), posts).filter(
    (echo) => echo.post !== latest,
  )
  const image = latest.images[0]

  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-8">
      <section className="flex flex-wrap items-end justify-between gap-8 border-b border-rule pt-14 pb-12 sm:pt-20">
        <div className="flex min-w-0 flex-[999_1_32rem] flex-col gap-6">
          <p className="font-mono text-[13px] tracking-[0.08em] text-ink-soft uppercase">
            Latest · Entry {latest.entryNumber} ·{' '}
            {formatDate(latest.date, 'full')}
          </p>
          <h1 className="font-display text-[clamp(3.5rem,11vw,9rem)] leading-[0.88] font-light tracking-[-0.035em] text-balance italic">
            <Link href={latest.url} className="hover:text-accent">
              {latest.title}
            </Link>
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed text-ink-soft sm:text-[1.4rem]">
            {latest.excerpt}
          </p>
          <Link
            href={latest.url}
            className="w-fit font-mono text-[13px] tracking-[0.08em] text-accent uppercase underline decoration-1 underline-offset-[6px]"
          >
            Read the entry →
          </Link>
        </div>
        <Stamp post={latest} />
      </section>

      {image && (
        <figure className="relative mt-10 aspect-[16/9] overflow-hidden bg-paper-deep">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            unoptimized={isPreoptimizedImage(image.src)}
            sizes="(max-width: 1152px) 100vw, 1088px"
            className="object-cover"
            style={{ objectPosition: image.imagePosition }}
          />
        </figure>
      )}

      <div className="flex flex-wrap gap-x-16 gap-y-14 pt-12">
        <section
          aria-labelledby="recent-heading"
          className="flex min-w-0 flex-[999_1_34rem] flex-col gap-5"
        >
          <h2 id="recent-heading" className="font-display text-[34px]">
            Recent entries
          </h2>
          <EntryList posts={earlier.slice(0, 8)} />
          <Link
            href="/blog"
            className="w-fit font-mono text-[13px] tracking-[0.08em] text-accent uppercase underline decoration-1 underline-offset-[6px]"
          >
            All {posts.length} entries →
          </Link>
        </section>

        <aside className="flex min-w-0 flex-[1_1_16rem] flex-col gap-11">
          <MarginNote title="Around this date">
            <EchoList echoes={echoes} />
          </MarginNote>
          <MarginNote title="Next on the route">
            <ol className="flex flex-col gap-2">
              {upcomingCountries.map((country, index) => (
                <li key={country} className="flex gap-3">
                  <span className="text-ink-soft">{index + 1}.</span>
                  {country}
                </li>
              ))}
            </ol>
          </MarginNote>
        </aside>
      </div>
    </main>
  )
}
