import type { Access, Where } from 'payload'

/**
 * Access control for Work collection:
 * - Authenticated users can see all work items (including protected and drafts)
 * - Unauthenticated users can only see published items with visibility: 'public'
 */
export const authenticatedOrPublicWork: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  const query: Where = {
    and: [
      { _status: { equals: 'published' } },
      {
        or: [
          { visibility: { equals: 'public' } },
          { visibility: { exists: false } },
        ],
      },
    ],
  }

  return query
}
