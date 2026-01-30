'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const hasMedia = media && typeof media === 'object'

  useEffect(() => {
    setHeaderTheme(hasMedia ? 'dark' : 'light')
  })

  return (
    <div
      className="relative -mt-[10.4rem] flex items-end min-h-[809px]"
      data-theme={hasMedia ? 'dark' : undefined}
    >
      {/* Background: image with overlay, or gradient fallback */}
      <div className="absolute inset-0">
        {hasMedia ? (
          <>
            <Media fill imgClassName="object-cover" priority resource={media} />
            <div className="absolute inset-0 bg-black/20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-surface-alt-gradient dark:bg-primitive-black" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-8 py-16">
        <div className="flex flex-col items-start gap-8 max-w-[720px]">
          {richText && <RichText data={richText} enableGutter={false} />}
          {!hasMedia && Array.isArray(links) && links.length > 0 && (
            <ul className="flex gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} appearance="action" />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
