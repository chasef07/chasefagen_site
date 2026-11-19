import Link from 'next/link'

import { posts } from '@/content/blog/publication'

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-24 w-full max-w-6xl px-4 pb-10 sm:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-rule pt-5 font-mono text-xs tracking-wider text-ink-soft uppercase">
        <p>{posts.length} entries · written on the road since September 2024</p>
        <Link href="/feed.xml" className="hover:text-accent">
          RSS feed
        </Link>
      </div>
    </footer>
  )
}
