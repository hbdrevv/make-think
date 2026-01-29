// src/utilities/getPublicMediaURL.ts
type MinimalMedia =
  | string
  | {
      url?: string | null
      filename?: string | null
    }
  | null
  | undefined

const PUBLIC_BASE =
  (process.env.NEXT_PUBLIC_S3_PUBLIC_URL || '').replace(/\/$/, '') || // e.g. https://pub-xxxx.r2.dev
  ''

/**
 * Resolve a media input to a public URL.
 *
 * - When NEXT_PUBLIC_S3_PUBLIC_URL is set → CDN URL  (production)
 * - Otherwise → local /media/<filename> path          (local dev)
 */
export function getPublicMediaURL(input: MinimalMedia): string | undefined {
  if (!input) return undefined

  // Allow passing a string (filename or full URL)
  if (typeof input === 'string') {
    if (/^https?:\/\//i.test(input)) return input
    const name = input.replace(/^\/?(media\/)?/, '')
    if (!name) return undefined
    if (PUBLIC_BASE) return `${PUBLIC_BASE}/${name}`
    return `/media/${name}`
  }

  // Object form from Payload
  const raw = input.filename || input.url
  if (!raw) return undefined
  if (/^https?:\/\//i.test(raw)) return raw
  const name = String(raw).replace(/^\/?(media\/)?/, '')
  if (!name) return undefined
  if (PUBLIC_BASE) return `${PUBLIC_BASE}/${name}`
  return `/media/${name}`
}
