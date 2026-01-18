import type { Block } from 'payload'

export const MediaCarousel: Block = {
  slug: 'mediaCarousel',
  interfaceName: 'MediaCarouselBlock',
  fields: [
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
      name: 'images',
      type: 'array',
      minRows: 3,
      maxRows: 10,
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'aspectRatio',
          type: 'select',
          required: true,
          defaultValue: '16:9',
          options: [
            { label: '3:4 (Portrait)', value: '3:4' },
            { label: '16:9 (Landscape)', value: '16:9' },
            { label: '9:16 (Vertical)', value: '9:16' },
          ],
        },
        {
          name: 'caption',
          type: 'text',
          required: false,
        },
      ],
    },
  ],
}
