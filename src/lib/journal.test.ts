import { describe, expect, test } from 'bun:test'

import { archives, posts } from '@/content/blog/publication'
import { countryPages } from '@/content/world-journey'
import { buildJournalYears, findClosestEntriesByYear } from './journal'
import { getCountryCode } from './country-flags'

describe('Journal chronology', () => {
  test('derives every month from posts and sorts newest first', () => {
    const years = buildJournalYears(posts, archives)

    expect(years.map(({ year }) => year)).toEqual([2026, 2025, 2024])
    expect(years[0].months[0].key).toBe('2026-10')
    expect(
      years
        .find(({ year }) => year === 2025)
        ?.months.find(({ key }) => key === '2025-09')?.posts,
    ).toHaveLength(1)
  })

  test('finds the nearest entry to today in each journal year', () => {
    const echoes = findClosestEntriesByYear(
      new Date('2026-07-30T12:00:00Z'),
      posts,
    )

    expect(echoes.map(({ year }) => year)).toEqual([2026, 2025, 2024])
    expect(echoes[0].post.date).toBe('2026-08-01')
    expect(echoes[0].offsetDays).toBe(2)
    expect(echoes[1].post.date).toBe('2025-08-02')
    expect(echoes[1].offsetDays).toBe(3)
  })

  test('normalizes country aliases to one ISO code', () => {
    expect(getCountryCode('USA')).toBe('US')
    expect(getCountryCode('United States')).toBe('US')
  })

  test('uses ISO codes for the current European route', () => {
    expect(getCountryCode('Italy')).toBe('IT')
    expect(getCountryCode('Switzerland')).toBe('CH')
    expect(getCountryCode('Montenegro')).toBe('ME')
    expect(getCountryCode('Bosnia and Herzegovina')).toBe('BA')
    expect(getCountryCode('Serbia')).toBe('RS')
  })

  test('covers every country displayed by the journal', () => {
    const countries = new Set([
      ...posts.map((post) => post.country),
      ...countryPages.map((country) => country.name),
    ])

    expect(
      [...countries].filter((country) => !getCountryCode(country)),
    ).toEqual([])
  })
})
