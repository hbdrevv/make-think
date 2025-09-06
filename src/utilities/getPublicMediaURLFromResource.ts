// src/utilities/getPublicMediaURLFromResource.ts

type AnySize = {
  url?: string | null
  width?: number
  height?: number
}

export type MinimalMediaResource = {
  url?: string | null
  filename?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  updatedAt?: string | Date | null
  sizes?: Record<string, AnySize> | null
}

/** join base + path with single slash */
function joinUrl(base: string, path: string) {
  return `${base.replace(/\/$/, '')}/${String(path).replace(/^\//, '')}`
}

function isAbsolute(u?: string | null): boolean {
  return !!u && /^(https?:)?\/+\//i.test(u)
}

function pickEnvPublicBase(): string | undefined {
  // In browser builds, NEXT_PUBLIC_* is inlined; on server both may exist
  return process.env.NEXT_PUBLIC_S3_PUBLIC_URL || process.env.S3_PUBLIC_URL || undefined
}

/**
 * Return a public URL for a Payload Media resource, preferring a size when present.
 * Order: sizes[size].url → resource.url → publicBase/filename
 * If relative, prefix with NEXT_PUBLIC_S3_PUBLIC_URL (or S3_PUBLIC_URL on server).
 * Adds cache-busting ?v=timestamp by default.
 */
export function getPublicMediaURLFromResource(
  resource: MinimalMediaResource | null | undefined,
  opts?: { size?: string; cacheBust?: boolean },
): string | undefined {
  if (!resource) return undefined

  const { sizes, url, filename, updatedAt } = resource
  const sizeKey = opts?.size
  const bust = opts?.cacheBust !== false // default true

  let candidate: string | null | undefined

  if (sizeKey && sizes && sizes[sizeKey]?.url) {
    candidate = sizes[sizeKey]!.url
  }

  if (!candidate && url) {
    candidate = url
  }

  if (!candidate && filename) {
    const base = pickEnvPublicBase()
    if (base) candidate = joinUrl(base, filename)
  }

  if (!candidate) return undefined

  if (!isAbsolute(candidate)) {
    const base = pickEnvPublicBase()
    if (base) candidate = joinUrl(base, candidate)
  }

  if (bust && updatedAt) {
    const ts =
      typeof updatedAt === 'string'
        ? Date.parse(updatedAt) || undefined
        : updatedAt instanceof Date
          ? updatedAt.getTime()
          : undefined
    if (ts) candidate += candidate.includes('?') ? `&v=${ts}` : `?v=${ts}`
  }

  return candidate || undefined
}
