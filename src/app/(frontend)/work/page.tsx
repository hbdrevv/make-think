import 'server-only'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function WorkIndexPage() {
  const payload = await getPayload({ config: configPromise })
  const headers = await getHeaders()

  // Check if user is authenticated via payload-token cookie
  const { user } = await payload.auth({ headers })
  const isAuthenticated = !!user

  const { docs } = await payload.find({
    collection: 'work',
    depth: 1,
    limit: 50,
    sort: '-createdAt',
    overrideAccess: isAuthenticated,
    where: isAuthenticated
      ? { _status: { equals: 'published' } }
      : {
          and: [
            { _status: { equals: 'published' } },
            {
              or: [
                { visibility: { equals: 'public' } },
                { visibility: { exists: false } },
              ],
            },
          ],
        },
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
