import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page not found | Chase Fagen',
  description: 'The page you requested could not be found.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pt-20 sm:px-8">
      <p className="font-mono text-[13px] tracking-[0.08em] text-ink-soft uppercase">
        404
      </p>
      <h1 className="font-display text-[clamp(3.5rem,11vw,9rem)] leading-[0.88] font-light tracking-[-0.035em] italic">
        Page not found
      </h1>
      <p className="max-w-xl text-xl leading-relaxed text-ink-soft">
        This page has wandered off the map. Let&apos;s get you back on track.
      </p>
      <Link
        href="/"
        className="w-fit font-mono text-[13px] tracking-[0.08em] text-accent uppercase underline decoration-1 underline-offset-[6px]"
      >
        ← Back to today
      </Link>
    </main>
  )
}
