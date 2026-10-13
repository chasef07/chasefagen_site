'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  claimDetailNavigation,
  closeDetail,
  restoreDetailFocus,
} from '@/lib/journal-detail-history'

export function JournalReader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const contentRef = useRef<HTMLDivElement>(null)
  const didNavigateRef = useRef(false)
  const [open, setOpen] = useState(true)

  const focusTitle = useCallback(() => {
    contentRef.current
      ?.querySelector<HTMLElement>('[data-detail-title]')
      ?.focus({ preventScroll: true })
  }, [])

  const finishClose = useCallback(() => {
    if (didNavigateRef.current) return

    didNavigateRef.current = true
    closeDetail(() => router.back())
  }, [router])

  const requestClose = useCallback(() => {
    setOpen(false)
  }, [])

  useEffect(() => {
    claimDetailNavigation(pathname)
    const frame = requestAnimationFrame(focusTitle)
    return () => cancelAnimationFrame(frame)
  }, [focusTitle, pathname])

  useEffect(
    () => () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!document.querySelector('[data-journal-reader]')) {
            restoreDetailFocus()
          }
        })
      })
    },
    [],
  )

  useEffect(() => {
    if (open) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const fallback = window.setTimeout(
      finishClose,
      prefersReducedMotion ? 0 : 400,
    )

    return () => window.clearTimeout(fallback)
  }, [finishClose, open])

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) requestClose()
      }}
    >
      <SheetContent
        data-journal-reader
        side="right"
        overlayClassName="bg-black/35 backdrop-blur-[1px] duration-300 data-[state=closed]:duration-200 data-[state=open]:duration-300 motion-reduce:backdrop-blur-none"
        className="w-full max-w-none gap-0 p-0 duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-[state=closed]:duration-200 data-[state=open]:duration-300 data-[side=right]:w-full data-[side=right]:max-w-none data-[side=right]:sm:w-[min(92vw,48rem)] data-[side=right]:sm:max-w-none"
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          requestAnimationFrame(focusTitle)
        }}
        onCloseAutoFocus={(event) => event.preventDefault()}
        onAnimationEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.currentTarget.dataset.state === 'closed'
          ) {
            finishClose()
          }
        }}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Journal detail</SheetTitle>
          <SheetDescription>The selected journal resource.</SheetDescription>
        </SheetHeader>
        <div
          ref={contentRef}
          data-detail-scroll
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}
