// next.config.js
import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

// next.config.js
const { redirects } = require('./redirects')

// Pull hosts from env (guard against undefined)
const hosts = []

if (process.env.NEXT_PUBLIC_SERVER_URL) {
  const u = new URL(process.env.NEXT_PUBLIC_SERVER_URL)
  hosts.push({ protocol: u.protocol.replace(':', ''), hostname: u.hostname })
}

if (process.env.S3_ENDPOINT) {
  const u = new URL(process.env.S3_ENDPOINT) // e.g. https://<ACCOUNT_ID>.r2.cloudflarestorage.com
  hosts.push({ protocol: u.protocol.replace(':', ''), hostname: u.hostname })
}

if (process.env.S3_PUBLIC_URL) {
  const u = new URL(process.env.S3_PUBLIC_URL) // e.g. https://pub-xxxxxxxx.r2.dev/make-think
  hosts.push({ protocol: u.protocol.replace(':', ''), hostname: u.hostname })
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: hosts,
  },
  reactStrictMode: true,
  redirects,
}

module.exports = nextConfig

export default withPayload(nextConfig, { devBundleServerPackages: false })
