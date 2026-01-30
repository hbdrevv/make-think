import {
  ActionButton,
  type ActionButtonIntent,
  type ActionButtonProps,
} from '@/components/ui/action-button'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post } from '@/payload-types'

type ActionAppearance = 'default' | 'action' | 'action-ghost' | 'action-nav'

const actionVariantMap: Record<ActionAppearance, ActionButtonProps['variant']> = {
  default: 'default',
  action: 'default',
  'action-ghost': 'ghost',
  'action-nav': 'navigation',
}

type CMSLinkType = {
  appearance?: 'inline' | ActionAppearance | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  intent?: ActionButtonIntent | null
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts' | 'work'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    intent,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  /* Action button variants */
  if (appearance && appearance in actionVariantMap) {
    const actionVariant = actionVariantMap[appearance as ActionAppearance]
    const resolvedIntent: ActionButtonIntent = intent ?? (newTab ? 'external' : 'internal')

    return (
      <ActionButton
        asChild
        className={className}
        intent={resolvedIntent}
        variant={actionVariant}
      >
        <Link href={href || url || ''} {...newTabProps}>
          {label && label}
          {children && children}
        </Link>
      </ActionButton>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance as ButtonProps['variant']}>
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
