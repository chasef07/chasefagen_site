'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Backpack, BookOpen, Clapperboard, Globe2, House } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'

const destinations = [
  { href: '/', label: 'Today', icon: House },
  { href: '/world', label: 'World', icon: Globe2 },
  { href: '/vlogs', label: 'Vlogs', icon: Clapperboard },
  { href: '/packing-checklist', label: 'Packing', icon: Backpack },
]

export function NavigationRail() {
  const pathname = usePathname()
  const { isMobile, open, openMobile, toggleSidebar } = useSidebar()
  const journalOpen = isMobile ? openMobile : open

  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 flex h-svh w-(--navigation-rail-width) shrink-0 flex-col items-center gap-3 border-r border-sidebar-border bg-sidebar py-4"
    >
      {destinations.map(({ href, label, icon: Icon }) => {
        const active =
          pathname === href ||
          (href === '/world' && pathname.startsWith('/countries/'))

        return (
          <Button
            key={href}
            asChild
            variant="rail"
            size="rail"
            data-active={active}
          >
            <Link
              href={href}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              title={label}
            >
              <Icon aria-hidden="true" />
            </Link>
          </Button>
        )
      })}

      <div className="my-1 w-8 border-t border-sidebar-border" />
      <Button
        id="journal-navigation-trigger"
        variant="rail"
        size="rail"
        aria-label="Journal navigation"
        aria-expanded={journalOpen}
        aria-controls="journal-navigation"
        title={journalOpen ? 'Hide journal' : 'Browse journal'}
        data-active={pathname.startsWith('/blog') || journalOpen}
        onClick={toggleSidebar}
      >
        <BookOpen aria-hidden="true" />
      </Button>

      <span
        className="mt-auto flex size-9 items-center justify-center rounded-full border border-sidebar-border bg-card text-xs font-semibold tracking-tight text-primary"
        aria-label="Chase Fagen"
      >
        CF
      </span>
    </nav>
  )
}
