import type { JournalMonth } from '@/lib/journal'
import {
  getCountry,
  type CountryCode,
  type CountryName,
  type Region,
} from '@/lib/countries'

export type RouteSegment = {
  code: CountryCode
  region: Region
  entries: number
}

export type RouteCell =
  | {
      kind: 'month'
      key: string
      year: number
      label: string
      href: string
      entries: number
      code: CountryCode | undefined
      segments: RouteSegment[]
    }
  | { kind: 'quiet'; key: string; year: number; label: string }
  | {
      kind: 'planned'
      key: string
      label: string
      code: CountryCode
      region: Region
    }

const shortMonth = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  timeZone: 'UTC',
})

function monthLabel(year: number, month: number) {
  return `${shortMonth.format(Date.UTC(year, month, 1))} ${year}`
}

function segmentsFor(month: JournalMonth): RouteSegment[] {
  const segments = new Map<CountryCode, RouteSegment>()

  for (const post of [...month.posts].reverse()) {
    if (!post.country) continue
    const country = getCountry(post.country)
    if (!country) throw new Error(`Unmapped country: ${post.country}`)

    const segment = segments.get(country.code) ?? {
      code: country.code,
      region: country.region,
      entries: 0,
    }
    segment.entries += 1
    segments.set(country.code, segment)
  }

  return [...segments.values()]
}

function mostVisited(segments: RouteSegment[]) {
  return segments.reduce<RouteSegment | undefined>(
    (best, segment) =>
      !best || segment.entries >= best.entries ? segment : best,
    undefined,
  )?.code
}

export function buildRouteBand(
  monthsNewestFirst: JournalMonth[],
  upcoming: readonly CountryName[],
): RouteCell[] {
  const months = [...monthsNewestFirst].reverse()
  if (months.length === 0) return []

  const byIndex = new Map(
    months.map((month) => [month.year * 12 + month.month, month]),
  )
  const first = months[0].year * 12 + months[0].month
  const last = months.at(-1)!.year * 12 + months.at(-1)!.month
  const cells: RouteCell[] = []

  for (let index = first; index <= last; index += 1) {
    const year = Math.floor(index / 12)
    const label = monthLabel(year, index % 12)
    const month = byIndex.get(index)

    if (!month) {
      cells.push({ kind: 'quiet', key: `${year}-${index % 12}`, year, label })
      continue
    }

    const segments = segmentsFor(month)
    cells.push({
      kind: 'month',
      key: month.key,
      year,
      label,
      href: month.href,
      entries: month.posts.length,
      code: mostVisited(segments),
      segments,
    })
  }

  for (const name of upcoming) {
    const country = getCountry(name)!
    cells.push({
      kind: 'planned',
      key: `planned-${country.code}-${cells.length}`,
      label: `Next: ${country.name}`,
      code: country.code,
      region: country.region,
    })
  }

  return cells
}
