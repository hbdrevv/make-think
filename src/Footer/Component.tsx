import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { Linkedin, Github } from 'griddy-icons'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto bg-primitive-charcoal text-primitive-sage">
      <div className="container flex items-center justify-between py-4">
        <p className="text-body-xs">
          Portfolio of Drew VanderVeen. Digital Product Designer. Design Systems Leader.
        </p>

        <div className="flex items-center gap-5">
          <ThemeSelector />
          <nav className="flex items-center gap-1">
            {navItems.map(({ link }, i) => {
              const url = link?.url || ''
              const isLinkedin = url.includes('linkedin')
              const isGithub = url.includes('github')
              const Icon = isLinkedin ? Linkedin : isGithub ? Github : null

              if (Icon) {
                return (
                  <Link
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={isLinkedin ? 'LinkedIn' : 'GitHub'}
                    className="text-primitive-sage hover:text-surface-accent transition-colors"
                  >
                    <Icon size={24} />
                  </Link>
                )
              }

              return null
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
