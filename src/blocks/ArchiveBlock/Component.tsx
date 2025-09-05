import 'server-only'
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import RichText from '@/components/RichText'
import { CollectionArchive } from '@/components/CollectionArchive'
import type { Post, Work } from '@/payload-types'

// Minimal props to ship now; you can swap to the generated block type later.
type ArchiveBlockProps = {
  relationTo?: 'posts' | 'work'
  collection?: 'posts' | 'work'
  limit?: number
  populateBy?: 'collection' | 'selection'
  selectedDocs?: Array<{ relationTo: 'posts' | 'work'; value: string | Post | Work }>
  categories?: Array<string | { id: string }>
  introContent?: any
  [key: string]: unknown
}

type Doc = Post | Work

export default async function ArchiveBlock(props: ArchiveBlockProps & { id?: string }) {
  const {
    id,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    collection: collectionProp,
    relationTo,
  } = props

  const collection = (collectionProp ?? relationTo ?? 'posts') as 'posts' | 'work'
  const limit = limitFromProps ?? 3
  let docs: Doc[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const where =
      collection === 'posts' && categories?.length
        ? {
            categories: {
              in: categories.map((c) => (typeof c === 'object' && c !== null ? (c as any).id : c)),
            },
          }
        : undefined

    const res = await payload.find({
      collection, // 'posts' or 'work'
      depth: 1,
      limit,
      ...(where ? { where } : {}),
      sort: '-updatedAt', // change to '-publishedAt' if both collections have it
      overrideAccess: false,
    })

    docs = (res.docs as Doc[]) ?? []
  } else if (populateBy === 'selection' && selectedDocs?.length) {
    docs = selectedDocs
      .map((sel) => (typeof sel?.value === 'object' ? (sel.value as Doc) : undefined))
      .filter(Boolean) as Doc[]
  }

  return (
    <div className="my-16" id={id ? `block-${id}` : undefined}>
      {introContent ? (
        <div className="container mb-16">
          <RichText
            className="ms-0 max-w-[48rem]"
            data={introContent as any}
            enableGutter={false}
          />
        </div>
      ) : null}
      <CollectionArchive collection={collection} docs={docs} />
    </div>
  )
}
