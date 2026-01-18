import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublicWork } from '../../access/authenticatedOrPublicWork'

import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { MediaCarousel } from '../../blocks/MediaCarousel/config'
import { WorksCarousel } from '../../blocks/WorksCarousel/config'

import { hero } from '@/heros/config'
import { slugField } from '@/fields/slug'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

const Work: CollectionConfig<'work'> = {
  slug: 'work',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublicWork,
    update: authenticated,
  },
  defaultPopulate: { title: true, slug: true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'visibility', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const slug = typeof data?.slug === 'string' ? data.slug : ''
        const base =
          (req as any)?.payload?.config?.serverURL || process.env.NEXT_PUBLIC_SERVER_URL || ''
        return `${base}/work/${slug}`
      },
    },
    preview: (data, { req }) => {
      const slug = typeof data?.slug === 'string' ? data.slug : ''
      const base =
        (req as any)?.payload?.config?.serverURL || process.env.NEXT_PUBLIC_SERVER_URL || ''
      return `${base}/work/${slug}`
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        { label: 'Hero', fields: [hero] },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              required: true,
              admin: { initCollapsed: true },
              blocks: [CallToAction, Content, MediaBlock, MediaCarousel, WorksCarousel, Archive, FormBlock],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
{
      name: 'visibility',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Protected (Login Required)', value: 'protected' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Protected items require users to log in to view',
      },
    },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    ...slugField(),
  ],
  versions: {
    drafts: { autosave: { interval: 100 }, schedulePublish: true },
    maxPerDoc: 50,
  },
}

export default Work
