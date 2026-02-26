import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <div className="container">
      <div className="bg-[#FDF9FA] dark:bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:items-center w-fit max-w-full">
        <div className="flex items-center">
          {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
        </div>
        {links && links.length > 0 && (
          <div className="flex flex-col gap-8 md:flex-row md:gap-4 flex-shrink-0">
            {links.map(({ link }, i) => {
              return <CMSLink key={i} size="lg" {...link} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}
