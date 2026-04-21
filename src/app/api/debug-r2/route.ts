// src/app/api/debug-r2/route.ts
// Temporary debug endpoint — remove before production

import { S3Client, HeadBucketCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

export async function GET() {
  const endpoint = process.env.S3_ENDPOINT
  const bucket = process.env.S3_BUCKET
  const accessKeyId = process.env.S3_ACCESS_KEY_ID ?? ''
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY ?? process.env.S3_SECRET ?? ''
  const region = process.env.S3_REGION ?? 'auto'
  const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === 'true'

  const envSnapshot = {
    endpoint,
    bucket,
    keyIdPrefix: accessKeyId ? accessKeyId.slice(0, 8) + '…' : '(missing)',
    hasSecret: !!secretAccessKey,
    region,
    forcePathStyle,
  }

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    return Response.json({ ok: false, error: 'One or more env vars are missing', env: envSnapshot }, { status: 500 })
  }

  const client = new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle,
  })

  // 1. Check bucket exists + credentials work
  let headResult: string
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }))
    headResult = 'ok'
  } catch (err: unknown) {
    const e = err as { name?: string; message?: string; $metadata?: { httpStatusCode?: number } }
    return Response.json({
      ok: false,
      step: 'HeadBucket',
      error: e.message,
      code: e.name,
      httpStatus: e.$metadata?.httpStatusCode,
      env: envSnapshot,
    }, { status: 500 })
  }

  // 2. List up to 5 objects to confirm read access
  let listedKeys: string[] = []
  try {
    const list = await client.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 5 }))
    listedKeys = (list.Contents ?? []).map((o) => o.Key ?? '')
  } catch (err: unknown) {
    const e = err as { name?: string; message?: string; $metadata?: { httpStatusCode?: number } }
    return Response.json({
      ok: false,
      step: 'ListObjectsV2',
      headBucket: headResult,
      error: e.message,
      code: e.name,
      httpStatus: e.$metadata?.httpStatusCode,
      env: envSnapshot,
    }, { status: 500 })
  }

  return Response.json({
    ok: true,
    headBucket: headResult,
    sampleKeys: listedKeys,
    env: envSnapshot,
  })
}
