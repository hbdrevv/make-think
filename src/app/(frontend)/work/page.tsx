import 'server-only'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'

export const revalidate = 60

export default async function WorkIndexPage() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'work',
    where: { _status: { equals: 'published' } },
    depth: 1,
    limit: 50,
    sort: '-createdAt',
  })

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-semibold mb-6">Work</h1>
      <ul className="space-y-3">
        {docs.map((w: any) => (
          <li key={w.id}>
            <Link href={`/work/${w.slug}`}>{w.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
