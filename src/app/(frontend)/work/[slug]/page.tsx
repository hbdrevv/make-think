import 'server-only'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { HighImpactHero } from '@/heros/HighImpact'

export const revalidate = 60

type Params = { params: { slug: string } }

export default async function Page({ params: { slug } }: Params) {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'work',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })

  const doc = docs?.[0]
  if (!doc) notFound()

  const blocks = (doc as any)?.layout ?? (doc as any)?.blocks ?? []

  return (
    <div className="pt-24 pb-24">
      {(doc as any)?.hero?.type === 'highImpact' && <HighImpactHero {...(doc as any).hero} />}
      <div className="container">
        {!(doc as any)?.hero?.type === 'highImpact' && (
          <h1 className="mb-6 text-4xl font-semibold">{(doc as any).title}</h1>
        )}
        <RenderBlocks blocks={blocks} />
      </div>
    </div>
  )
}
