// next.config.js (ESM)

import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

// Prefer Vercel URL, else fall back to explicit/public/local
const NEXT_PUBLIC_SERVER_URL =
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.NEXT_PUBLIC_SERVER_URL) ||
  process.env.__NEXT_PRIVATE_ORIGIN ||
  'http://localhost:3000'

// If using Cloudflare R2, allow that host for <Image>
const R2_HOST = process.env.S3_ENDPOINT ? new URL(process.env.S3_ENDPOINT).hostname : undefined

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // your site host
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)
        return { protocol: url.protocol.replace(':', ''), hostname: url.hostname }
      }),
      // R2 host (if configured)
      ...(R2_HOST ? [{ protocol: 'https', hostname: R2_HOST }] : []),
    ],
  },
  reactStrictMode: true,
  redirects,

  // ⬇️ Ignore optional native Mongo deps so Next doesn’t try to bundle them
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

    config.externals = config.externals || []
    for (const mod of ignore) if (!config.externals.includes(mod)) config.externals.push(mod)

    return config
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
