import { describe, expect, test } from 'bun:test'

import { archives, posts } from '@/content/blog/publication'
import { upcomingCountries } from '@/content/world-journey'
import { buildJournalYears, type JournalMonth } from './journal'
import { buildRouteBand } from './route-band'

const months = buildJournalYears(posts, archives).flatMap((year) => year.months)

describe('Route band', () => {
  const cells = buildRouteBand(months, upcomingCountries)
  const monthCells = cells.filter((cell) => cell.kind === 'month')

  test('runs oldest to newest with one cell per calendar month', () => {
    const dated = cells.filter((cell) => cell.kind !== 'planned')

    expect(dated[0].label).toBe('Sep 2024')
    expect(dated.at(-1)?.label).toBe('Nov 2026')
    expect(dated).toHaveLength(27)
  })

  test('links every visited month to its archive and labels it by the most-written country', () => {
    expect(monthCells[0]).toMatchObject({
      href: '/blog/2024/september',
      code: 'IL',
    })
    expect(monthCells.every((cell) => cell.entries > 0)).toBe(true)
  })

  test('splits a month across countries in the order they were visited', () => {
    const august = monthCells.find((cell) => cell.key === '2026-08')

    expect(august?.segments.map((segment) => segment.code)).toEqual([
      'CH',
      'ME',
      'BA',
      'RS',
      'US',
    ])
  })

  test('ends with the planned trips, dashed and unlinked', () => {
    const planned = cells.filter((cell) => cell.kind === 'planned')

    expect(planned.map((cell) => cell.code)).toEqual(['CR', 'NL', 'FR', 'GE'])
    expect(cells.at(-1)?.kind).toBe('planned')
  })

  test('fills a month with no entries as a quiet cell', () => {
    const [january, march] = [months.at(-1)!, months.at(-3)!].map(
      (month): JournalMonth => ({ ...month, year: 2030 }),
    )
    const gapped = buildRouteBand(
      [
        { ...march, key: '2030-03', month: 2 },
        { ...january, key: '2030-01', month: 0 },
      ],
      [],
    )

    expect(gapped.map((cell) => cell.kind)).toEqual(['month', 'quiet', 'month'])
  })
})
