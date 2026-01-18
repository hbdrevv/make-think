'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import { useDragScroll } from '@/blocks/shared/useDragScroll'
import type { WorksCarouselBlock as WorksCarouselBlockProps, Work, Media as MediaType } from '@/payload-types'

type Props = WorksCarouselBlockProps & {
  className?: string
}

const heightScale: Record<string, string> = {
  sm: 'clamp(240px, 30vw, 320px)',
  md: 'clamp(320px, 40vw, 480px)',
  lg: 'clamp(400px, 50vw, 640px)',
}

// Fixed 16:9 aspect ratio for works
const ASPECT_RATIO = 16 / 9

// Simple gutter from viewport edge
const GUTTER = '1rem'
// Space to show hint of previous image
const PEEK_OFFSET = '64px'

export const WorksCarouselBlock: React.FC<Props> = (props) => {
  const { title, height = 'md', works, className } = props

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

  if (!works || works.length === 0) return null

  const containerHeight = heightScale[height] || heightScale.md

  // Helper to get cover image from work
  const getCoverImage = (work: Work): MediaType | null => {
    // Try hero.media first
    if (work.hero?.media && typeof work.hero.media === 'object') {
      return work.hero.media as MediaType
    }
    // Fallback to meta.image
    if (work.meta?.image && typeof work.meta.image === 'object') {
      return work.meta.image as MediaType
    }
    return null
  }

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
        {works.map((workItem, index) => {
          // Handle both populated and non-populated relationships
          const work = typeof workItem === 'object' ? workItem : null
          if (!work) return null

          const coverImage = getCoverImage(work)
          const isFirst = index === 0

          return (
            <div
              key={work.id}
              className="flex-shrink-0 flex flex-col"
              style={{
                width: `calc(${containerHeight} * ${ASPECT_RATIO})`,
                marginLeft: isFirst ? `calc(${GUTTER} + ${PEEK_OFFSET})` : undefined,
              }}
            >
              {/* Image as drag target only - no link */}
              <div
                className="relative w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
                style={{ height: containerHeight }}
              >
                {coverImage && (
                  <Media
                    resource={coverImage}
                    fill
                    imgClassName="object-cover"
                    videoClassName="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                {!coverImage && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/work/${work.slug}`}
                    className="font-medium hover:underline"
                  >
                    {work.title}
                  </Link>
                  {work.meta?.description && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {work.meta.description}
                    </p>
                  )}
                </div>
                <Link
                  href={`/work/${work.slug}`}
                  className="flex-shrink-0 mt-0.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  View →
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      {works.length > 1 && (
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
