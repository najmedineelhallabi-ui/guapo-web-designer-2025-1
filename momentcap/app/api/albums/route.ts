import { NextRequest } from 'next/server'
import { readToken } from '@/lib/server/auth'
import { createAlbum, listOwnerAlbums } from '@/lib/server/db'
import { fail, handle, json } from '@/lib/server/http'

export const GET = handle(async (request: NextRequest) => {
  const token = readToken(request)
  if (!token) return fail('Please log in', 401)
  return json({ albums: await listOwnerAlbums(token.uid) })
})

export const POST = handle(async (request: NextRequest) => {
  const token = readToken(request)
  if (!token) return fail('Please log in to create an album', 401)

  const { name, event_date, location } = await request.json().catch(() => ({}))
  if (typeof name !== 'string' || !name.trim()) return fail('Please give your album a name', 400)
  if (typeof event_date !== 'string' || Number.isNaN(Date.parse(event_date))) return fail('Please pick the event date', 400)

  const album = await createAlbum(token.uid, { name, event_date, location: typeof location === 'string' ? location : '' })
  const origin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
  return json({ album, qrUrl: `${origin}/album/${album.qr_code}` })
})
