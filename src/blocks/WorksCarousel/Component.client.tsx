'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import type { Work, Media as MediaType } from '@/payload-types'

type Props = {
  title?: string | null
  height?: 'sm' | 'md' | 'lg' | null
  works: Work[]
  className?: string
}

// Responsive height scales - smaller on mobile
const heightScale: Record<string, string> = {
  sm: 'clamp(180px, 25vw, 320px)',
  md: 'clamp(220px, 35vw, 480px)',
  lg: 'clamp(280px, 45vw, 640px)',
}

// Fixed 16:9 aspect ratio for works
const ASPECT_RATIO = 16 / 9

// Gutter matches Tailwind container padding via CSS custom property
// Mobile/sm: 1rem, md+: 2rem

export const WorksCarouselClient: React.FC<Props> = (props) => {
  const { title, height = 'md', works, className } = props

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollLeft = container.scrollLeft
    const maxScroll = container.scrollWidth - container.clientWidth
    const adjustedMax = maxScroll - container.clientWidth * 0.6
    const progress = adjustedMax > 0 ? scrollLeft / adjustedMax : 0

    setScrollProgress(Math.min(1, Math.max(0, progress)))
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < maxScroll - 10)
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    container.addEventListener('scroll', updateScrollState, { passive: true })
    updateScrollState()
    return () => container.removeEventListener('scroll', updateScrollState)
  }, [updateScrollState])

  const scrollToDirection = useCallback((direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    // Calculate item width based on container height
    const containerHeight = container.querySelector('[data-carousel-item]')?.clientHeight || 400
    const itemWidth = containerHeight * ASPECT_RATIO + 16 // + gap

    container.scrollBy({
      left: direction === 'right' ? itemWidth : -itemWidth,
      behavior: 'smooth',
    })
  }, [])

  if (!works || works.length === 0) return null

  const containerHeight = heightScale[height || 'md'] || heightScale.md

  // Helper to get cover image from work
  const getCoverImage = (work: Work): MediaType | null => {
    if (work.hero?.media && typeof work.hero.media === 'object') {
      return work.hero.media as MediaType
    }
    if (work.meta?.image && typeof work.meta.image === 'object') {
      return work.meta.image as MediaType
    }
    return null
  }

  return (
    <div
      className={cn('relative works-carousel-container', className)}
      style={{
        ['--gutter' as string]: '1rem',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
      }}
    >
      {/* Responsive CSS to match container padding */}
      <style>{`
        .works-carousel-container {
          --gutter: 1rem;
        }
        @media (min-width: 768px) {
          .works-carousel-container {
            --gutter: 2rem;
          }
        }
      `}</style>
      {/* Header with title and arrows */}
      <div
        className="flex items-center justify-between mb-4"
        style={{
          paddingLeft: 'var(--gutter)',
          paddingRight: 'var(--gutter)',
        }}
      >
        {title ? (
          <h3 className="text-lg font-medium">{title}</h3>
        ) : (
          <div />
        )}

        {/* Arrow controls */}
        {works.length > 1 && (
          <div className="flex gap-2">
            <button
              onClick={() => scrollToDirection('left')}
              disabled={!canScrollLeft}
              className={cn(
                'w-10 h-10 rounded-full border flex items-center justify-center transition-all',
                canScrollLeft
                  ? 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                  : 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
              )}
              aria-label="Previous slide"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 5L7 10L12 15" />
              </svg>
            </button>
            <button
              onClick={() => scrollToDirection('right')}
              disabled={!canScrollRight}
              className={cn(
                'w-10 h-10 rounded-full border flex items-center justify-center transition-all',
                canScrollRight
                  ? 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                  : 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
              )}
              aria-label="Next slide"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 5L13 10L8 15" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Carousel container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingLeft: 'var(--gutter)',
          paddingRight: 'calc(100vw - var(--gutter) - 100px)',
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: 'var(--gutter)',
        }}
      >
        {works.map((work) => {
          const coverImage = getCoverImage(work)

          return (
            <div
              key={work.id}
              data-carousel-item
              className="flex-shrink-0 flex flex-col"
              style={{
                width: `calc(${containerHeight} * ${ASPECT_RATIO})`,
                scrollSnapAlign: 'start',
              }}
            >
              {/* Clickable image */}
              <Link
                href={`/work/${work.slug}`}
                className="relative w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 block group"
                style={{ height: containerHeight }}
              >
                {coverImage && (
                  <Media
                    resource={coverImage}
                    fill
                    imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
                    videoClassName="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                {!coverImage && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </Link>
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
          style={{ paddingLeft: 'var(--gutter)', paddingRight: 'var(--gutter)' }}
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
