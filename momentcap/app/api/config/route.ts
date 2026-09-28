import { getStorage } from '@/lib/server/storage'

export const dynamic = 'force-dynamic'

export function GET() {
  return Response.json({ backend: getStorage() ? 'server' : 'demo' })
}
