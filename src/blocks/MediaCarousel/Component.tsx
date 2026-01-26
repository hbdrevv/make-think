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

// Simple gutter from viewport edge
const GUTTER = '1rem'
// Space to show hint of previous image
const PEEK_OFFSET = '64px'

export const MediaCarouselBlock: React.FC<Props> = (props) => {
  const { title, height = 'md', images, className } = props

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const { handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave } = useDragScroll(scrollContainerRef)

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollLeft = container.scrollLeft
    // Adjust maxScroll so progress completes when last image is fully visible
    const maxScroll = container.scrollWidth - container.clientWidth
    const adjustedMax = maxScroll - container.clientWidth * 0.6
    const progress = adjustedMax > 0 ? scrollLeft / adjustedMax : 0

    setScrollProgress(Math.min(1, Math.max(0, progress)))
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initialize progress
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  if (!images || images.length === 0) return null

  const containerHeight = heightScale[height] || heightScale.md

  return (
    <div
      className={cn('relative', className)}
      style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
      }}
    >
      {title && (
        <h3
          className="text-lg font-medium mb-4"
          style={{ paddingLeft: `calc(${GUTTER} + ${PEEK_OFFSET})` }}
        >
          {title}
        </h3>
      )}

      {/* Carousel container - full bleed, no snap */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto select-none"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingRight: `calc(100vw - ${GUTTER} - 100px)`,
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
              className="flex-shrink-0 flex flex-col"
              style={{
                width: `calc(${containerHeight} * ${ratio})`,
                marginLeft: isFirst ? `calc(${GUTTER} + ${PEEK_OFFSET})` : undefined,
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

      {/* Progress bar */}
      {images.length > 1 && (
        <div
          className="mt-4"
          style={{ paddingLeft: `calc(${GUTTER} + ${PEEK_OFFSET})`, paddingRight: GUTTER }}
        >
          <div className="h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 dark:bg-white rounded-full transition-all duration-150 ease-out"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
