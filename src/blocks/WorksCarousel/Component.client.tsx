'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Mousewheel } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { cn } from '@/utilities/ui'
import { ActionButton } from '@/components/ui/action-button'
import { ArrowLeft, ArrowRight } from 'griddy-icons'
import { Media } from '@/components/Media'
import type { Work, Media as MediaType } from '@/payload-types'

import 'swiper/css'

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
      className={cn('relative overflow-x-clip works-carousel-container', className)}
      style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
      }}
    >
      {/* Responsive CSS to match container left edge */}
      <style>{`
        .works-carousel-container {
          --gutter: 1rem;
        }
        @media (min-width: 768px) {
          .works-carousel-container {
            --gutter: 2rem;
          }
        }
        @media (min-width: 1536px) {
          .works-carousel-container {
            --gutter: calc((100vw - 86rem) / 2 + 2rem);
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
          <div className="flex gap-1">
            <button
              onClick={() => scrollToDirection('left')}
              disabled={!canScrollLeft}
              className={cn(
                'rounded p-1 flex items-center justify-center transition-all',
                canScrollLeft
                  ? 'border border-surface-foreground text-surface-foreground hover:bg-primitive-coral hover:border-surface-accent hover:text-surface-accent cursor-pointer'
                  : 'border border-surface-muted-accent text-surface-muted-accent cursor-not-allowed'
              )}
              aria-label="Previous slide"
            >
              <ArrowLeft size="18px" />
            </button>
            <button
              onClick={() => scrollToDirection('right')}
              disabled={!canScrollRight}
              className={cn(
                'rounded p-1 flex items-center justify-center transition-all',
                canScrollRight
                  ? 'border border-surface-foreground text-surface-foreground hover:bg-primitive-coral hover:border-surface-accent hover:text-surface-accent cursor-pointer'
                  : 'border border-surface-muted-accent text-surface-muted-accent cursor-not-allowed'
              )}
              aria-label="Next slide"
            >
              <ArrowRight size="18px" />
            </button>
          </div>
        )}
      </div>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Mousewheel]}
        onSwiper={setSwiperInstance}
        onSlideChange={handleSlideChange}
        onProgress={(swiper) => setProgress(swiper.progress)}
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
              <div className="group/card flex flex-col h-full">
                {/* Clickable image */}
                <Link
                  href={`/work/${work.slug}`}
                  className="relative w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 block"
                  style={{ height: containerHeight }}
                >
                  {coverImage && (
                    <Media
                      resource={coverImage}
                      fill
                      imgClassName="object-cover transition-transform duration-300 group-hover/card:scale-105"
                      videoClassName="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  {!coverImage && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </Link>
                <div className="mt-3 flex items-start justify-between gap-4 px-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/work/${work.slug}`}
                      className="font-medium transition-colors group-hover/card:text-surface-accent"
                    >
                      {work.title}
                    </Link>
                  </div>
                  <ActionButton asChild variant="ghost" intent="internal" className="group-hover/card:text-surface-accent">
                    <Link href={`/work/${work.slug}`}>View Project</Link>
                  </ActionButton>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>

      {/* Slide progress */}
      {works.length > 1 && (
        <div
          className="mt-4"
          style={{ paddingLeft: 'var(--gutter)', paddingRight: 'var(--gutter)' }}
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
