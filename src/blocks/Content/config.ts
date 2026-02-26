import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { surfaceField } from '@/fields/surface'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    label: 'Width',
    defaultValue: 'oneThird',
    options: [
      {
        label: 'One Third',
        value: 'oneThird',
      },
      {
        label: 'Half',
        value: 'half',
      },
      {
        label: 'Two Thirds',
        value: 'twoThirds',
      },
      {
        label: 'Full',
        value: 'full',
      },
    ],
  },
  {
    name: 'contentType',
    type: 'select',
    label: 'Content',
    defaultValue: 'text',
    options: [
      { label: 'Text', value: 'text' },
      { label: 'Media', value: 'media' },
      { label: 'Empty', value: 'empty' },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ]
      },
    }),
    label: false,
    admin: {
      condition: (_data, siblingData) => siblingData?.contentType === 'text',
    },
  },
  {
    name: 'media',
    type: 'group',
    admin: {
      condition: (_data, siblingData) => siblingData?.contentType === 'media',
    },
    fields: [
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        required: true,
      },
      {
        name: 'contain',
        type: 'checkbox',
        label: 'Contain',
        defaultValue: false,
        admin: {
          description: 'Show full image without cropping',
        },
      },
      {
        name: 'height',
        type: 'select',
        label: 'Height',
        defaultValue: 'md',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
        admin: {
          condition: (_data, siblingData) => Boolean(siblingData?.contain),
        },
      },
      {
        name: 'caption',
        type: 'text',
        label: 'Caption',
        admin: {
          description: 'Optional caption displayed below image',
        },
      },
      {
        name: 'decorative',
        type: 'checkbox',
        label: 'Decorative Image',
        defaultValue: false,
        admin: {
          description: 'Check if image is decorative (will use empty alt text)',
        },
      },
    ],
  },
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_data, siblingData) => {
          return Boolean(siblingData?.enableLink)
        },
      },
    },
  }),
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    surfaceField,
    {
      name: 'columns',
      type: 'array',
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/Content/RowLabel#RowLabel',
        },
      },
      fields: columnFields,
    },
  ],
}
