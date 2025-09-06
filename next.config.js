// next.config.js (ESM)

import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

// Prefer explicit/public/local
const SITE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// Optional: allow Cloudflare R2 host(s) for <Image>
const R2_HOST = process.env.S3_ENDPOINT ? new URL(process.env.S3_ENDPOINT).hostname : undefined
const PUB_HOST = process.env.NEXT_PUBLIC_S3_PUBLIC_URL
  ? new URL(process.env.NEXT_PUBLIC_S3_PUBLIC_URL).hostname
  : undefined

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // your site (allow both http for local and https for prod)
      ...(() => {
        try {
          const u = new URL(SITE)
          return [
            { protocol: 'http', hostname: u.hostname },
            { protocol: 'https', hostname: u.hostname },
          ]
        } catch {
          return []
        }
      })(),
      // R2 endpoint host (e.g. <ACCOUNT_ID>.r2.cloudflarestorage.com)
      ...(R2_HOST ? [{ protocol: 'https', hostname: R2_HOST }] : []),
      // public CDN/base if you set NEXT_PUBLIC_S3_PUBLIC_URL
      ...(PUB_HOST ? [{ protocol: 'https', hostname: PUB_HOST }] : []),
    ],
  },

  reactStrictMode: true,
  redirects,

  // Ignore optional native Mongo deps so Next doesn’t try to bundle them
  webpack: (config) => {
    const ignore = [
      'kerberos',
      'mongodb-client-encryption',
      '@mongodb-js/zstd',
      'snappy',
      'gcp-metadata',
    ]

    config.resolve ??= {}
    config.resolve.alias ??= {}
    for (const mod of ignore) config.resolve.alias[mod] = false

    const externals = Array.isArray(config.externals)
      ? config.externals
      : config.externals
        ? [config.externals]
        : []
    for (const mod of ignore) if (!externals.includes(mod)) externals.push(mod)
    config.externals = externals

    return config
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
