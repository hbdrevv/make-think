// src/app/(frontend)/work/[slug]/page.tsx
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'

export default async function WorkDetail({ params }: { params: { slug: string } }) {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'work',
    where: { and: [{ slug: { equals: params.slug } }, { _status: { equals: 'published' } }] },
    depth: 2,
    limit: 1,
  })
  const doc = docs?.[0]
  if (!doc) return notFound()
  const { hero, layout } = doc
  return (
    <main>
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </main>
  )
}
