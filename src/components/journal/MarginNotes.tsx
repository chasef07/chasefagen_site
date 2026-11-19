import Link from 'next/link'

import type { PublishedPost } from '@/content/blog/publication'
import { getCountryCode } from '@/lib/countries'
import { offsetLabel, stampDate } from '@/lib/dates'
import type { JournalEcho } from '@/lib/journal'

export function MarginNote({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 font-mono text-[13px] leading-relaxed">
      <h2 className="border-b border-rule pb-2 text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function EchoList({ echoes }: { echoes: JournalEcho[] }) {
  return (
    <ul className="flex flex-col gap-5">
      {echoes.map(({ year, post, offsetDays }) => (
        <li key={post.id}>
          <Link href={post.url} className="group flex flex-col gap-1">
            <span className="text-accent">
              {year} · {offsetLabel(offsetDays)}
            </span>
            <span className="font-display text-[22px] leading-tight transition-colors group-hover:text-accent">
              {post.title}
            </span>
            <span className="text-ink-soft">{post.location}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function Stamp({ post }: { post: PublishedPost }) {
  const [place] = post.location.split(',')
  const footer = [post.year, getCountryCode(post.country)]
    .filter(Boolean)
    .join(' · ')

  return (
    <div
      aria-hidden="true"
      className="flex size-36 shrink-0 -rotate-9 flex-col items-center justify-center gap-1 rounded-full border-2 border-accent text-center font-mono text-accent sm:size-40"
    >
      <span className="max-w-28 truncate text-[10px] tracking-[0.14em] uppercase">
        {place}
      </span>
      <span className="font-display text-[34px] leading-none font-semibold">
        {stampDate(post.date)}
      </span>
      <span className="text-[10px] tracking-[0.14em] uppercase">{footer}</span>
    </div>
  )
}
