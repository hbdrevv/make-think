import { cn } from '@/utilities/ui'
import React from 'react'
import { Card, CardPostData } from '@/components/Card'

export type Props = {
  docs?: CardPostData[]
  posts?: CardPostData[] // backward-compat; you can remove later
  collection?: 'posts' | 'work' // ⬅️ narrowed type
}

export const CollectionArchive: React.FC<Props> = ({ docs, posts, collection }) => {
  const rows = (docs ?? posts ?? []) as CardPostData[]
  const rel: 'posts' | 'work' = collection ?? 'posts' // ⬅️ default + narrow

  return (
    <div className={cn('container')}>
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {rows.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className="col-span-4" key={index}>
                  <Card className="h-full" doc={result} relationTo={rel} showCategories />
                </div>
              )
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
}
