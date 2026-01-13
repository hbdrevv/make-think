import 'server-only'
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
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
    const headers = await getHeaders()

    // Check if user is authenticated
    const { user } = await payload.auth({ headers })
    const isAuthenticated = !!user

    let where: any = undefined

    if (collection === 'posts' && categories?.length) {
      where = {
        categories: {
          in: categories.map((c) => (typeof c === 'object' && c !== null ? (c as any).id : c)),
        },
      }
    } else if (collection === 'work' && !isAuthenticated) {
      // For work collection, filter out protected items for unauthenticated users
      where = {
        and: [
          { _status: { equals: 'published' } },
          {
            or: [
              { visibility: { equals: 'public' } },
              { visibility: { exists: false } },
            ],
          },
        ],
      }
    }

    const res = await payload.find({
      collection, // 'posts' or 'work'
      depth: 1,
      limit,
      ...(where ? { where } : {}),
      sort: '-publishedAt',
      overrideAccess: isAuthenticated,
    })

    docs = (res.docs as Doc[]) ?? []
  } else if (populateBy === 'selection' && selectedDocs?.length) {
    // For manual selection, filter out protected work items for unauthenticated users
    const payload = await getPayload({ config: configPromise })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })
    const isAuthenticated = !!user

    docs = selectedDocs
      .map((sel) => (typeof sel?.value === 'object' ? (sel.value as Doc) : undefined))
      .filter((doc): doc is Doc => {
        if (!doc) return false
        // If it's a work item and user is not authenticated, filter out protected items
        if (collection === 'work' && !isAuthenticated) {
          const workDoc = doc as Work
          if (workDoc.visibility === 'protected') return false
        }
        return true
      })
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
