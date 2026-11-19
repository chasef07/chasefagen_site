import Link from 'next/link'

import { EntryList } from '@/components/journal/EntryList'
import { archives, posts } from '@/content/blog/publication'
import { countryPages } from '@/content/world-journey'
import { buildJournalYears } from '@/lib/journal'
import { generatePageMetadata } from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: 'Every Entry',
  description: `All ${posts.length} entries from Chase Fagen's travel journal, month by month.`,
  path: '/blog',
  keywords: ['travel journal', 'travel stories'],
})

export default function EntriesPage() {
  const years = buildJournalYears(posts, archives)

  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-8">
      <header className="flex flex-col gap-5 border-b border-rule pt-14 pb-12 sm:pt-20">
        <p className="font-mono text-[13px] tracking-[0.08em] text-ink-soft uppercase">
          {posts.length} entries · {countryPages.length} countries
        </p>
        <h1 className="font-display text-[clamp(3.5rem,11vw,9rem)] leading-[0.88] font-light tracking-[-0.035em] italic">
          Every entry
        </h1>
      </header>

      {years.map((year) => (
        <section
          key={year.year}
          aria-labelledby={`year-${year.year}`}
          className="flex flex-col gap-10 pt-14"
        >
          <h2
            id={`year-${year.year}`}
            className="flex items-baseline justify-between gap-4 font-display text-6xl"
          >
            {year.year}
            <span className="font-mono text-[13px] tracking-[0.08em] text-ink-soft uppercase">
              {year.postCount} entries
            </span>
          </h2>
          {year.months.map((month) => (
            <section
              key={month.key}
              aria-labelledby={`month-${month.key}`}
              className="flex flex-col gap-3"
            >
              <h3
                id={`month-${month.key}`}
                className="font-mono text-xs tracking-[0.12em] uppercase"
              >
                <Link href={month.href} className="hover:text-accent">
                  {month.label}
                </Link>
                <span className="text-ink-soft"> · {month.posts.length}</span>
              </h3>
              <EntryList posts={month.posts} dateFormat="short" />
            </section>
          ))}
        </section>
      ))}
    </main>
  )
}
