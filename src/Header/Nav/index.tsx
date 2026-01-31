'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-3 items-center rounded-full border border-[rgba(176,176,176,0.15)] bg-[rgba(176,176,176,0.3)] backdrop-blur-[10px] shadow-[0px_4px_4px_0px_rgba(37,19,53,0.1)] px-4 py-2">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="action-nav" />
      })}
    </nav>
  )
}
