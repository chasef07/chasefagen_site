'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronRight, Folder, FolderOpen } from 'lucide-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { CountryFlag } from '@/components/travel-os/CountryFlag'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import type { JourneyStop } from '@/content/world-journey'
import type { JournalNavigationYear } from '@/lib/journal'

function NavigationLink({
  href,
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <Link
      href={href}
      onClick={() => {
        if (isMobile) setOpenMobile(false)
      }}
      {...props}
    >
      {children}
    </Link>
  )
}

function MonthFlags({ countries }: { countries: string[] }) {
  if (countries.length === 0) return null

  return (
    <span className="flex shrink-0 gap-1" aria-label={countries.join(', ')}>
      {countries.slice(0, 3).map((country) => (
        <CountryFlag key={country} country={country} className="text-sm" />
      ))}
    </span>
  )
}

export function JournalSidebar({
  years,
  currentLocation,
}: {
  years: JournalNavigationYear[]
  currentLocation: Pick<JourneyStop, 'name' | 'stopName'>
}) {
  const pathname = usePathname()
  const activeYear = years.find((year) =>
    year.months.some(
      (month) =>
        pathname === month.href || pathname.startsWith(`${month.href}/`),
    ),
  )?.year
  const [openYear, setOpenYear] = useState<number | undefined>(activeYear)

  useEffect(() => {
    setOpenYear(activeYear)
  }, [activeYear, pathname])

  return (
    <Sidebar id="journal-navigation">
      <SidebarHeader className="gap-3 px-4 py-6">
        <div className="flex items-center justify-between gap-2">
          <NavigationLink
            href="/"
            className="rounded-md px-2 py-1 text-lg font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            Chase Fagen
          </NavigationLink>
          <SidebarTrigger className="md:hidden" />
        </div>
        <div className="flex min-w-0 items-center gap-2 px-2 text-xs text-muted-foreground">
          <span className="size-2 shrink-0 rounded-full bg-[var(--ui-current-location)]" />
          <span className="min-w-0 leading-snug">
            Currently in{' '}
            {currentLocation.stopName
              ? `${currentLocation.stopName}, ${currentLocation.name}`
              : currentLocation.name}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 pb-6">
        <Separator className="my-2" />

        <p className="px-3 py-1 text-xs font-medium text-muted-foreground">
          Journal
        </p>
        <SidebarMenu>
          {years.map((year) => {
            const isOpen = openYear === year.year

            return (
              <Collapsible
                key={year.year}
                className="group/year"
                open={isOpen}
                onOpenChange={(open) =>
                  setOpenYear(open ? year.year : undefined)
                }
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className="font-medium"
                      isActive={activeYear === year.year}
                    >
                      {isOpen ? <FolderOpen /> : <Folder />}
                      <span className="flex-1 tabular-nums">{year.year}</span>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {year.postCount}
                      </span>
                      <ChevronRight className="transition-transform duration-200 group-data-[state=open]/year:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="py-1">
                      {year.months.map((month) => (
                        <SidebarMenuSubItem key={month.key}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              pathname === month.href ||
                              pathname.startsWith(`${month.href}/`)
                            }
                            className="min-h-9"
                          >
                            <NavigationLink href={month.href}>
                              <span className="min-w-0 flex-1 truncate">
                                {month.label}
                              </span>
                              <MonthFlags countries={month.countries} />
                              <span className="w-4 text-right text-xs tabular-nums text-muted-foreground">
                                {month.postCount}
                              </span>
                            </NavigationLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
