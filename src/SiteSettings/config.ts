import type { GlobalConfig } from 'payload'

import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Configuration',
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Layout & Grid',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'columnVerticalAlign',
          type: 'select',
          label: 'Column Vertical Alignment',
          defaultValue: 'top',
          options: [
            { label: 'Top', value: 'top' },
            { label: 'Center', value: 'center' },
            { label: 'Bottom', value: 'bottom' },
          ],
          admin: {
            description: 'How columns align vertically when heights differ',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
