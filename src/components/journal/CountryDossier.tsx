import Image from 'next/image'
import Link from 'next/link'

import { CountryFlag } from '@/components/journal/CountryFlag'
import { EntryList } from '@/components/journal/EntryList'
import { MarginNote } from '@/components/journal/MarginNotes'
import {
  getArchivesForCountry,
  getPostsForCountry,
} from '@/content/blog/publication'
import { foodData } from '@/content/food-data'
import type { CountryPage } from '@/content/world-journey'
import { getCountry, regionNames } from '@/lib/countries'
import { isPreoptimizedImage } from '@/lib/images'

export function CountryDossier({ country }: { country: CountryPage }) {
  const posts = getPostsForCountry(country.name)
  const archives = getArchivesForCountry(country.name)
  const dishes = foodData[country.name] ?? []
  const region = getCountry(country.name)?.region

  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-8">
      <header className="flex flex-col gap-5 border-b border-rule pt-14 pb-12 sm:pt-20">
        <p className="font-mono text-[13px] tracking-[0.08em] text-ink-soft uppercase">
          <Link href="/world" className="hover:text-accent">
            The world
          </Link>
          {region && ` · ${regionNames[region]}`}
        </p>
        <h1 className="flex flex-wrap items-center gap-x-6 gap-y-2 font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.9] font-light tracking-[-0.035em] italic">
          {country.name}
          <CountryFlag country={country.name} className="text-[0.45em]" />
        </h1>
        <p className="max-w-2xl text-xl leading-relaxed text-ink-soft">
          {country.description}
        </p>
      </header>

      <div className="flex flex-wrap gap-x-16 gap-y-14 pt-12">
        <section
          aria-labelledby="entries-heading"
          className="flex min-w-0 flex-[999_1_34rem] flex-col gap-5"
        >
          <h2 id="entries-heading" className="font-display text-[34px]">
            Entries
          </h2>
          {posts.length > 0 ? (
            <EntryList posts={posts} />
          ) : (
            <p className="border-t border-ink pt-4 text-lg text-ink-soft">
              This country is mapped, but no journal posts are attached.
            </p>
          )}
        </section>

        <aside className="flex min-w-0 flex-[1_1_16rem] flex-col gap-11">
          <MarginNote title="Highlights">
            <ul className="flex flex-col gap-1.5">
              {country.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </MarginNote>
          {archives.length > 0 && (
            <MarginNote title="Months here">
              <ul className="flex flex-col gap-1.5">
                {archives.map((archive) => (
                  <li key={archive.url}>
                    <Link href={archive.url} className="hover:text-accent">
                      {archive.displayDate}
                    </Link>
                  </li>
                ))}
              </ul>
            </MarginNote>
          )}
        </aside>
      </div>

      {dishes.length > 0 && (
        <section
          aria-labelledby="food-heading"
          className="flex flex-col gap-5 pt-16"
        >
          <h2 id="food-heading" className="font-display text-[34px]">
            What I ate
          </h2>
          <div className="grid gap-x-6 gap-y-10 border-t border-ink pt-6 sm:grid-cols-2 lg:grid-cols-3">
            {dishes.map((dish) => (
              <figure key={dish.name} className="flex flex-col gap-3">
                <span className="relative block aspect-[4/3] overflow-hidden bg-paper-deep">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    unoptimized={isPreoptimizedImage(dish.image)}
                    sizes="(max-width: 640px) 100vw, 360px"
                    className="object-cover"
                  />
                </span>
                <figcaption className="flex flex-col gap-1">
                  <span className="font-display text-xl">{dish.name}</span>
                  <span className="text-base leading-relaxed text-ink-soft">
                    {dish.description}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
