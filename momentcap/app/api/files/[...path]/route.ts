import { NextRequest } from 'next/server'
import { verifyFileSig } from '@/lib/server/auth'
import { requireStorage } from '@/lib/server/db'
import { fail, handle } from '@/lib/server/http'

// Serves stored photos. URLs are signed by the album API, which already
// applied the album's visibility rules.
export const GET = handle(async (request: NextRequest, ctx: RouteContext<'/api/files/[...path]'>) => {
  const { path } = await ctx.params
  const pathname = path.join('/')
  if (!pathname.startsWith('albums/') || !verifyFileSig(pathname, request.nextUrl.searchParams.get('sig'))) {
    return fail('Not found', 404)
  }
  const file = await requireStorage().read(pathname)
  if (!file) return fail('Not found', 404)
  return new Response(new Uint8Array(file.body), {
    headers: {
      'Content-Type': file.contentType,
      'Cache-Control': 'private, max-age=31536000, immutable'
    }
  })
})
