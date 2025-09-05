import type { CardPostData } from '@/components/Card'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const revalidate = 600

type Args = {
  searchParams: Promise<{ page?: string }>
}

export default async function Page({ searchParams }: Args) {
  const { page } = await searchParams

  const pageNum = Number(page ?? '1')
  if (!Number.isInteger(pageNum) || pageNum < 1) notFound()

  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    page: pageNum,
    overrideAccess: false,
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive docs={posts.docs as CardPostData[]} collection="posts" />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ searchParams }: Args): Promise<Metadata> {
  const { page } = await searchParams
  return {
    title: `Posts${page ? ` — Page ${page}` : ''}`,
  }
}
