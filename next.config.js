// next.config.js
import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined) ??
  process.env.__NEXT_PRIVATE_ORIGIN ??
  'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  reactStrictMode: true,
  redirects,

  // ⬇️ New name in Next 15.3 (moved out of experimental)
  serverExternalPackages: ['@payloadcms/db-mongodb', 'mongodb', 'mongoose'],

  webpack: (config, { isServer }) => {
    // Avoid bundling optional native deps into client
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      kerberos: false,
      'mongodb-client-encryption': false,
    }
    if (!isServer) {
      config.externals = [...(config.externals || []), 'kerberos', 'mongodb-client-encryption']
    }
    return config
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
