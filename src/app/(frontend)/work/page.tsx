// src/app/(frontend)/work/page.tsx
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export default async function WorkIndex() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'work',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt', // or '-updatedAt'
    depth: 1,
    limit: 24,
  })

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-semibold mb-8">Work</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {docs.map((d: any) => (
          <a key={d.id} href={`/work/${d.slug}`} className="block group">
            {d?.coverImage?.url && (
              <img
                src={d.coverImage.url}
                alt={d.coverImage.alt ?? d.title}
                className="w-full aspect-video object-cover"
              />
            )}
            <h3 className="mt-3 text-lg font-medium group-hover:underline">{d.title}</h3>
          </a>
        ))}
      </div>
    </main>
  )
}
