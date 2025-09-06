import { getPublicMediaURL } from './getPublicMediaURL'

type MinimalMedia =
  | {
      url?: string | null
      filename?: string | null
      updatedAt?: string | Date | null
    }
  | string
  | null
  | undefined

type Options = {
  width?: number
  quality?: number
  cacheBust?: boolean
}

export function getPublicMediaURLFromResource(
  resource: MinimalMedia,
  opts: Options = {},
): string | undefined {
  const base = getPublicMediaURL(resource)
  if (!base) return undefined

  const qp = new URLSearchParams()

  if (opts.width) qp.set('w', String(opts.width))
  if (opts.quality) qp.set('q', String(opts.quality))

  if (opts.cacheBust) {
    const ts =
      typeof resource === 'object' && resource && 'updatedAt' in resource && resource.updatedAt
        ? new Date(resource.updatedAt as any).getTime()
        : Date.now()
    qp.set('v', String(ts))
  }

  const qs = qp.toString()
  return qs ? `${base}?${qs}` : base
}
