// src/utilities/getMediaUrl.ts
import { getPublicMediaURL } from './getPublicMediaURL'

/**
 * Back-compat wrapper:
 * - Accepts an optional 2nd arg (cacheTag) but ignores it.
 * - Always returns a string ('' if nothing resolvable).
 */
export function getMediaUrl(input?: string, _cacheTag?: string): string {
  if (!input) return ''
  // Try your helper that prefers R2/public URLs
  const out = getPublicMediaURL(input)
  // Fallback to the original input if helper didn't transform it
  return out ?? input
}
