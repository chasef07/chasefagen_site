'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import type { Region } from '@/lib/countries'
import { regionNames } from '@/lib/countries'
import type { RouteCell } from '@/lib/route-band'

const regionFill: Record<Region, string> = {
  home: 'bg-region-home',
  'middle-east': 'bg-region-middle-east',
  africa: 'bg-region-africa',
  asia: 'bg-region-asia',
  'latin-america': 'bg-region-latin-america',
  europe: 'bg-region-europe',
}

const countryName = new Intl.DisplayNames(['en'], { type: 'region' })

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function yearMarker(cells: RouteCell[], index: number) {
  const cell = cells[index]
  if (cell.kind === 'planned') {
    return cells[index - 1]?.kind === 'planned' ? null : 'Next'
  }
  const previous = cells[index - 1]
  return !previous || previous.kind === 'planned' || previous.year !== cell.year
    ? String(cell.year)
    : null
}

export function RouteBand({ cells }: { cells: RouteCell[] }) {
  const pathname = usePathname()
  const scroller = useRef<HTMLDivElement>(null)
  const latestKey = cells.findLast((cell) => cell.kind === 'month')?.key

  useEffect(() => {
    const element = scroller.current
    if (!element) return
    const active = element.querySelector<HTMLElement>('[aria-current="page"]')
    element.scrollLeft = active
      ? active.offsetLeft - element.clientWidth / 2
      : element.scrollWidth
  }, [pathname])

  return (
    <section
      aria-label="The route, month by month"
      className="flex flex-col gap-2"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 font-mono text-[11px] tracking-wider text-ink-soft uppercase">
        <p>The route · {cells[0]?.label} → now</p>
        <ul className="hidden flex-wrap gap-x-4 gap-y-1 md:flex">
          {(Object.keys(regionNames) as Region[]).map((region) => (
            <li key={region} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={`size-2.5 ${regionFill[region]}`}
              />
              {regionNames[region]}
            </li>
          ))}
          <li className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-2.5 border border-dashed border-ink-soft"
            />
            Planned
          </li>
        </ul>
      </div>

      <div ref={scroller} className="no-scrollbar overflow-x-auto pt-1 pb-1">
        <ol className="grid min-w-full auto-cols-[minmax(1.75rem,1fr)] grid-flow-col items-end gap-[3px]">
          {cells.map((cell, index) => {
            const marker = yearMarker(cells, index)
            const tall = cell.kind === 'month' && cell.key === latestKey

            return (
              <li key={cell.key} className="flex min-w-0 flex-col gap-1">
                <span
                  aria-hidden="true"
                  className="h-3.5 font-mono text-[10px] leading-none text-ink-soft"
                >
                  {marker}
                </span>
                {cell.kind === 'month' ? (
                  <Link
                    href={cell.href}
                    aria-current={
                      isActive(pathname, cell.href) ? 'page' : undefined
                    }
                    title={`${cell.label} · ${cell.entries} ${cell.entries === 1 ? 'entry' : 'entries'}`}
                    aria-label={`${cell.label}: ${cell.segments.map((segment) => countryName.of(segment.code)).join(', ')}. ${cell.entries} ${cell.entries === 1 ? 'entry' : 'entries'}.`}
                    className="group flex flex-col gap-1 outline-offset-2 aria-[current=page]:outline-2 aria-[current=page]:outline-ink"
                  >
                    <span
                      className={`flex flex-col gap-px ${tall ? 'h-12' : 'h-9'}`}
                    >
                      {cell.segments.map((segment) => (
                        <span
                          key={segment.code}
                          className={`block min-h-1 transition-opacity group-hover:opacity-80 ${regionFill[segment.region]}`}
                          style={{ flexGrow: segment.entries }}
                        />
                      ))}
                    </span>
                    <span className="text-center font-mono text-[10px] leading-none text-ink-soft group-hover:text-ink group-aria-[current=page]:text-ink">
                      {cell.code}
                    </span>
                  </Link>
                ) : cell.kind === 'quiet' ? (
                  <span
                    title={`${cell.label} · no entries`}
                    className="flex flex-col gap-1"
                  >
                    <span className="block h-9 border-b-2 border-rule" />
                    <span className="text-center font-mono text-[10px] leading-none text-ink-soft">
                      ·
                    </span>
                  </span>
                ) : (
                  <span
                    title={`${cell.label} (planned)`}
                    className="flex flex-col gap-1"
                  >
                    <span className="block h-9 border-2 border-dashed border-ink-soft/70" />
                    <span className="text-center font-mono text-[10px] leading-none text-ink-soft">
                      <span className="sr-only">{cell.label}</span>
                      <span aria-hidden="true">{cell.code}</span>
                    </span>
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
