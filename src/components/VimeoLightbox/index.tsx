'use client'

import * as Dialog from '@radix-ui/react-dialog'
import React from 'react'
import { X } from 'lucide-react'

import { cn } from '@/utilities/ui'
import { extractVimeoId } from './utils'

interface VimeoLightboxProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vimeoUrl: string
}

export const VimeoLightbox: React.FC<VimeoLightboxProps> = ({ open, onOpenChange, vimeoUrl }) => {
  const vimeoId = extractVimeoId(vimeoUrl)

  if (!vimeoId) return null

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/80',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
        />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-5xl -translate-x-1/2 -translate-y-1/2',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'focus:outline-none',
          )}
        >
          <Dialog.Close
            className={cn(
              'absolute -top-12 right-0 rounded-full p-2',
              'text-white hover:text-white/80 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black',
            )}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Vimeo video player"
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
