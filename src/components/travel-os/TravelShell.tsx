'use client'

import { JournalSidebar } from '@/components/travel-os/JournalSidebar'
import { NavigationRail } from '@/components/travel-os/NavigationRail'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import type { JourneyStop } from '@/content/world-journey'
import type { JournalNavigationYear } from '@/lib/journal'

export function TravelShell({
  children,
  detail,
  years,
  currentLocation,
}: {
  children: React.ReactNode
  detail: React.ReactNode
  years: JournalNavigationYear[]
  currentLocation: Pick<JourneyStop, 'name' | 'stopName'>
}) {
  return (
    <SidebarProvider>
      <NavigationRail />
      <JournalSidebar years={years} currentLocation={currentLocation} />
      <SidebarInset className="h-svh overflow-hidden">
        <div className="relative min-h-0 min-w-0 flex-1">
          <div
            id="main-content"
            data-context-surface
            className="h-full min-w-0 overflow-y-auto overscroll-contain"
          >
            {children}
          </div>
          {detail}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
