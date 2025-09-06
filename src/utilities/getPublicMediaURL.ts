export type MinimalMedia =
  | { url?: string | null; filename?: string | null }
  | string
  | null
  | undefined

export function getPublicMediaURL(input: MinimalMedia): string | undefined {
  if (!input) return undefined

  if (typeof input === 'string') {
    if (/^https?:\/\//i.test(input)) return input
    const base = process.env.NEXT_PUBLIC_S3_PUBLIC_URL || process.env.S3_PUBLIC_URL
    return base ? `${trimSlash(base)}/${encodeURIComponent(input)}` : undefined
  }

  if (input.url && /^https?:\/\//i.test(input.url)) return input.url

  const base = process.env.NEXT_PUBLIC_S3_PUBLIC_URL || process.env.S3_PUBLIC_URL
  if (base && input.filename) {
    return `${trimSlash(base)}/${encodeURIComponent(input.filename)}`
  }

  return undefined
}

function trimSlash(s: string) {
  return s.replace(/\/$/, '')
}
