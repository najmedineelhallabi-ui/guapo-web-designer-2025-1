import { NextRequest } from 'next/server'
import { readToken } from '@/lib/server/auth'
import { addPhoto, deletePhoto, getAlbum, listPhotos } from '@/lib/server/db'
import { fail, handle, isUuid, json } from '@/lib/server/http'
import { checkUpload, MAX_FILE_MB } from '@/lib/albumRules'

export const POST = handle(async (request: NextRequest, ctx: RouteContext<'/api/albums/[code]/photos'>) => {
  const { code } = await ctx.params
  const album = await getAlbum(code)
  if (!album) return fail('Album not found', 404)

  const form = await request.formData()
  const file = form.get('file')
  const guestId = form.get('guestId')
  const name = String(form.get('contributorName') || '')
  if (!(file instanceof File)) return fail('No photo received', 400)
  if (!isUuid(guestId)) return fail('Invalid guest id', 400)
  if (file.size > MAX_FILE_MB * 1024 * 1024) return fail(`Photos must be under ${MAX_FILE_MB} MB`, 413)
  if (!file.type.startsWith('image/')) return fail('Only images can be uploaded', 400)

  const isOwner = readToken(request)?.uid === album.owner_id
  const mine = (await listPhotos(album)).filter((p) => p.guest_id === guestId).length
  const blocked = checkUpload(album, mine, name, isOwner)
  if (blocked) return fail(blocked, 403)

  const photo = await addPhoto(album, Buffer.from(await file.arrayBuffer()), guestId, name)
  return json({ photo })
})

export const DELETE = handle(async (request: NextRequest, ctx: RouteContext<'/api/albums/[code]/photos'>) => {
  const { code } = await ctx.params
  const album = await getAlbum(code)
  if (!album) return fail('Album not found', 404)
  if (readToken(request)?.uid !== album.owner_id) return fail('Only the organizer can delete photos', 403)

  const id = request.nextUrl.searchParams.get('id')
  if (!isUuid(id)) return fail('Invalid photo id', 400)
  if (!(await deletePhoto(album, id))) return fail('Photo not found', 404)
  return json({ ok: true })
})
