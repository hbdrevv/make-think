import 'server-only'
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { WorksCarouselBlock as WorksCarouselBlockProps, Work } from '@/payload-types'
import { WorksCarouselClient } from './Component.client'

type Props = WorksCarouselBlockProps & {
  className?: string
}

export const WorksCarouselBlock: React.FC<Props> = async (props) => {
  const { title, height = 'md', works: workRefs, className } = props

  if (!workRefs || workRefs.length === 0) return null

  // Extract work IDs from the relationship
  const workIds = workRefs
    .map((ref) => (typeof ref === 'object' ? ref.id : ref))
    .filter(Boolean) as string[]

  if (workIds.length === 0) return null

  // Fetch works with proper depth to get hero.media populated
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'work',
    where: {
      id: { in: workIds },
    },
    depth: 2,
    limit: workIds.length,
  })

  // Maintain original order
  const worksMap = new Map(result.docs.map((doc) => [doc.id, doc]))
  const orderedWorks = workIds
    .map((id) => worksMap.get(id))
    .filter((work): work is Work => !!work)

  return (
    <WorksCarouselClient
      title={title}
      height={height}
      works={orderedWorks}
      className={className}
    />
  )
}
