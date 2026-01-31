import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

export const MediumImpactHero: React.FC<Page['hero'] & { pageTitle?: string }> = ({
  pageTitle,
  richText,
}) => {
  return (
    <div className="container flex flex-col items-center justify-center text-center min-h-[312px] py-16">
      <div className="flex flex-col items-center gap-3 max-w-[640px]">
        {pageTitle && <p className="text-label-page-title">{pageTitle}</p>}
        {richText && <RichText data={richText} enableGutter={false} />}
      </div>
    </div>
  )
}
