import {
  allBlogPosts as sourcePosts,
  blogArchives as sourceArchives,
  type BlogArchive as SourceArchive,
} from '../blog-registry'
import type { BlogPost } from '../../types/blog'

export type PublishedPost = BlogPost & {
  readingTime: number
  url: string
}

export type BlogArchive = SourceArchive & {
  url: string
}

export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

const calendarMonths = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]

export function parseBlogDate(date: string): Date {
  const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  const displayDate = /^([A-Za-z]+) (\d{1,2}), (\d{4})$/.exec(date)
  const year = Number(isoDate?.[1] ?? displayDate?.[3])
  const month = isoDate
    ? Number(isoDate[2]) - 1
    : calendarMonths.indexOf(displayDate?.[1].toLowerCase() ?? '')
  const day = Number(isoDate?.[3] ?? displayDate?.[2])
  const parsed = new Date(0)
  parsed.setUTCFullYear(year, month, day)
  if (
    (!isoDate && !displayDate) ||
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month ||
    parsed.getUTCDate() !== day
  ) {
    throw new Error(`Malformed Blog date: ${date}`)
  }
  return parsed
}

export function monthSlug(date: string): string {
  return parseBlogDate(date)
    .toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })
    .toLowerCase()
}

export function archivePath(year: number | string, month: string): string {
  return `/blog/${year}/${month}`
}

export function postPath(
  year: number | string,
  month: string,
  postSlug: string,
): string {
  return `${archivePath(year, month)}/${postSlug}`
}

function calendarMonthKey(date: string): string {
  const parsed = parseBlogDate(date)
  return `${parsed.getUTCFullYear()}-${parsed.getUTCMonth()}`
}

function deriveMissingArchives(
  postRecords: BlogPost[],
  archiveRecords: SourceArchive[],
): SourceArchive[] {
  const knownMonths = new Set(
    archiveRecords.map((archive) => calendarMonthKey(archive.date)),
  )
  const generated: SourceArchive[] = []

  for (const post of postRecords) {
    const key = calendarMonthKey(post.date)
    if (knownMonths.has(key)) continue
    knownMonths.add(key)

    const date = parseBlogDate(post.date)
    const displayDate = date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })

    generated.push({
      year: date.getUTCFullYear(),
      slug: monthSlug(post.date),
      title: `${displayDate}: ${post.location}`,
      date: post.date,
      displayDate,
      excerpt: post.excerpt,
      image: post.images[0]?.src ?? '/assets/images/misc/posttrip.jpg',
    })
  }

  return [...archiveRecords, ...generated].sort((left, right) => {
    const leftDate = parseBlogDate(left.date)
    const rightDate = parseBlogDate(right.date)
    const leftMonth = leftDate.getUTCFullYear() * 12 + leftDate.getUTCMonth()
    const rightMonth = rightDate.getUTCFullYear() * 12 + rightDate.getUTCMonth()
    return rightMonth - leftMonth
  })
}

function assertUnique<T>(
  records: T[],
  keyOf: (record: T) => string,
  label: string,
) {
  const seen = new Set<string>()
  for (const record of records) {
    const key = keyOf(record)
    if (seen.has(key)) throw new Error(`Duplicate ${label}: ${key}`)
    seen.add(key)
  }
}

export function createBlogPublication(
  postRecords: BlogPost[],
  archiveRecords: SourceArchive[],
) {
  const completeArchiveRecords = deriveMissingArchives(
    postRecords,
    archiveRecords,
  )
  const posts: PublishedPost[] = postRecords.map((post) => {
    const date = parseBlogDate(post.date)
    const month = monthSlug(post.date)
    if (String(date.getUTCFullYear()) !== post.year) {
      throw new Error(`Invalid Post calendar identity: ${post.year}/${month}`)
    }

    return {
      ...post,
      readingTime: calculateReadingTime(post.content),
      url: postPath(post.year, month, post.slug),
    }
  })
  const archives: BlogArchive[] = completeArchiveRecords.map((archive) => ({
    ...archive,
    url: archivePath(archive.year, archive.slug),
  }))
  const postsByPath = new Map(posts.map((post) => [post.url, post]))
  const archivesByPath = new Map(
    archives.map((archive) => [archive.url, archive]),
  )

  assertUnique(posts, (post) => post.url, 'Post path')
  assertUnique(posts, (post) => post.id, 'Post identity')
  assertUnique(archives, (archive) => archive.url, 'Archive path')

  for (const archive of archives) {
    const date = parseBlogDate(archive.date)
    if (
      monthSlug(archive.date) !== archive.slug ||
      date.getUTCFullYear() !== archive.year
    ) {
      throw new Error(`Invalid Archive calendar identity: ${archive.url}`)
    }
  }

  function getArchive(year: string, month: string) {
    return archivesByPath.get(archivePath(year, month))
  }

  function getPost(year: string, month: string, postSlug: string) {
    return postsByPath.get(postPath(year, month, postSlug))
  }

  function getPostsForArchive(year: string, month: string) {
    const prefix = `${archivePath(year, month)}/`
    return posts.filter((post) => post.url.startsWith(prefix))
  }

  function archiveStaticParams() {
    return archives.map((archive) => ({
      year: String(archive.year),
      month: archive.slug,
    }))
  }

  function postStaticParams() {
    return posts.map((post) => ({
      year: post.year,
      month: monthSlug(post.date),
      postSlug: post.slug,
    }))
  }

  return {
    posts,
    archives,
    getArchive,
    getPost,
    getPostsForArchive,
    archiveStaticParams,
    postStaticParams,
  }
}

const publication = createBlogPublication(sourcePosts, sourceArchives)

export const posts = publication.posts
export const archives = publication.archives
export const getArchive = publication.getArchive
export const getPost = publication.getPost
export const getPostsForArchive = publication.getPostsForArchive
export const archiveStaticParams = publication.archiveStaticParams
export const postStaticParams = publication.postStaticParams

export function getArchiveForPost(post: BlogPost): BlogArchive | undefined {
  return getArchive(post.year, monthSlug(post.date))
}

export function getPostsForCountry(countryName: string): PublishedPost[] {
  return posts.filter((post) => post.country === countryName)
}

export function getArchivesForCountry(countryName: string): BlogArchive[] {
  return [
    ...new Map(
      getPostsForCountry(countryName)
        .map(getArchiveForPost)
        .filter((archive): archive is BlogArchive => Boolean(archive))
        .map((archive) => [archive.url, archive]),
    ).values(),
  ]
}

export function getPostCardImage(post: BlogPost): string {
  return (
    post.images[0]?.src ??
    getArchiveForPost(post)?.image ??
    '/assets/images/misc/posttrip.jpg'
  )
}

export function getPostCardImagePosition(post: BlogPost): string | undefined {
  return post.images[0]?.imagePosition ?? getArchiveForPost(post)?.imagePosition
}
