import 'server-only'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { RenderBlocks } from '../../../../blocks/RenderBlocks'

export const revalidate = 60

export default async function WorkDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'work',
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
    depth: 2,
    limit: 1,
  })

  const doc = docs?.[0]
  if (!doc) return null

  // Normalize possible block field names (common patterns in Payload projects)
  const blocks = (doc as any).blocks ?? (doc as any).content ?? (doc as any).layout ?? []

  return (
    <article className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-semibold mb-4">{(doc as any).title ?? 'Work'}</h1>
      {Array.isArray(blocks) && blocks.length > 0 ? <RenderBlocks blocks={blocks} /> : null}
    </article>
  )
}
