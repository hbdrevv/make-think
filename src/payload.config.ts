// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { s3Storage } from '@payloadcms/storage-s3' // ✅ S3/R2 storage

import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import Work from './collections/Work'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: { baseDir: path.resolve(dirname) },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },

  // Global editor defaults
  editor: defaultLexical,

  // Database (Mongo Atlas)
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),

  // Collections / Globals
  collections: [Pages, Work, Posts, Media, Categories, Users],
  globals: [Header, Footer],

  cors: [getServerSideURL()].filter(Boolean),

  plugins: [
    ...plugins,

    // ✅ Cloudflare R2 via S3-compatible storage
    s3Storage({
      collections: {
        // apply storage to your `media` collection
        media: true,
      },
      bucket: process.env.S3_BUCKET || '',
      // These go straight to AWS SDK v3's S3Client
      config: {
        endpoint: process.env.S3_ENDPOINT || '', // e.g. https://<ACCOUNT_ID>.r2.cloudflarestorage.com
        region: process.env.S3_REGION || 'auto', // R2 uses 'auto'
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || process.env.S3_SECRET || '',
        },
        // Path-style is fine for R2; harmless if ignored
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
      },
      // If you later want strictly public URLs without signing, you can also
      // set `signedUrls: false` in this plugin’s options (optional).
    }),
  ],

  secret: process.env.PAYLOAD_SECRET,

  sharp,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }) => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
