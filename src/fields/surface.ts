import type { Field } from 'payload'

export const surfaceOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Alt', value: 'alt' },
  { label: 'Overlay', value: 'overlay' },
  { label: 'Elevated', value: 'elevated' },
  { label: 'Emphasis', value: 'emphasis' },
  { label: 'Muted', value: 'muted' },
  { label: 'Contrast', value: 'contrast' },
]

export const surfaceField: Field = {
  name: 'surface',
  type: 'select',
  defaultValue: 'default',
  options: surfaceOptions,
  admin: {
    description: 'Set the background and foreground color scheme for this block.',
  },
}
