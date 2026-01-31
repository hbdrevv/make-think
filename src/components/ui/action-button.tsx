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
  default: 'border border-surface-foreground rounded-full px-3 py-2 text-label-button transition-colors group-hover:border-surface-accent group-hover:bg-primitive-coral dark:group-hover:bg-primitive-black',
  ghost: 'px-1 py-2 text-label-button transition-colors',
  navigation: 'px-1 py-0.5 text-label-heavy',
} as const

const iconContainerStyles = {
  default: 'border border-surface-foreground rounded flex items-center justify-center p-1 transition-colors group-hover:border-surface-accent group-hover:bg-primitive-coral dark:group-hover:bg-primitive-black',
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

  const IconComponent =
    intent && resolvedVariant !== 'navigation' ? intentIcons[intent] : null

  const activeLabelClasses = active ? 'border-surface-accent bg-primitive-coral dark:bg-primitive-black' : ''
  const activeIconClasses = active ? 'border-surface-accent bg-primitive-coral dark:bg-primitive-black' : ''

  const compoundChildren = (labelText: React.ReactNode) => (
    <>
      <span data-action-label className={cn(labelStyles[resolvedVariant], activeLabelClasses)}>
        {labelText}
      </span>
      {IconComponent && (
        <span data-action-icon className={cn(iconContainerStyles[resolvedVariant], activeIconClasses)}>
          <IconComponent size="18px" />
        </span>
      )}
    </>
  )

  const wrapperClassName = cn(
    actionButtonVariants({ variant, className }),
    active && 'text-surface-accent',
  )

  if (asChild && React.isValidElement(children)) {
    const linkChild = children as React.ReactElement<{ children?: React.ReactNode }>
    const labelText = linkChild.props.children

    return (
      <Slot className={wrapperClassName} ref={ref} {...props}>
        {React.cloneElement(linkChild, {}, compoundChildren(labelText))}
      </Slot>
    )
  }

  return (
    <button
      className={wrapperClassName}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {compoundChildren(children)}
    </button>
  )
}

export { ActionButton, actionButtonVariants }
