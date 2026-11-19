import Image from 'next/image'

import { vlogsData } from '@/content/vlogs-data'
import { generatePageMetadata } from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: 'Vlogs',
  description: 'Travel videos from Chase Fagen’s journey.',
  path: '/vlogs',
  keywords: ['travel vlogs', 'travel videos'],
})

export default function VlogsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-8">
      <header className="flex flex-col gap-5 border-b border-rule pt-14 pb-12 sm:pt-20">
        <p className="font-mono text-[13px] tracking-[0.08em] text-ink-soft uppercase">
          {vlogsData.length} films
        </p>
        <h1 className="font-display text-[clamp(3.5rem,11vw,9rem)] leading-[0.88] font-light tracking-[-0.035em] italic">
          Vlogs
        </h1>
        <p className="max-w-2xl text-xl leading-relaxed text-ink-soft">
          Travel stories that work better in motion.
        </p>
      </header>

      <ul className="grid gap-x-6 gap-y-12 pt-12 sm:grid-cols-2 lg:grid-cols-3">
        {vlogsData.map((vlog) => (
          <li key={vlog.id}>
            <a
              href={`https://www.youtube.com/watch?v=${vlog.youtubeId}`}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col gap-3"
            >
              <span className="relative block aspect-video overflow-hidden bg-paper-deep">
                <Image
                  src={`https://img.youtube.com/vi/${vlog.youtubeId}/hqdefault.jpg`}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </span>
              <span className="font-mono text-xs tracking-[0.08em] text-ink-soft uppercase">
                {vlog.country} · YouTube ↗
              </span>
              <span className="font-display text-2xl leading-snug group-hover:text-accent">
                {vlog.title}
              </span>
              <span className="text-base leading-relaxed text-ink-soft">
                {vlog.description}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
