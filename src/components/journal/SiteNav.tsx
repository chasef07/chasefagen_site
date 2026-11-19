'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const destinations = [
  { href: '/', label: 'Latest', matches: (path: string) => path === '/' },
  {
    href: '/blog',
    label: 'Entries',
    matches: (path: string) => path.startsWith('/blog'),
  },
  {
    href: '/world',
    label: 'World',
    matches: (path: string) =>
      path === '/world' || path.startsWith('/countries/'),
  },
  {
    href: '/vlogs',
    label: 'Vlogs',
    matches: (path: string) => path === '/vlogs',
  },
  {
    href: '/packing-checklist',
    label: 'Packing',
    matches: (path: string) => path === '/packing-checklist',
  },
]

export function SiteNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Main">
      <ul className="flex flex-wrap gap-x-1 font-mono text-[13px] tracking-wider uppercase">
        {destinations.map(({ href, label, matches }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={matches(pathname) ? 'page' : undefined}
              className="inline-flex min-h-11 items-center px-2.5 text-ink-soft transition-colors hover:text-ink aria-[current=page]:text-accent aria-[current=page]:underline aria-[current=page]:decoration-1 aria-[current=page]:underline-offset-[6px]"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
