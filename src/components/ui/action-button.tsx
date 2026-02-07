'use client'

import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/utilities/ui'
import { ArrowRight, ArrowUpRight, Download, Github, Linkedin } from 'griddy-icons'

const intentIcons = {
  internal: ArrowRight,
  external: ArrowUpRight,
  download: Download,
  linkedin: Linkedin,
  github: Github,
} as const

export type ActionButtonIntent = keyof typeof intentIcons

const actionButtonVariants = cva(
  'group inline-flex items-center text-surface-foreground transition-colors hover:text-surface-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        ghost: '',
        navigation: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const labelStyles = {
  default: 'relative overflow-hidden border border-surface-foreground rounded-full px-3 py-2 text-label-button transition-colors group-hover:border-surface-accent',
  ghost: 'px-1 py-2 text-label-button transition-colors',
  navigation: 'px-1 py-0.5 text-label-heavy',
} as const

const iconContainerStyles = {
  default: 'relative overflow-hidden border border-surface-foreground rounded flex items-center justify-center p-1 transition-colors group-hover:border-surface-accent',
  ghost: 'flex items-center justify-center',
  navigation: '',
} as const

export interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionButtonVariants> {
  active?: boolean
  asChild?: boolean
  intent?: ActionButtonIntent
  ref?: React.Ref<HTMLButtonElement>
}

const ActionButton: React.FC<ActionButtonProps> = ({
  active = false,
  asChild = false,
  children,
  className,
  disabled,
  intent,
  ref,
  variant = 'default',
  ...props
}) => {
  const resolvedVariant = variant ?? 'default'
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  const IconComponent =
    intent && resolvedVariant !== 'navigation' ? intentIcons[intent] : null

  const activeLabelClasses = active ? 'border-surface-accent' : ''
  const activeIconClasses = active ? 'border-surface-accent' : ''

  const updateFlairPositions = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current
    if (!button) return

    const buttonRect = button.getBoundingClientRect()
    const mouseX = e.clientX - buttonRect.left
    const mouseY = e.clientY - buttonRect.top

    const labelEl = button.querySelector('[data-action-label]') as HTMLElement
    const iconEl = button.querySelector('[data-action-icon]') as HTMLElement

    // Calculate position relative to each container, but using the same origin point
    if (labelEl) {
      const labelRect = labelEl.getBoundingClientRect()
      const offsetX = labelRect.left - buttonRect.left
      const offsetY = labelRect.top - buttonRect.top
      labelEl.style.setProperty('--mouse-x', `${mouseX - offsetX}px`)
      labelEl.style.setProperty('--mouse-y', `${mouseY - offsetY}px`)
    }

    if (iconEl) {
      const iconRect = iconEl.getBoundingClientRect()
      const offsetX = iconRect.left - buttonRect.left
      const offsetY = iconRect.top - buttonRect.top
      iconEl.style.setProperty('--mouse-x', `${mouseX - offsetX}px`)
      iconEl.style.setProperty('--mouse-y', `${mouseY - offsetY}px`)
    }
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    updateFlairPositions(e)
    const button = buttonRef.current
    if (!button) return

    const flairs = button.querySelectorAll('[data-flair]') as NodeListOf<HTMLElement>
    flairs.forEach((flair) => {
      flair.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      flair.style.transform = 'translate(-50%, -50%) scale(2.5)'
    })
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    updateFlairPositions(e)
    const button = buttonRef.current
    if (!button) return

    const flairs = button.querySelectorAll('[data-flair]') as NodeListOf<HTMLElement>
    flairs.forEach((flair) => {
      flair.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      flair.style.transform = 'translate(-50%, -50%) scale(0)'
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    updateFlairPositions(e)
  }

  // Size the flair large enough to cover the entire button from any entry point
  const flairElement = (
    <span
      data-flair
      className="pointer-events-none absolute rounded-full bg-primitive-coral dark:bg-primitive-black"
      style={{
        width: '400%',
        aspectRatio: '1',
        left: 'var(--mouse-x, 50%)',
        top: 'var(--mouse-y, 50%)',
        transform: `translate(-50%, -50%) scale(${active ? 2.5 : 0})`,
      }}
    />
  )

  const compoundChildren = (labelText: React.ReactNode) => (
    <>
      <span data-action-label className={cn(labelStyles[resolvedVariant], activeLabelClasses)}>
        {resolvedVariant === 'default' && flairElement}
        <span className="relative z-10">{labelText}</span>
      </span>
      {IconComponent && (
        <span data-action-icon className={cn(iconContainerStyles[resolvedVariant], activeIconClasses)}>
          {resolvedVariant === 'default' && flairElement}
          <span className="relative z-10">
            <IconComponent size="18px" />
          </span>
        </span>
      )}
    </>
  )

  const wrapperClassName = cn(
    actionButtonVariants({ variant, className }),
    active && 'text-surface-accent',
  )

  const combinedRef = (node: HTMLButtonElement | null) => {
    (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
    }
  }

  if (asChild && React.isValidElement(children)) {
    const linkChild = children as React.ReactElement<{ children?: React.ReactNode }>
    const labelText = linkChild.props.children

    return (
      <Slot
        className={wrapperClassName}
        ref={combinedRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        {...props}
      >
        {React.cloneElement(linkChild, {}, compoundChildren(labelText))}
      </Slot>
    )
  }

  return (
    <button
      className={wrapperClassName}
      disabled={disabled}
      ref={combinedRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {compoundChildren(children)}
    </button>
  )
}

export { ActionButton, actionButtonVariants }
