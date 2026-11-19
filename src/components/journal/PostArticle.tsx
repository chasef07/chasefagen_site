import Link from 'next/link'

import { EchoList, MarginNote, Stamp } from '@/components/journal/MarginNotes'
import { PostBody } from '@/components/journal/PostBody'
import type { PublishedPost } from '@/content/blog/publication'
import {
  getAdjacentPosts,
  getArchiveForPost,
  parseBlogDate,
  posts,
} from '@/content/blog/publication'
import { formatDate } from '@/lib/dates'
import { findClosestEntriesByYear } from '@/lib/journal'
import {
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  siteConfig,
} from '@/lib/seo'

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function PostArticle({ post }: { post: PublishedPost }) {
  const archive = getArchiveForPost(post)
  const { newer, older } = getAdjacentPosts(post)
  const echoes = findClosestEntriesByYear(
    parseBlogDate(post.date),
    posts,
  ).filter((echo) => String(echo.year) !== post.year)
  const monthSiblings = archive
    ? posts.filter(
        (sibling) =>
          sibling !== post && sibling.url.startsWith(`${archive.url}/`),
      )
    : []

  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-8">
      <JsonLd data={generateArticleJsonLd(post)} />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Latest', url: siteConfig.url },
          ...(archive
            ? [
                {
                  name: archive.displayDate,
                  url: `${siteConfig.url}${archive.url}`,
                },
              ]
            : []),
          { name: post.title, url: `${siteConfig.url}${post.url}` },
        ])}
      />

      <header className="flex flex-wrap items-end justify-between gap-8 pt-12 pb-10 sm:pt-16">
        <div className="flex min-w-0 flex-[999_1_32rem] flex-col gap-5">
          <p className="font-mono text-[13px] tracking-[0.08em] text-ink-soft uppercase">
            {archive && (
              <>
                <Link href={archive.url} className="hover:text-accent">
                  {archive.displayDate}
                </Link>
                {' · '}
              </>
            )}
            Entry {post.entryNumber} · {formatDate(post.date, 'full')}
          </p>
          <h1 className="font-display text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.92] font-light tracking-[-0.03em] text-balance italic">
            {post.title}
          </h1>
        </div>
        <Stamp post={post} />
      </header>

      <div className="flex flex-wrap gap-x-16 gap-y-14 border-t border-rule pt-10">
        <article className="min-w-0 max-w-[42rem] flex-[999_1_34rem]">
          <PostBody post={post} />

          <nav
            aria-label="More entries"
            className="mt-16 grid gap-4 border-t border-ink pt-5 font-mono text-[13px] sm:grid-cols-2"
          >
            {older && (
              <Link href={older.url} className="group flex flex-col gap-1">
                <span className="text-ink-soft">← Previous entry</span>
                <span className="font-display text-xl group-hover:text-accent">
                  {older.title}
                </span>
              </Link>
            )}
            {newer && (
              <Link
                href={newer.url}
                className="group flex flex-col gap-1 sm:col-start-2 sm:text-right"
              >
                <span className="text-ink-soft">Next entry →</span>
                <span className="font-display text-xl group-hover:text-accent">
                  {newer.title}
                </span>
              </Link>
            )}
          </nav>
        </article>

        <aside className="flex min-w-0 flex-[1_1_16rem] flex-col gap-11">
          <MarginNote title="About this entry">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
              <dt className="text-ink-soft">Place</dt>
              <dd>{post.location}</dd>
              <dt className="text-ink-soft">Read</dt>
              <dd>{post.readingTime} min</dd>
            </dl>
          </MarginNote>
          {echoes.length > 0 && (
            <MarginNote title="Same date, other years">
              <EchoList echoes={echoes} />
            </MarginNote>
          )}
          {archive && monthSiblings.length > 0 && (
            <MarginNote title={`Also in ${archive.displayDate}`}>
              <ul className="flex flex-col gap-2.5">
                {monthSiblings.map((sibling) => (
                  <li key={sibling.id}>
                    <Link
                      href={sibling.url}
                      className="flex gap-3 hover:text-accent"
                    >
                      <span className="shrink-0 text-ink-soft">
                        {formatDate(sibling.date, 'short')}
                      </span>
                      <span>{sibling.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </MarginNote>
          )}
        </aside>
      </div>
    </main>
  )
}
