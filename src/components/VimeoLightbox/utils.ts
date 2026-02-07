/**
 * Extract Vimeo video ID from various Vimeo URL formats
 * Supports:
 * - https://vimeo.com/123456789
 * - https://www.vimeo.com/123456789
 * - https://player.vimeo.com/video/123456789
 */
export function extractVimeoId(url: string): string | null {
  if (!url) return null

  const patterns = [/vimeo\.com\/(\d+)/, /player\.vimeo\.com\/video\/(\d+)/]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}
