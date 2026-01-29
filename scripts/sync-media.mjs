#!/usr/bin/env node

/**
 * sync-media.mjs
 *
 * Downloads all objects from the production Cloudflare R2 bucket
 * into /public/media/ so local dev can serve them without S3.
 *
 * Usage:
 *   pnpm sync:media            # uses .env credentials
 *   node scripts/sync-media.mjs --force   # re-download existing files
 *
 * Required env vars (in .env):
 *   S3_BUCKET, S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY
 *
 * Optional:
 *   S3_REGION  (defaults to 'auto' for R2)
 */

import { existsSync, mkdirSync, createWriteStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { Readable } from 'node:stream'
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3'

// ── Config ──────────────────────────────────────────────────────────
const BUCKET = process.env.S3_BUCKET
const ENDPOINT = process.env.S3_ENDPOINT
const ACCESS_KEY = process.env.S3_ACCESS_KEY_ID
const SECRET_KEY = process.env.S3_SECRET_ACCESS_KEY || process.env.S3_SECRET
const REGION = process.env.S3_REGION || 'auto'
const FORCE = process.argv.includes('--force')

const MEDIA_DIR = join(process.cwd(), 'public', 'media')

// ── Validation ──────────────────────────────────────────────────────
const missing = []
if (!BUCKET) missing.push('S3_BUCKET')
if (!ENDPOINT) missing.push('S3_ENDPOINT')
if (!ACCESS_KEY) missing.push('S3_ACCESS_KEY_ID')
if (!SECRET_KEY) missing.push('S3_SECRET_ACCESS_KEY')

if (missing.length) {
  console.error(`\n❌  Missing required environment variables:\n   ${missing.join(', ')}\n`)
  console.error('   Add them to your .env file and try again.\n')
  process.exit(1)
}

// ── S3 Client ───────────────────────────────────────────────────────
const s3 = new S3Client({
  endpoint: ENDPOINT,
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
})

// ── Helpers ─────────────────────────────────────────────────────────
async function listAllObjects() {
  const objects = []
  let continuationToken

  do {
    const cmd = new ListObjectsV2Command({
      Bucket: BUCKET,
      ContinuationToken: continuationToken,
    })
    const res = await s3.send(cmd)
    if (res.Contents) objects.push(...res.Contents)
    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined
  } while (continuationToken)

  return objects
}

async function downloadObject(key, dest) {
  const dir = dirname(dest)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key })
  const res = await s3.send(cmd)

  const body = res.Body
  if (!body) throw new Error(`Empty body for ${key}`)

  const readable = body instanceof Readable ? body : Readable.fromWeb(body)
  await pipeline(readable, createWriteStream(dest))
}

async function fileExists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🔄  Syncing media from R2 → public/media/`)
  console.log(`    Bucket:   ${BUCKET}`)
  console.log(`    Endpoint: ${ENDPOINT}`)
  console.log(`    Force:    ${FORCE}\n`)

  // Ensure target directory exists
  mkdirSync(MEDIA_DIR, { recursive: true })

  // List all objects
  const objects = await listAllObjects()
  console.log(`   Found ${objects.length} objects in bucket\n`)

  if (objects.length === 0) {
    console.log('   Nothing to download.\n')
    return
  }

  let downloaded = 0
  let skipped = 0
  let failed = 0

  for (const obj of objects) {
    const key = obj.Key
    if (!key) continue

    // Skip directory markers
    if (key.endsWith('/')) continue

    const dest = join(MEDIA_DIR, key)
    const exists = await fileExists(dest)

    if (exists && !FORCE) {
      skipped++
      continue
    }

    try {
      process.stdout.write(`   ↓ ${key}...`)
      await downloadObject(key, dest)
      const size = obj.Size ? `(${(obj.Size / 1024).toFixed(1)} KB)` : ''
      console.log(` ✓ ${size}`)
      downloaded++
    } catch (err) {
      console.log(` ✗ ${err.message}`)
      failed++
    }
  }

  console.log(`\n✅  Done!  ${downloaded} downloaded, ${skipped} skipped, ${failed} failed\n`)
}

main().catch((err) => {
  console.error('\n❌  Sync failed:', err.message)
  process.exit(1)
})
