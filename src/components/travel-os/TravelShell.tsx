'use client'

import { JournalSidebar } from '@/components/travel-os/JournalSidebar'
import { JournalWorkspace } from '@/components/travel-os/JournalWorkspace'
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
        <div className="min-h-0 flex-1">
          <JournalWorkspace detail={detail}>{children}</JournalWorkspace>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
