import 'server-only'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { RenderBlocks } from '../../../../blocks/RenderBlocks'
import { HighImpactHero } from '@/heros/HighImpact'

type Args = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Args) {
  const { slug } = await params

  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'work',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    overrideAccess: false,
  })

  const doc = res.docs?.[0] as any
  if (!doc) notFound()

  return (
    <>
      {doc.hero?.type === 'highImpact' && <HighImpactHero {...doc.hero} />}
      <article className="mx-auto max-w-6xl p-6">
        {doc.hero?.type !== 'highImpact' && (
          <h1 className="text-3xl font-semibold mb-4">{doc.title ?? 'Work'}</h1>
        )}
        {Array.isArray(doc.layout) ? <RenderBlocks blocks={doc.layout} /> : null}
      </article>
    </>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  return { title: docTitle(slug) }
}

function docTitle(slug: string) {
  return `Work — ${slug}`
}
