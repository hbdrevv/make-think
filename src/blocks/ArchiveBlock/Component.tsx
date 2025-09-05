import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import RichText from '@/components/RichText'
import { CollectionArchive } from '@/components/CollectionArchive'

// IMPORTANT: import the updated types after typegen
import type { ArchiveBlock as ArchiveBlockProps, Post, Work } from '@/payload-types'

type Doc = Post | Work

export const ArchiveBlock: React.FC<ArchiveBlockProps & { id?: string }> = async (props) => {
  const {
    id,
    categories, // may be posts-only; we’ll ignore for work
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    collection = 'posts', // NEW from schema
  } = props

  const limit = limitFromProps || 3
  let docs: Doc[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    // Build a where clause only for posts when categories are present
    const where =
      collection === 'posts' && categories?.length
        ? {
            categories: {
              in: categories.map((c: any) => (typeof c === 'object' ? c.id : c)),
            },
          }
        : undefined

    const res = await payload.find({
      collection, // ← 'posts' or 'work'
      depth: 1,
      limit,
      ...(where ? { where } : {}),
      sort: '-publishedAt', // both collections have this in your config; if not, swap to '-updatedAt'
    })

    docs = res.docs as Doc[]
  } else {
    // selection path
    if (selectedDocs?.length) {
      docs = selectedDocs
        .map((sel) => (typeof sel.value === 'object' ? sel.value : undefined))
        .filter(Boolean) as Doc[]
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      {/* Pass the chosen collection so the renderer can link correctly */}
      <CollectionArchive collection={collection} docs={docs} />
    </div>
  )
}
