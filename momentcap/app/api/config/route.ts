import { getStorage } from '@/lib/server/storage'

export const dynamic = 'force-dynamic'

export function GET() {
  return Response.json({
    backend: getStorage() ? 'server' : 'demo',
    // Browsers upload big files straight to Vercel Blob (serverless requests are limited to ~4.5 MB)
    directUpload: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    blobAccess: process.env.MOMENTCAP_BLOB_ACCESS === 'public' ? 'public' : 'private',
    demoPayments: !getStorage() || process.env.MOMENTCAP_DEMO_PAYMENTS === '1'
  })
}
