import { NextRequest } from 'next/server'
import { readToken } from '@/lib/server/auth'
import { createAlbum, listOwnerAlbums } from '@/lib/server/db'
import { fail, handle, json } from '@/lib/server/http'
import { albumFields, defaultSettings, sanitizeSettings } from '@/lib/albumRules'

export const GET = handle(async (request: NextRequest) => {
  const token = readToken(request)
  if (!token) return fail('Please log in', 401)
  return json({ albums: await listOwnerAlbums(token.uid) })
})

export const POST = handle(async (request: NextRequest) => {
  const token = readToken(request)
  if (!token) return fail('Please log in to create an album', 401)

  const body = await request.json().catch(() => ({}))
  const fields = albumFields(body)
  if (!fields.name) return fail('Please give your album a name', 400)
  if (!fields.event_date) return fail('Please pick the event date', 400)

  let settings
  try {
    settings = sanitizeSettings(body.settings || {}, defaultSettings)
  } catch (err) {
    return fail(err instanceof Error ? err.message : 'Invalid settings', 400)
  }

  const album = await createAlbum(token.uid, {
    name: fields.name,
    event_date: fields.event_date,
    event_type: fields.event_type || 'other',
    welcome_message: fields.welcome_message || '',
    location: fields.location || '',
    settings
  })
  const origin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
  return json({ album, qrUrl: `${origin}/album/${album.qr_code}` })
})
