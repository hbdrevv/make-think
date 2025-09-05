import type { Block } from 'payload'

export const Archive: Block = {
  slug: 'archive',
  labels: { singular: 'Archive', plural: 'Archives' },
  fields: [
    // NEW: which collection to populate from
    {
      name: 'collection',
      type: 'select',
      defaultValue: 'posts',
      required: true,
      options: [
        { label: 'Posts', value: 'posts' },
        { label: 'Work', value: 'work' },
      ],
    },

    // keep your existing fields
    {
      name: 'populateBy',
      type: 'radio',
      defaultValue: 'collection',
      options: [
        { label: 'From a collection', value: 'collection' },
        { label: 'Choose specific items', value: 'selection' },
      ],
      admin: { layout: 'horizontal' },
      required: true,
    },

    // If you had category filters, those apply only to posts. Either hide when collection === 'work'
    // or just leave them and they’ll be ignored for work. (Optional nicety.)

    // Allow picking items from either collection when populateBy = 'selection'
    {
      name: 'selectedDocs',
      type: 'relationship',
      relationTo: ['posts', 'work'],
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'selection',
      },
    },

    { name: 'limit', type: 'number', defaultValue: 3, min: 1, max: 50 },

    { name: 'introContent', type: 'richText' },
  ],
}
