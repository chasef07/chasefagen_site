import type { Metadata } from 'next'
import './globals.css'
import { generatePageMetadata, generateWebsiteJsonLd } from '@/lib/seo'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import { Fraunces, IBM_Plex_Mono, Newsreader } from 'next/font/google'

import { SiteFooter } from '@/components/journal/SiteFooter'
import { SiteHeader } from '@/components/journal/SiteHeader'

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-fraunces',
})
const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-newsreader',
})
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
})

export const metadata: Metadata = generatePageMetadata({
  title: 'Chase Fagen Blog',
  description: 'Travel stories and notes from Chase Fagen.',
  keywords: ['travel journal', 'travel stories', 'Chase Fagen'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const websiteJsonLd = generateWebsiteJsonLd()

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${newsreader.variable} ${plexMono.variable}`}
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
      <body suppressHydrationWarning className="flex min-h-svh flex-col">
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
          className="fixed top-3 left-3 z-50 -translate-y-20 bg-ink px-3 py-2 font-mono text-sm text-paper transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div id="main-content" className="flex-1">
          {children}
        </div>
        <SiteFooter />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
