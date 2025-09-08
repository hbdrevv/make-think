import clsx from 'clsx'
import React from 'react'
import { getPublicMediaURLFromResource } from '@/utilities/getPublicMediaURLFromResource'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Drevv Logo"
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[9.375rem] w-full aspect-[193/34] object-contain', className)}
      src={getPublicMediaURLFromResource({ filename: 'drevv_logo_rounded_2x.png' })}
    />
  )
}
