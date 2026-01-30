import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { neueYorkCondensed, neueYorkNarrow, neueYorkNormal } from '@/fonts'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html
      className={cn(
        GeistSans.variable,
        GeistMono.variable,

        neueYorkNormal.variable,
        neueYorkCondensed.variable,
        neueYorkNarrow.variable,
      )}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/media/drevv_logo_rounded_2x.png" rel="icon" sizes="32x32" />
        <link href="/media/drevv_logo_rounded_2x.png" rel="icon" type="image/png" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: {
    default: 'Drew VanderVeen Design',
    template: '%s | Drew VanderVeen',
  },
  // ...
}
