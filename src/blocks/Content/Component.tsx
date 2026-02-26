import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps, Media as MediaType } from '@/payload-types'

import { CMSLink } from '../../components/Link'
import { Media } from '../../components/Media'
import { getCachedGlobal } from '@/utilities/getGlobals'

// Padding-bottom percentages for aspect ratios (height/width * 100)
const aspectRatioPadding: Record<string, string> = {
  oneThird: '133.33%',  // 3:4 = 4/3 = 133.33%
  half: '75%',          // 4:3 = 3/4 = 75%
  twoThirds: '75%',     // 4:3 = 3/4 = 75%
  full: '56.25%',       // 16:9 = 9/16 = 56.25%
}

// Height scale for contain mode
const heightScale: Record<string, string> = {
  sm: 'clamp(240px, 30vw, 320px)',
  md: 'clamp(320px, 40vw, 480px)',
  lg: 'clamp(400px, 50vw, 640px)',
}

const imageSizes: Record<string, string> = {
  oneThird: '(max-width: 768px) 100vw, 33vw',
  half: '(max-width: 768px) 100vw, 50vw',
  twoThirds: '(max-width: 768px) 100vw, 66vw',
  full: '100vw',
}

const alignmentClasses: Record<string, string> = {
  top: 'items-start',
  center: 'items-center',
  bottom: 'items-end',
}

const objectPositionClasses: Record<string, string> = {
  top: 'object-top',
  center: 'object-center',
  bottom: 'object-bottom',
}

const colsSpanClasses: Record<string, string> = {
  full: '12',
  half: '6',
  oneThird: '4',
  twoThirds: '8',
}

export const ContentBlock: React.FC<ContentBlockProps> = async (props) => {
  const { columns } = props

  const siteSettings = await getCachedGlobal('site-settings', 0)()
  const verticalAlign = siteSettings?.columnVerticalAlign || 'top'
  const alignClass = alignmentClasses[verticalAlign]
  const objectPosition = objectPositionClasses[verticalAlign]

  return (
    <div className="container">
      <div className={cn('grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16', alignClass)}>
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { contentType = 'text', enableLink, link, richText, media, size } = col
            const image = media?.image as MediaType | undefined

            const isContain = media?.contain === true
            const containHeight = heightScale[media?.height || 'md']

            const mediaContent = contentType === 'media' && image && (
              <figure>
                {isContain ? (
                  <div
                    className="w-full overflow-hidden [&_picture]:block [&_img]:w-full [&_img]:h-auto [&_img]:max-h-[var(--contain-height)]"
                    style={{ '--contain-height': containHeight } as React.CSSProperties}
                  >
                    <Media
                      resource={image}
                      imgClassName="object-contain"
                      size={imageSizes[size!]}
                    />
                  </div>
                ) : (
                  <div
                    className="relative w-full overflow-hidden"
                    style={{ paddingBottom: aspectRatioPadding[size!] }}
                  >
                    <Media
                      resource={image}
                      fill
                      imgClassName="object-cover absolute inset-0"
                      pictureClassName="absolute inset-0"
                      size={imageSizes[size!]}
                    />
                  </div>
                )}
                {media?.caption && (
                  <figcaption className="mt-2 text-sm">
                    {media.caption}
                  </figcaption>
                )}
              </figure>
            )

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                  'hidden lg:block': contentType === 'empty',
                })}
                key={index}
              >
                {contentType === 'text' && (
                  <>
                    {richText && <RichText data={richText} enableGutter={false} />}
                    {enableLink && (
                      <div className="mt-6">
                        <CMSLink {...link} />
                      </div>
                    )}
                  </>
                )}

                {contentType === 'media' && image && (
                  <>
                    {enableLink ? (
                      <CMSLink {...link} appearance="inline" className="block">
                        {mediaContent}
                      </CMSLink>
                    ) : (
                      mediaContent
                    )}
                  </>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
