import type { Metadata } from 'next'
import './globals.css'
import { generatePageMetadata, generateWebsiteJsonLd } from '@/lib/seo'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import { TravelShell } from '@/components/travel-os/TravelShell'
import { archives, posts } from '@/content/blog/publication'
import { currentJourneyStop } from '@/content/world-journey'
import { buildJournalNavigation } from '@/lib/journal'
import { Manrope, Source_Serif_4 } from 'next/font/google'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
})

export const metadata: Metadata = generatePageMetadata({
  title: 'Chase Fagen Blog',
  description: 'Travel stories and notes from Chase Fagen.',
  keywords: ['travel journal', 'travel stories', 'Chase Fagen'],
})

export default function RootLayout({
  children,
  reader,
}: {
  children: React.ReactNode
  reader: React.ReactNode
}) {
  const websiteJsonLd = generateWebsiteJsonLd()

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${sourceSerif.variable} font-sans`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Chase Fagen Blog RSS Feed"
          href="/feed.xml"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen">
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              async
            />
            <script
              id="google-analytics"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `,
              }}
            />
          </>
        )}

        <a
          href="#main-content"
          className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <TravelShell
          years={buildJournalNavigation(posts, archives)}
          currentLocation={currentJourneyStop}
          detail={reader}
        >
          {children}
        </TravelShell>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
