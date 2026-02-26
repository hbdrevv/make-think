'use client'
import React from 'react'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

import type { ContentBlock } from '@/payload-types'

type ColumnData = NonNullable<ContentBlock['columns']>[number]

const sizeLabels: Record<string, string> = {
  oneThird: '1/3',
  half: '1/2',
  twoThirds: '2/3',
  full: 'Full',
}

export const RowLabel: React.FC<RowLabelProps> = () => {
  const row = useRowLabel<ColumnData>()

  const contentType = row?.data?.contentType || 'text'
  const size = row?.data?.size || 'oneThird'

  const typeLabels: Record<string, string> = {
    text: 'Text',
    media: 'Media',
    empty: 'Empty',
  }
  const typeLabel = typeLabels[contentType] || 'Text'
  const sizeLabel = sizeLabels[size] || size

  return <div>{typeLabel} ({sizeLabel})</div>
}
