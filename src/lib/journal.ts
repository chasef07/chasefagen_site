import type { BlogArchive, PublishedPost } from '@/content/blog/publication'
import {
  archivePath,
  monthSlug,
  parseBlogDate,
} from '@/content/blog/publication'

export type JournalMonth = {
  key: string
  year: number
  month: number
  slug: string
  label: string
  displayDate: string
  href: string
  title: string
  excerpt: string
  image: string
  posts: PublishedPost[]
  countries: string[]
}

export type JournalYear = {
  year: number
  postCount: number
  months: JournalMonth[]
}

export type JournalEcho = {
  year: number
  post: PublishedPost
  offsetDays: number
}

function monthIdentity(date: string) {
  const parsed = parseBlogDate(date)
  const year = parsed.getUTCFullYear()
  const month = parsed.getUTCMonth()
  const key = `${year}-${String(month + 1).padStart(2, '0')}`
  return { key, year, month }
}

export function buildJournalYears(
  postRecords: PublishedPost[],
  archiveRecords: BlogArchive[],
): JournalYear[] {
  const archivesByMonth = new Map(
    archiveRecords.map((archive) => [monthIdentity(archive.date).key, archive]),
  )
  const postsByMonth = new Map<string, PublishedPost[]>()

  for (const post of postRecords) {
    const { key } = monthIdentity(post.date)
    const monthPosts = postsByMonth.get(key) ?? []
    monthPosts.push(post)
    postsByMonth.set(key, monthPosts)
  }

  const months = [...postsByMonth.entries()]
    .map(([key, monthPosts]): JournalMonth => {
      const { year, month } = monthIdentity(monthPosts[0].date)
      const archive = archivesByMonth.get(key)
      const countries = [
        ...new Set(
          monthPosts
            .map((post) => post.country)
            .filter((country): country is string => Boolean(country)),
        ),
      ]
      const label = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        timeZone: 'UTC',
      }).format(parseBlogDate(monthPosts[0].date))
      const displayDate = `${label} ${year}`

      return {
        key,
        year,
        month,
        slug: monthSlug(monthPosts[0].date),
        label,
        displayDate,
        href: archivePath(year, monthSlug(monthPosts[0].date)),
        title: archive?.title ?? displayDate,
        excerpt: archive?.excerpt ?? monthPosts[0].excerpt,
        image:
          archive?.image ??
          monthPosts[0].images[0]?.src ??
          '/assets/images/misc/posttrip.jpg',
        posts: [...monthPosts].sort(
          (left, right) =>
            parseBlogDate(right.date).getTime() -
            parseBlogDate(left.date).getTime(),
        ),
        countries,
      }
    })
    .sort((left, right) => right.key.localeCompare(left.key))

  const groupedYears = new Map<number, JournalMonth[]>()
  for (const month of months) {
    const yearMonths = groupedYears.get(month.year) ?? []
    yearMonths.push(month)
    groupedYears.set(month.year, yearMonths)
  }

  return [...groupedYears.entries()]
    .sort(([left], [right]) => right - left)
    .map(([year, yearMonths]) => ({
      year,
      postCount: yearMonths.reduce(
        (count, month) => count + month.posts.length,
        0,
      ),
      months: yearMonths,
    }))
}

export function findClosestEntriesByYear(
  today: Date,
  postRecords: PublishedPost[],
): JournalEcho[] {
  const postsByYear = new Map<number, PublishedPost[]>()
  for (const post of postRecords) {
    const year = parseBlogDate(post.date).getUTCFullYear()
    const yearPosts = postsByYear.get(year) ?? []
    yearPosts.push(post)
    postsByYear.set(year, yearPosts)
  }

  return [...postsByYear.entries()]
    .sort(([left], [right]) => right - left)
    .map(([year, yearPosts]) => {
      const target = Date.UTC(year, today.getUTCMonth(), today.getUTCDate())
      const candidates = yearPosts
        .map((post) => {
          const date = parseBlogDate(post.date)
          const offsetDays = Math.round(
            (Date.UTC(
              date.getUTCFullYear(),
              date.getUTCMonth(),
              date.getUTCDate(),
            ) -
              target) /
              86_400_000,
          )
          return { year, post, offsetDays }
        })
        .sort(
          (left, right) =>
            Math.abs(left.offsetDays) - Math.abs(right.offsetDays),
        )

      return candidates[0]
    })
}
