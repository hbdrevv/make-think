import { cn } from '@/utilities/ui'
import React from 'react'

import type { Page } from '@/payload-types'

import ArchiveBlock from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { MediaCarouselBlock } from '@/blocks/MediaCarousel/Component'
import { WorksCarouselBlock } from '@/blocks/WorksCarousel/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  mediaCarousel: MediaCarouselBlock,
  worksCarousel: WorksCarouselBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <div className="[&>*:last-child]:mb-0">
        {blocks.map((block, index) => {
          const { blockType } = block
          const surface = 'surface' in block ? (block.surface as string) : undefined
          const hasSurface = surface && surface !== 'default'
          const isLast = index === blocks.length - 1

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div
                  className={cn(
                    hasSurface ? 'py-16 bg-surface text-surface-foreground' : 'my-16',
                    isLast && 'pb-24',
                  )}
                  key={index}
                  {...(hasSurface ? { 'data-surface': surface } : {})}
                >
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </div>
    )
  }

  return null
}
