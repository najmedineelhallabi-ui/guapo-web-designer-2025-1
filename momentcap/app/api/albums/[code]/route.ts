import { NextRequest } from 'next/server'
import { readToken } from '@/lib/server/auth'
import { deleteAlbum, getAlbum, listPhotos, saveAlbum } from '@/lib/server/db'
import { fail, handle, json } from '@/lib/server/http'
import { albumFields, sanitizeSettings } from '@/lib/albumRules'

export const GET = handle(async (request: NextRequest, ctx: RouteContext<'/api/albums/[code]'>) => {
  const { code } = await ctx.params
  const album = await getAlbum(code)
  if (!album) return fail('Album not found', 404)

  const isOwner = readToken(request)?.uid === album.owner_id
  const guestId = request.nextUrl.searchParams.get('guest') || ''
  const all = await listPhotos(album)

  // Guests only see everyone's photos when the organizer allows it
  const photos = isOwner || album.settings.guests_can_view ? all : all.filter((p) => p.guest_id === guestId)
  return json({ album, photos, isOwner, totalPhotos: all.length })
})

export const PATCH = handle(async (request: NextRequest, ctx: RouteContext<'/api/albums/[code]'>) => {
  const { code } = await ctx.params
  const album = await getAlbum(code)
  if (!album) return fail('Album not found', 404)
  if (readToken(request)?.uid !== album.owner_id) return fail('Only the organizer can change this album', 403)

  const body = await request.json().catch(() => ({}))
  try {
    if (body.settings) album.settings = sanitizeSettings(body.settings, album.settings)
  } catch (err) {
    return fail(err instanceof Error ? err.message : 'Invalid settings', 400)
  }
  Object.assign(album, albumFields(body))

  await saveAlbum(album)
  return json({ album })
})

export const DELETE = handle(async (request: NextRequest, ctx: RouteContext<'/api/albums/[code]'>) => {
  const { code } = await ctx.params
  const album = await getAlbum(code)
  if (!album) return fail('Album not found', 404)
  if (readToken(request)?.uid !== album.owner_id) return fail('Only the organizer can delete this album', 403)
  await deleteAlbum(album)
  return json({ ok: true })
})
