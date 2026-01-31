'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header className="container sticky top-0 z-20" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="py-8 flex items-center gap-0">
        <Link
          href="/"
          aria-label="Home"
          className="flex items-center justify-center rounded-lg border border-[rgba(176,176,176,0.15)] bg-[rgba(176,176,176,0.3)] backdrop-blur-[10px] shadow-[0px_4px_4px_0px_rgba(37,19,53,0.1)] p-2 self-stretch hover:text-surface-accent transition-colors"
        >
          <Logo className="w-5 h-5" />
        </Link>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
