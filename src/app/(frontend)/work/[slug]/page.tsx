import 'server-only'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import { RenderBlocks } from '../../../../blocks/RenderBlocks'
import { HighImpactHero } from '@/heros/HighImpact'

type Args = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Args) {
  const { slug } = await params

  const payload = await getPayload({ config: configPromise })
  const headers = await getHeaders()

  // Check if user is authenticated via payload-token cookie
  const { user } = await payload.auth({ headers })
  const isAuthenticated = !!user

  const res = await payload.find({
    collection: 'work',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    overrideAccess: isAuthenticated,
  })

  const doc = res.docs?.[0] as any

  // If not authenticated and doc is protected, treat as not found
  if (!doc || (!isAuthenticated && doc.visibility === 'protected')) {
    notFound()
  }

  return (
    <div className="bg-surface text-surface-foreground min-h-screen" data-surface="elevated">
      {doc.hero?.type === 'highImpact' && <HighImpactHero {...doc.hero} />}
      <article className="mx-auto max-w-6xl p-6">
        {doc.hero?.type !== 'highImpact' && (
          <h1 className="text-3xl font-semibold mb-4">{doc.title ?? 'Work'}</h1>
        )}
        {Array.isArray(doc.layout) ? <RenderBlocks blocks={doc.layout} /> : null}
      </article>
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  return { title: docTitle(slug) }
}

function docTitle(slug: string) {
  return `Work — ${slug}`
}
