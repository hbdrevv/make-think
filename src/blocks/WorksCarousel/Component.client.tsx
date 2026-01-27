'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Mousewheel } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import type { Work, Media as MediaType } from '@/payload-types'

import 'swiper/css'
import 'swiper/css/free-mode'

type Props = {
  title?: string | null
  height?: 'sm' | 'md' | 'lg' | null
  works: Work[]
  className?: string
}

// Responsive height scales
const heightScale: Record<string, string> = {
  sm: 'clamp(180px, 25vw, 320px)',
  md: 'clamp(220px, 35vw, 480px)',
  lg: 'clamp(280px, 45vw, 640px)',
}

// Fixed 16:9 aspect ratio for works
const ASPECT_RATIO = 16 / 9

export const WorksCarouselClient: React.FC<Props> = (props) => {
  const { title, height = 'md', works, className } = props

  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [progress, setProgress] = useState(0)

  const handleSlideChange = (swiper: SwiperType) => {
    setCanScrollLeft(!swiper.isBeginning)
    setCanScrollRight(!swiper.isEnd)
    setProgress(swiper.progress)
  }

  const scrollToDirection = (direction: 'left' | 'right') => {
    if (!swiperInstance) return
    if (direction === 'left') {
      swiperInstance.slidePrev()
    } else {
      swiperInstance.slideNext()
    }
  }

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
        .works-carousel-container .swiper {
          padding-left: var(--gutter);
          padding-right: var(--gutter);
          overflow: visible;
        }
        .works-carousel-container .swiper-wrapper {
          align-items: stretch;
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

      {/* Swiper Carousel */}
      <Swiper
        modules={[FreeMode, Mousewheel]}
        onSwiper={setSwiperInstance}
        onSlideChange={handleSlideChange}
        onProgress={(swiper, prog) => setProgress(prog)}
        onReachBeginning={() => setCanScrollLeft(false)}
        onReachEnd={() => setCanScrollRight(false)}
        onFromEdge={() => {
          if (swiperInstance) {
            setCanScrollLeft(!swiperInstance.isBeginning)
            setCanScrollRight(!swiperInstance.isEnd)
          }
        }}
        spaceBetween={16}
        slidesPerView="auto"
        freeMode={{
          enabled: true,
          sticky: false,
          momentumBounce: false,
        }}
        mousewheel={{
          forceToAxis: true,
        }}
        grabCursor={true}
        touchEventsTarget="container"
        threshold={10}
      >
        {works.map((work) => {
          const coverImage = getCoverImage(work)

          return (
            <SwiperSlide
              key={work.id}
              style={{
                width: `calc(${containerHeight} * ${ASPECT_RATIO})`,
                height: 'auto',
              }}
            >
              <div className="flex flex-col h-full">
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
            </SwiperSlide>
          )
        })}
      </Swiper>

      {/* Progress bar */}
      {works.length > 1 && (
        <div
          className="mt-4"
          style={{ paddingLeft: 'var(--gutter)', paddingRight: 'var(--gutter)' }}
        >
          <div className="h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 dark:bg-white rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
