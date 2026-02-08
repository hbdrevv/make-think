import type { Block } from 'payload'

import { link } from '@/fields/link'

export const RestrictedContent: Block = {
  slug: 'restrictedContent',
  interfaceName: 'RestrictedContentBlock',
  labels: {
    singular: 'Restricted Content',
    plural: 'Restricted Content Blocks',
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      defaultValue: 'This content is restricted',
      admin: {
        description: 'The main headline displayed over the blurred background',
      },
    },
    {
      name: 'blurredText',
      type: 'textarea',
      defaultValue:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      admin: {
        description: 'Text displayed blurred in the background. This creates the visual effect.',
      },
    },
    {
      name: 'enableLink',
      type: 'checkbox',
      label: 'Show action button',
      defaultValue: true,
    },
    link({
      appearances: ['default', 'outline'],
      overrides: {
        admin: {
          condition: (_data, siblingData) => Boolean(siblingData?.enableLink),
        },
      },
    }),
  ],
}
