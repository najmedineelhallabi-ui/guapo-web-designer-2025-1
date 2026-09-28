import { NextRequest } from 'next/server'
import { verifyFileSig } from '@/lib/server/auth'
import { getStorage } from '@/lib/server/storage'

// Serves stored photos and videos. URLs are signed by the album API, which
// already applied the album's visibility rules. Supports Range requests so
// videos can play (Safari requires it).
export async function GET(request: NextRequest, ctx: RouteContext<'/api/files/[...path]'>) {
  const { path } = await ctx.params
  const pathname = path.join('/')
  const storage = getStorage()
  if (!storage || !pathname.startsWith('albums/') || !verifyFileSig(pathname, request.nextUrl.searchParams.get('sig'))) {
    return new Response('Not found', { status: 404 })
  }
  const file = await storage.read(pathname).catch(() => null)
  if (!file) return new Response('Not found', { status: 404 })

  const total = file.body.length
  const headers: Record<string, string> = {
    'Content-Type': file.contentType,
    'Cache-Control': 'private, max-age=31536000, immutable',
    'Accept-Ranges': 'bytes'
  }

  const range = request.headers.get('range')?.match(/^bytes=(\d*)-(\d*)$/)
  if (range && (range[1] || range[2])) {
    let start = range[1] ? Number(range[1]) : total - Number(range[2])
    let end = range[1] && range[2] ? Number(range[2]) : total - 1
    start = Math.max(0, start)
    end = Math.min(end, total - 1)
    if (start > end) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${total}` } })
    return new Response(new Uint8Array(file.body.subarray(start, end + 1)), {
      status: 206,
      headers: { ...headers, 'Content-Range': `bytes ${start}-${end}/${total}`, 'Content-Length': String(end - start + 1) }
    })
  }
  return new Response(new Uint8Array(file.body), { headers: { ...headers, 'Content-Length': String(total) } })
}
