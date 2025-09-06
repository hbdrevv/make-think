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

export function getPublicMediaURL(input: MinimalMedia): string | undefined {
  if (!input) return undefined

  // Allow passing a string (filename or full URL)
  if (typeof input === 'string') {
    if (/^https?:\/\//i.test(input)) return input
    if (!PUBLIC_BASE) return undefined
    return `${PUBLIC_BASE}/${input.replace(/^\//, '')}`
  }

  // Object form from Payload
  const raw = input.filename || input.url
  if (!raw) return undefined
  if (/^https?:\/\//i.test(raw)) return raw
  if (!PUBLIC_BASE) return undefined
  return `${PUBLIC_BASE}/${String(raw).replace(/^\//, '')}`
}
