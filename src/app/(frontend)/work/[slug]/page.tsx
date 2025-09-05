import 'server-only'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Blocks from '@/components/Blocks'

export const revalidate = 60

export default async function WorkDetail({ params }: { params: { slug: string } }) {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'work',
    where: { and: [{ slug: { equals: params.slug } }, { _status: { equals: 'published' } }] },
    depth: 2,
    limit: 1,
  })

  const doc = docs[0]
  if (!doc) return null

  return (
    <article className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-semibold mb-4">{doc.title}</h1>
      <Blocks blocks={doc.blocks ?? []} />
    </article>
  )
}
