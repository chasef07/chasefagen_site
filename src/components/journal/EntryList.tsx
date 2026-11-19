import Link from 'next/link'

import type { PublishedPost } from '@/content/blog/publication'
import { getCountryCode } from '@/lib/countries'
import { formatDate } from '@/lib/dates'

export function EntryList({
  posts,
  dateFormat = 'shortYear',
}: {
  posts: PublishedPost[]
  dateFormat?: 'short' | 'shortYear'
}) {
  return (
    <ol className="border-t border-ink">
      {posts.map((post) => (
        <li key={post.id} className="border-b border-rule">
          <Link
            href={post.url}
            className="group grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[6.5rem_minmax(0,13rem)_minmax(0,1fr)_2rem] sm:items-baseline sm:gap-x-5"
          >
            <span className="flex min-w-0 gap-2 font-mono text-xs text-ink-soft sm:contents">
              <time dateTime={post.date} className="shrink-0">
                {formatDate(post.date, dateFormat)}
              </time>
              <span aria-hidden="true" className="sm:hidden">
                ·
              </span>
              <span className="truncate">{post.location}</span>
            </span>
            <span className="font-display text-xl leading-snug transition-colors group-hover:text-accent">
              {post.title}
            </span>
            <span className="hidden text-right font-mono text-xs text-ink-soft sm:block">
              {getCountryCode(post.country)}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  )
}
