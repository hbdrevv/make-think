// next.config.js (ESM)
import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

// Keep your original logic for this, but also fall back to env var
const NEXT_PUBLIC_SERVER_URL =
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.__NEXT_PRIVATE_ORIGIN) ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  'http://localhost:3000'

// Build the allowed image hosts list
const remotePatterns = []

// Your own site host
if (NEXT_PUBLIC_SERVER_URL) {
  const u = new URL(NEXT_PUBLIC_SERVER_URL)
  remotePatterns.push({
    protocol: u.protocol.replace(':', ''),
    hostname: u.hostname,
  })
}

// Cloudflare R2 API endpoint host (e.g. <ACCOUNT_ID>.r2.cloudflarestorage.com)
if (process.env.S3_ENDPOINT) {
  const u = new URL(process.env.S3_ENDPOINT)
  remotePatterns.push({
    protocol: u.protocol.replace(':', ''),
    hostname: u.hostname,
  })
}

// Cloudflare R2 public URL host (e.g. pub-xxxxxx.r2.dev)
if (process.env.S3_PUBLIC_URL) {
  const u = new URL(process.env.S3_PUBLIC_URL)
  remotePatterns.push({
    protocol: u.protocol.replace(':', ''),
    hostname: u.hostname,
  })
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns,
  },
  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
