'use client'

import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Mousewheel } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import { ArrowLeft, ArrowRight } from 'griddy-icons'
import type { MediaCarouselBlock as MediaCarouselBlockProps } from '@/payload-types'

import 'swiper/css'

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

export const MediaCarouselBlock: React.FC<Props> = (props) => {
  const { title, height = 'md', images, className } = props

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
        .media-carousel-container .swiper {
          padding-left: var(--gutter);
          padding-right: var(--gutter);
          overflow: visible;
        }
        .media-carousel-container .swiper-wrapper {
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
        {images.length > 1 && (
          <div className="flex gap-1">
            <button
              onClick={() => scrollToDirection('left')}
              disabled={!canScrollLeft}
              className={cn(
                'rounded p-1 flex items-center justify-center transition-all',
                canScrollLeft
                  ? 'border border-surface-foreground text-surface-foreground hover:bg-primitive-coral hover:border-surface-accent hover:text-surface-accent cursor-pointer'
                  : 'border border-surface-muted-accent text-surface-muted-accent cursor-not-allowed',
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
                  : 'border border-surface-muted-accent text-surface-muted-accent cursor-not-allowed',
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
        {images.map((item, index) => {
          const { image, aspectRatio = '16:9', caption } = item
          const ratio = aspectRatioValues[aspectRatio] || aspectRatioValues['16:9']

          return (
            <SwiperSlide
              key={index}
              style={{
                width: `calc(${containerHeight} * ${ratio})`,
                height: 'auto',
              }}
            >
              <div className="flex flex-col h-full">
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
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{caption}</p>
                )}
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>

      {/* Slide progress */}
      {images.length > 1 && (
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
