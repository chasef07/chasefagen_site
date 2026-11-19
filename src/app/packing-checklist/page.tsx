import { PackingChecklist } from '@/components/journal/PackingChecklist'
import { generatePageMetadata } from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: 'Packing list',
  description: 'The practical packing list Chase uses for long-term travel.',
  path: '/packing-checklist',
  keywords: ['packing list', 'travel essentials'],
})

export default function PackingChecklistPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-8">
      <header className="flex flex-col gap-5 border-b border-rule pt-14 pb-12 sm:pt-20">
        <p className="font-mono text-[13px] tracking-[0.08em] text-ink-soft uppercase">
          Carry-on tested
        </p>
        <h1 className="font-display text-[clamp(3.5rem,11vw,9rem)] leading-[0.88] font-light tracking-[-0.035em] italic">
          Packing
        </h1>
        <p className="max-w-2xl text-xl leading-relaxed text-ink-soft">
          The compact list that made it through a year on the road.
        </p>
      </header>
      <div className="pt-12">
        <PackingChecklist />
      </div>
    </main>
  )
}
