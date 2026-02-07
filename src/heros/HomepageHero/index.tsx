'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Play } from 'lucide-react'

import type { Page, Work, Media as MediaType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { VimeoLightbox } from '@/components/VimeoLightbox'

type HomepageHeroProps = Page['hero'] & {
  featuredContentType?: 'work' | 'externalMedia' | null
  featuredWork?: Work | string | null
  externalMedia?: {
    thumbnail?: MediaType | string | null
    vimeoUrl?: string | null
  } | null
}

export const HomepageHero: React.FC<HomepageHeroProps> = ({
  links,
  richText,
  featuredContentType,
  featuredWork,
  externalMedia,
}) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  const isWorkType = featuredContentType === 'work'
  const workData = typeof featuredWork === 'object' ? featuredWork : null
  const workThumbnail = workData?.hero?.media
  const workSlug = workData?.slug

  const externalThumbnail = externalMedia?.thumbnail
  const vimeoUrl = externalMedia?.vimeoUrl

  const thumbnail = isWorkType ? workThumbnail : externalThumbnail
  // Check for both object (populated) and string/number (ID reference)
  const hasThumbnail =
    thumbnail &&
    (typeof thumbnail === 'object' ||
      typeof thumbnail === 'string' ||
      typeof thumbnail === 'number')

  return (
    <div className="relative -mt-[10.4rem] flex items-end min-h-[809px]">
      <div className="absolute inset-0 bg-surface-alt-gradient dark:bg-primitive-black" />

      <div className="relative z-10 container py-16">
        <div className="grid grid-cols-4 lg:grid-cols-12 gap-x-16 gap-y-8 items-end">
          {/* Left content - 8 columns */}
          <div className="col-span-4 lg:col-span-8 flex flex-col items-start gap-8">
            {richText && <RichText data={richText} enableGutter={false} />}
            {Array.isArray(links) && links.length > 0 && (
              <ul className="flex gap-4">
                {links.map(({ link }, i) => (
                  <li key={i}>
                    <CMSLink {...link} appearance="action" />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right thumbnail - 4 columns */}
          {hasThumbnail && (
            <div className="col-span-2 lg:col-span-4">
              <FeaturedThumbnail
                thumbnail={thumbnail}
                isWorkType={isWorkType}
                workSlug={workSlug}
                hasVideo={!!vimeoUrl}
                onPlayClick={() => setLightboxOpen(true)}
              />
            </div>
          )}
        </div>
      </div>

      {!isWorkType && vimeoUrl && (
        <VimeoLightbox open={lightboxOpen} onOpenChange={setLightboxOpen} vimeoUrl={vimeoUrl} />
      )}
    </div>
  )
}

interface FeaturedThumbnailProps {
  thumbnail: MediaType | string | number
  isWorkType: boolean
  workSlug?: string | null
  hasVideo: boolean
  onPlayClick: () => void
}

const FeaturedThumbnail: React.FC<FeaturedThumbnailProps> = ({
  thumbnail,
  isWorkType,
  workSlug,
  hasVideo,
  onPlayClick,
}) => {
  const playButtonRef = useRef<HTMLDivElement>(null)

  const updateFlairPosition = (e: React.MouseEvent) => {
    const button = playButtonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    button.style.setProperty('--mouse-x', `${x}px`)
    button.style.setProperty('--mouse-y', `${y}px`)
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    updateFlairPosition(e)
    const button = playButtonRef.current
    if (!button) return

    const flair = button.querySelector('[data-flair]') as HTMLElement
    if (flair) {
      flair.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      flair.style.transform = 'translate(-50%, -50%) scale(2.5)'
    }
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    updateFlairPosition(e)
    const button = playButtonRef.current
    if (!button) return

    const flair = button.querySelector('[data-flair]') as HTMLElement
    if (flair) {
      flair.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      flair.style.transform = 'translate(-50%, -50%) scale(0)'
    }
  }

  const thumbnailContent = (
    <div className="relative aspect-[16/9] rounded-xl overflow-hidden group cursor-pointer">
      <Media
        resource={thumbnail}
        fill
        pictureClassName="absolute inset-0"
        imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
        videoClassName="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {!isWorkType && hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            ref={playButtonRef}
            className="relative w-16 h-16 rounded-full border border-[rgba(176,176,176,0.15)] bg-[rgba(176,176,176,0.3)] backdrop-blur-[10px] shadow-[0px_4px_4px_0px_rgba(37,19,53,0.1)] flex items-center justify-center overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={updateFlairPosition}
          >
            <span
              data-flair
              className="pointer-events-none absolute rounded-full bg-primitive-coral dark:bg-primitive-black"
              style={{
                width: '200%',
                aspectRatio: '1',
                left: 'var(--mouse-x, 50%)',
                top: 'var(--mouse-y, 50%)',
                transform: 'translate(-50%, -50%) scale(0)',
              }}
            />
            <Play
              className="relative z-10 w-6 h-6 text-surface-foreground ml-1"
              fill="currentColor"
            />
          </div>
        </div>
      )}
    </div>
  )

  if (isWorkType && workSlug) {
    return (
      <Link href={`/work/${workSlug}`} className="block">
        {thumbnailContent}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onPlayClick} className="block w-full text-left">
      {thumbnailContent}
    </button>
  )
}
