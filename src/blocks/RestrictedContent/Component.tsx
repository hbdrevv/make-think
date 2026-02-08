import React from 'react'
import { HalloweenGhost } from 'griddy-icons'

import type { RestrictedContentBlock as RestrictedContentBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const RestrictedContentBlock: React.FC<RestrictedContentBlockProps> = ({
  headline,
  blurredText,
  enableLink,
  link,
}) => {
  return (
    <div className="container transparent">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-2">
        {/* Match two-thirds content column layout */}
        <div className="col-span-4 lg:col-span-8">
          <div className="relative overflow-hidden">
            {/* Blurred background text - defines container height */}
            <div aria-hidden="true" className="pointer-events-none select-none px-2">
              <p className="text-heading-2 text-left text-surface-foreground/0.08 blur-[3px] leading-relaxed">
                {blurredText}
              </p>
            </div>

            {/* Fade overlay to mask overflow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, transparent 0%, transparent 2%, var(--surface-base) 60%)',
              }}
            />

            {/* Foreground content - centered over blurred text */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 text-center">
              <HalloweenGhost size={48} className="text-surface-foreground" />
              <h3 className="text-heading-standard">{headline}</h3>
              {enableLink && link && (
                <div className="mt-2">
                  <CMSLink {...link} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
