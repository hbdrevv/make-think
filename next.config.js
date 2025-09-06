// next.config.js
import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

// 👇 Pull the R2 host from your endpoint env var
const R2_HOST = process.env.S3_ENDPOINT
  ? new URL(process.env.S3_ENDPOINT).hostname // e.g. b4c01891a10109d825734c9958019bf6.r2.cloudflarestorage.com
  : undefined

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // your site host
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)
        return { protocol: url.protocol.replace(':', ''), hostname: url.hostname }
      }),
      // ✅ allow R2 image host (needed for Next/Image)
      ...(R2_HOST ? [{ protocol: 'https', hostname: R2_HOST }] : []),
    ],
  },
  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
