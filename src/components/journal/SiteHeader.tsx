import Link from 'next/link'

import { RouteBand } from '@/components/journal/RouteBand'
import { SiteNav } from '@/components/journal/SiteNav'
import { archives, posts } from '@/content/blog/publication'
import { currentJourneyStop, upcomingCountries } from '@/content/world-journey'
import { buildJournalYears } from '@/lib/journal'
import { buildRouteBand } from '@/lib/route-band'

const routeCells = buildRouteBand(
  buildJournalYears(posts, archives).flatMap((year) => year.months),
  upcomingCountries,
)

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pt-5 sm:px-8 sm:pt-7">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b-[1.5px] border-ink pb-3">
        <Link
          href="/"
          className="font-display text-[26px] font-semibold tracking-tight"
        >
          Chase Fagen{' '}
          <span className="font-normal text-accent italic">field notes</span>
        </Link>
        <SiteNav />
        <p className="font-mono text-xs tracking-wider text-ink-soft uppercase">
          Now · {currentJourneyStop.stopName ?? currentJourneyStop.name}
        </p>
      </div>
      <RouteBand cells={routeCells} />
    </header>
  )
}
