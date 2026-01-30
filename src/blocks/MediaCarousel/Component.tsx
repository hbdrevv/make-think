'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import { useDragScroll } from '@/blocks/shared/useDragScroll'
import type { MediaCarouselBlock as MediaCarouselBlockProps } from '@/payload-types'

type Props = MediaCarouselBlockProps & {
  className?: string
}

const heightScale: Record<string, string> = {
  sm: 'clamp(240px, 30vw, 320px)',
  md: 'clamp(320px, 40vw, 480px)',
  lg: 'clamp(400px, 50vw, 640px)',
}

const aspectRatioValues: Record<string, number> = {
  '3:4': 3 / 4,
  '16:9': 16 / 9,
  '9:16': 9 / 16,
}

// Space to show hint of previous image
const PEEK_OFFSET = '64px'

export const MediaCarouselBlock: React.FC<Props> = (props) => {
  const { title, height = 'md', images, className } = props

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  const { handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave } = useDragScroll(scrollContainerRef)

  const updateProgress = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const maxScroll = container.scrollWidth - container.clientWidth
    if (maxScroll <= 0) {
      setProgress(0)
      return
    }

    setProgress(container.scrollLeft / maxScroll)
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    container.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    return () => container.removeEventListener('scroll', updateProgress)
  }, [updateProgress])

  if (!images || images.length === 0) return null

  const containerHeight = heightScale[height] || heightScale.md

  return (
    <div
      className={cn('relative overflow-x-clip media-carousel-container', className)}
      style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
      }}
    >
      {/* Responsive CSS to match container left edge */}
      <style>{`
        .media-carousel-container {
          --gutter: 1rem;
        }
        @media (min-width: 768px) {
          .media-carousel-container {
            --gutter: 2rem;
          }
        }
        @media (min-width: 1536px) {
          .media-carousel-container {
            --gutter: calc((100vw - 86rem) / 2 + 2rem);
          }
        }
      `}</style>

      {title && (
        <h3
          className="text-lg font-medium mb-4"
          style={{ paddingLeft: `calc(var(--gutter) + ${PEEK_OFFSET})` }}
        >
          {title}
        </h3>
      )}

      {/* Carousel container with snap */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto select-none snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingRight: `calc(100vw - var(--gutter) - 100px)`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {images.map((item, index) => {
          const { image, aspectRatio = '16:9', caption } = item
          const ratio = aspectRatioValues[aspectRatio] || aspectRatioValues['16:9']
          const isFirst = index === 0

          return (
            <div
              key={index}
              className="flex-shrink-0 flex flex-col snap-start"
              style={{
                width: `calc(${containerHeight} * ${ratio})`,
                marginLeft: isFirst ? `calc(var(--gutter) + ${PEEK_OFFSET})` : undefined,
              }}
            >
              <div
                className="relative w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
                style={{ height: containerHeight }}
              >
                {image && typeof image === 'object' && (
                  <Media
                    resource={image}
                    fill
                    imgClassName="object-cover"
                    videoClassName="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
              {caption && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {caption}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Slide progress */}
      {images.length > 1 && (
        <div
          className="mt-4"
          style={{ paddingLeft: `calc(var(--gutter) + ${PEEK_OFFSET})`, paddingRight: 'var(--gutter)' }}
        >
          <div className="h-0.5 w-full max-w-80 rounded-full bg-surface-muted-accent overflow-hidden">
            <div
              className="h-full bg-surface-accent rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
