import 'server-only'
import { randomUUID } from 'node:crypto'
import { getStorage, readJSON, writeJSON, type Storage } from './storage'
import { emailKey, signedFileUrl } from './auth'
import { withDefaults, type AppAlbum, type AppPhoto } from '../albumRules'

// Layout in storage:
//   users/<emailKey>.json                 user record
//   albums/<CODE>/album.json              album record
//   albums/<CODE>/photos/<ts>_<id>_<guest>_<hexName>.jpg
//   owners/<userId>/<CODE>                index of a user's albums

export type UserRecord = { id: string; email: string; name: string; password: string; created_at: string }

export function requireStorage(): Storage {
  const storage = getStorage()
  if (!storage) throw new Error('Storage is not configured')
  return storage
}

export const publicUser = (u: UserRecord) => ({ id: u.id, email: u.email, name: u.name })

export async function getUserByEmail(email: string) {
  return readJSON<UserRecord>(requireStorage(), `users/${emailKey(email)}.json`)
}

export async function getUserByKey(ek: string) {
  if (!/^[a-f0-9]{64}$/.test(ek)) return null
  return readJSON<UserRecord>(requireStorage(), `users/${ek}.json`)
}

export async function createUser(name: string, email: string, passwordHash: string) {
  const user: UserRecord = {
    id: randomUUID(),
    email: email.trim().toLowerCase(),
    name: name.trim(),
    password: passwordHash,
    created_at: new Date().toISOString()
  }
  await writeJSON(requireStorage(), `users/${emailKey(email)}.json`, user)
  return user
}

const validCode = (code: string) => /^[A-Z0-9]{4,16}$/.test(code)

export async function getAlbum(code: string): Promise<AppAlbum | null> {
  const c = code.toUpperCase()
  if (!validCode(c)) return null
  const raw = await readJSON<AppAlbum>(requireStorage(), `albums/${c}/album.json`)
  return raw ? withDefaults(raw) : null
}

export async function saveAlbum(album: AppAlbum) {
  await writeJSON(requireStorage(), `albums/${album.qr_code}/album.json`, album)
}

export async function createAlbum(ownerId: string, input: { name: string; event_date: string; location: string }) {
  const storage = requireStorage()
  let code = ''
  do {
    code = randomUUID().split('-')[0].toUpperCase()
  } while (await readJSON(storage, `albums/${code}/album.json`))

  const album = withDefaults({
    id: randomUUID(),
    owner_id: ownerId,
    name: input.name.trim().slice(0, 120),
    event_date: input.event_date,
    location: (input.location || '').trim().slice(0, 120),
    qr_code: code,
    is_paid: false,
    created_at: new Date().toISOString()
  })
  await saveAlbum(album)
  await storage.write(`owners/${ownerId}/${code}`, code, 'text/plain')
  return album
}

export async function listOwnerAlbums(ownerId: string) {
  const storage = requireStorage()
  const codes = (await storage.list(`owners/${ownerId}/`)).map((p) => p.split('/').pop()!)
  const albums = await Promise.all(codes.map(getAlbum))
  return albums
    .filter((a): a is AppAlbum => Boolean(a && a.owner_id === ownerId))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

function parsePhoto(album: AppAlbum, pathname: string): AppPhoto | null {
  const file = pathname.split('/').pop() || ''
  const m = file.match(/^(\d+)_([0-9a-f-]{36})_([0-9a-f-]{36})_([0-9a-f]*)\.jpg$/)
  if (!m) return null
  return {
    id: m[2],
    album_id: album.id,
    url: signedFileUrl(pathname),
    guest_id: m[3],
    contributor_name: Buffer.from(m[4], 'hex').toString('utf8') || 'Guest',
    created_at: new Date(Number(m[1])).toISOString()
  }
}

export async function listPhotos(album: AppAlbum) {
  const paths = await requireStorage().list(`albums/${album.qr_code}/photos/`)
  return paths
    .map((p) => parsePhoto(album, p))
    .filter((p): p is AppPhoto => Boolean(p))
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
}

export async function addPhoto(album: AppAlbum, body: Buffer, guestId: string, name: string) {
  const hexName = Buffer.from(name.trim().slice(0, 40) || 'Guest', 'utf8').toString('hex')
  const pathname = `albums/${album.qr_code}/photos/${Date.now()}_${randomUUID()}_${guestId}_${hexName}.jpg`
  await requireStorage().write(pathname, body, 'image/jpeg')
  return parsePhoto(album, pathname)!
}

export async function deletePhoto(album: AppAlbum, photoId: string) {
  const storage = requireStorage()
  const paths = await storage.list(`albums/${album.qr_code}/photos/`)
  const match = paths.filter((p) => p.includes(`_${photoId}_`))
  await storage.remove(match)
  return match.length > 0
}
