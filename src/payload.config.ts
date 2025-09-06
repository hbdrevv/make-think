// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { s3Storage } from '@payloadcms/storage-s3' // ✅ correct import

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

  // Database (Mongo)
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),

  // Collections / Globals
  collections: [Pages, Work, Posts, Media, Categories, Users],
  globals: [Header, Footer],

  cors: [getServerSideURL()].filter(Boolean),

  plugins: [
    ...plugins,

    // ✅ S3 / Cloudflare R2 storage for the `media` collection
    s3Storage({
      collections: {
        media: true, // apply to your `media` collection
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
        // For R2 you can keep this on; it won't hurt if the SDK ignores it
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
      },
      // Optional: if you want to ensure public URLs without signing:
      // signedUrls: false,
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
