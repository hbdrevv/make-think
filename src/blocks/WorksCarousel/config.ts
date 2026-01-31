import type { Block } from 'payload'

import { surfaceField } from '@/fields/surface'

export const WorksCarousel: Block = {
  slug: 'worksCarousel',
  interfaceName: 'WorksCarouselBlock',
  labels: {
    singular: 'Works Carousel',
    plural: 'Works Carousels',
  },
  fields: [
    surfaceField,
    {
      name: 'title',
      type: 'text',
      required: false,
    },
    {
      name: 'height',
      type: 'select',
      required: true,
      defaultValue: 'md',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
    },
    {
      name: 'works',
      type: 'relationship',
      relationTo: 'work',
      hasMany: true,
      minRows: 3,
      maxRows: 10,
      required: true,
      admin: {
        description: 'Select 3-10 works to display in the carousel',
      },
    },
  ],
}
