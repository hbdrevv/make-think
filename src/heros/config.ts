import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Homepage Hero',
          value: 'homepageHero',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) =>
          ['highImpact', 'mediumImpact', 'homepageHero'].includes(type),
        description: 'Optional background media. If not set, the gradient background will be used.',
      },
      relationTo: 'media',
      // required: true,
    },
    {
      name: 'featuredContentType',
      type: 'radio',
      label: 'Featured Content Type',
      options: [
        { label: 'Work', value: 'work' },
        { label: 'External Media', value: 'externalMedia' },
      ],
      defaultValue: 'work',
      admin: {
        condition: (_, { type } = {}) => type === 'homepageHero',
        layout: 'horizontal',
      },
    },
    {
      name: 'featuredWork',
      type: 'relationship',
      relationTo: 'work',
      label: 'Featured Work',
      admin: {
        condition: (_, { type, featuredContentType } = {}) =>
          type === 'homepageHero' && featuredContentType === 'work',
        description: 'Select a work to feature. Clicking will navigate to the work page.',
      },
    },
    {
      name: 'externalMedia',
      type: 'group',
      label: 'External Media',
      admin: {
        condition: (_, { type, featuredContentType } = {}) =>
          type === 'homepageHero' && featuredContentType === 'externalMedia',
      },
      fields: [
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Thumbnail Image',
          admin: {
            description: 'Image displayed in the hero. Clicking opens the Vimeo video.',
          },
        },
        {
          name: 'vimeoUrl',
          type: 'text',
          required: true,
          label: 'Vimeo URL',
          admin: {
            description: 'Full Vimeo URL (e.g., https://vimeo.com/123456789)',
          },
        },
      ],
    },
  ],
  label: false,
}
