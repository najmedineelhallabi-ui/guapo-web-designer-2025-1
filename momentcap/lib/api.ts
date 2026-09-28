'use client'

// Single client-side data layer for the app.
// "server" mode talks to our API routes (backed by Vercel Blob storage).
// "demo" mode keeps everything in this browser (localStorage + IndexedDB) so
// the app is fully clickable before storage is set up.

import {
  albumFields,
  checkUpload,
  defaultSettings,
  sanitizeSettings,
  withDefaults,
  type AlbumSettings,
  type AppAlbum,
  type AppPhoto
} from './albumRules'

export type { AppAlbum, AppPhoto, AlbumSettings }
export type AppUser = { id: string; email: string; name: string }
export type Backend = 'server' | 'demo'

// ---------------------------------------------------------------------------
// Backend detection
// ---------------------------------------------------------------------------

let backendPromise: Promise<Backend> | null = null

export function getBackend(): Promise<Backend> {
  backendPromise ??= fetch('/api/config')
    .then((r) => r.json())
    .then((d) => (d.backend === 'server' ? 'server' : 'demo') as Backend)
    .catch(() => 'demo' as Backend)
  return backendPromise
}

// ---------------------------------------------------------------------------
// Shared browser helpers
// ---------------------------------------------------------------------------

const AUTH_EVENT = 'mc-auth'
const LS_TOKEN = 'mc_token'
const LS_USER = 'mc_user'
const LS_GUEST = 'mc_guest_id'

function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeLS(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

const notifyAuth = () => window.dispatchEvent(new Event(AUTH_EVENT))

/** Stable anonymous id for this guest's browser, used for per-guest limits. */
export function getGuestId(): string {
  let id = readLS<string | null>(LS_GUEST, null)
  if (!id) {
    id = crypto.randomUUID()
    writeLS(LS_GUEST, id)
  }
  return id
}

const newCode = () => crypto.randomUUID().split('-')[0].toUpperCase()

// ---------------------------------------------------------------------------
// Server mode helpers
// ---------------------------------------------------------------------------

async function request<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const token = readLS<string | null>(LS_TOKEN, null)
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const res = await fetch(path, { ...init, headers })
  const data = await res.json().catch(() => ({}))
  if (res.status === 401 && token) {
    // Expired or invalid session
    writeLS(LS_TOKEN, null)
    writeLS(LS_USER, null)
    notifyAuth()
  }
  if (!res.ok) throw Object.assign(new Error(data.error || 'Something went wrong'), { status: res.status })
  return data as T
}

function saveSession(token: string, user: AppUser) {
  writeLS(LS_TOKEN, token)
  writeLS(LS_USER, user)
  notifyAuth()
}

// ---------------------------------------------------------------------------
// Demo mode storage
// ---------------------------------------------------------------------------

const LS_DEMO_USERS = 'mc_demo_users'
const LS_DEMO_SESSION = 'mc_demo_session'
const LS_DEMO_ALBUMS = 'mc_demo_albums'

type DemoUser = AppUser & { passwordHash: string }

async function sha256(text: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('')
}

function demoCurrentUser(): AppUser | null {
  const id = readLS<string | null>(LS_DEMO_SESSION, null)
  const user = readLS<DemoUser[]>(LS_DEMO_USERS, []).find((u) => u.id === id)
  return user ? { id: user.id, email: user.email, name: user.name } : null
}

const demoAlbums = () => readLS<AppAlbum[]>(LS_DEMO_ALBUMS, []).map(withDefaults)

type StoredPhoto = Omit<AppPhoto, 'url'> & { blob: Blob }

function openPhotoDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('momentcap-demo', 1)
    req.onupgradeneeded = () => req.result.createObjectStore('photos', { keyPath: 'id' })
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function photoStore<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openPhotoDb()
  return new Promise((resolve, reject) => {
    const req = run(db.transaction('photos', mode).objectStore('photos'))
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

const toAppPhoto = ({ blob, ...rest }: StoredPhoto): AppPhoto => ({
  ...rest,
  guest_id: rest.guest_id || '',
  url: URL.createObjectURL(blob)
})

async function demoPhotos(albumId: string) {
  const all = await photoStore<StoredPhoto[]>('readonly', (s) => s.getAll())
  return all.filter((p) => p.album_id === albumId).sort((a, b) => a.created_at.localeCompare(b.created_at))
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function getUser(): Promise<AppUser | null> {
  if ((await getBackend()) === 'demo') return demoCurrentUser()
  return readLS<string | null>(LS_TOKEN, null) ? readLS<AppUser | null>(LS_USER, null) : null
}

export function onAuthChange(callback: () => void): () => void {
  window.addEventListener(AUTH_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(AUTH_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

export async function signUp(name: string, email: string, password: string) {
  if ((await getBackend()) === 'demo') {
    const users = readLS<DemoUser[]>(LS_DEMO_USERS, [])
    const normalized = email.trim().toLowerCase()
    if (users.some((u) => u.email === normalized)) throw new Error('An account with this email already exists')
    const user: DemoUser = { id: crypto.randomUUID(), email: normalized, name: name.trim(), passwordHash: await sha256(password) }
    writeLS(LS_DEMO_USERS, [...users, user])
    writeLS(LS_DEMO_SESSION, user.id)
    return notifyAuth()
  }
  const data = await request<{ token: string; user: AppUser }>('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
  saveSession(data.token, data.user)
}

export async function signIn(email: string, password: string) {
  if ((await getBackend()) === 'demo') {
    const normalized = email.trim().toLowerCase()
    const hash = await sha256(password)
    const user = readLS<DemoUser[]>(LS_DEMO_USERS, []).find((u) => u.email === normalized && u.passwordHash === hash)
    if (!user) throw new Error('Wrong email or password')
    writeLS(LS_DEMO_SESSION, user.id)
    return notifyAuth()
  }
  const data = await request<{ token: string; user: AppUser }>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  saveSession(data.token, data.user)
}

export async function signOut() {
  writeLS(LS_DEMO_SESSION, null)
  writeLS(LS_TOKEN, null)
  writeLS(LS_USER, null)
  notifyAuth()
}

// ---------------------------------------------------------------------------
// Albums
// ---------------------------------------------------------------------------

export async function listAlbums(): Promise<AppAlbum[]> {
  if ((await getBackend()) === 'demo') {
    const user = demoCurrentUser()
    const photos = await photoStore<StoredPhoto[]>('readonly', (s) => s.getAll())
    return demoAlbums()
      .filter((a) => a.owner_id === user?.id)
      .map((a) => ({ ...a, photo_count: photos.filter((p) => p.album_id === a.id).length }))
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
  }
  return (await request<{ albums: AppAlbum[] }>('/api/albums')).albums
}

export type NewAlbumInput = Pick<AppAlbum, 'name' | 'event_type' | 'welcome_message' | 'event_date' | 'location'> & {
  settings: Partial<AlbumSettings>
}

export async function createAlbum(input: NewAlbumInput) {
  const albumUrl = (code: string) => `${window.location.origin}/album/${code}`

  if ((await getBackend()) === 'demo') {
    const user = demoCurrentUser()
    if (!user) throw new Error('Please log in to create an album')
    const fields = albumFields(input)
    if (!fields.name) throw new Error('Please give your album a name')
    if (!fields.event_date) throw new Error('Please pick the event date')
    const album = withDefaults({
      id: crypto.randomUUID(),
      owner_id: user.id,
      name: fields.name,
      event_type: fields.event_type,
      welcome_message: fields.welcome_message,
      event_date: fields.event_date,
      location: fields.location || '',
      settings: sanitizeSettings(input.settings, defaultSettings),
      qr_code: newCode(),
      is_paid: false,
      created_at: new Date().toISOString()
    })
    writeLS(LS_DEMO_ALBUMS, [...demoAlbums(), album])
    return { album, qrUrl: albumUrl(album.qr_code) }
  }

  const data = await request<{ album: AppAlbum; qrUrl: string }>('/api/albums', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  })
  return { album: data.album, qrUrl: data.qrUrl || albumUrl(data.album.qr_code) }
}

export type AlbumView = { album: AppAlbum; photos: AppPhoto[]; isOwner: boolean; totalPhotos: number }

export async function getAlbum(code: string): Promise<AlbumView | null> {
  if ((await getBackend()) === 'demo') {
    const album = demoAlbums().find((a) => a.qr_code === code.toUpperCase())
    if (!album) return null
    const isOwner = demoCurrentUser()?.id === album.owner_id
    const all = (await demoPhotos(album.id)).map(toAppPhoto)
    const guestId = getGuestId()
    const photos = isOwner || album.settings.guests_can_view ? all : all.filter((p) => p.guest_id === guestId)
    return { album, photos, isOwner, totalPhotos: all.length }
  }
  try {
    return await request<AlbumView>(`/api/albums/${encodeURIComponent(code)}?guest=${getGuestId()}`)
  } catch (err) {
    if ((err as { status?: number }).status === 404) return null
    throw err
  }
}

export type AlbumPatch = Partial<Pick<AppAlbum, 'name' | 'location' | 'event_date' | 'event_type' | 'welcome_message'>> & {
  settings?: Partial<AlbumSettings>
}

export async function updateAlbum(code: string, patch: AlbumPatch): Promise<AppAlbum> {
  if ((await getBackend()) === 'demo') {
    const albums = demoAlbums()
    const album = albums.find((a) => a.qr_code === code.toUpperCase())
    if (!album || album.owner_id !== demoCurrentUser()?.id) throw new Error('Only the organizer can change this album')
    const updated: AppAlbum = {
      ...album,
      ...albumFields(patch),
      settings: patch.settings ? sanitizeSettings(patch.settings, album.settings) : album.settings
    }
    writeLS(LS_DEMO_ALBUMS, albums.map((a) => (a.id === album.id ? updated : a)))
    return updated
  }
  const data = await request<{ album: AppAlbum }>(`/api/albums/${encodeURIComponent(code)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  })
  return data.album
}

export async function deleteAlbum(album: AppAlbum) {
  if ((await getBackend()) === 'demo') {
    if (album.owner_id !== demoCurrentUser()?.id) throw new Error('Only the organizer can delete this album')
    const photos = await demoPhotos(album.id)
    for (const p of photos) await photoStore('readwrite', (s) => s.delete(p.id))
    writeLS(LS_DEMO_ALBUMS, demoAlbums().filter((a) => a.id !== album.id))
    return
  }
  await request(`/api/albums/${album.qr_code}`, { method: 'DELETE' })
}

// ---------------------------------------------------------------------------
// Photos
// ---------------------------------------------------------------------------

export async function uploadPhoto(album: AppAlbum, file: File, contributorName: string, isOwner: boolean): Promise<AppPhoto> {
  const guestId = getGuestId()

  if ((await getBackend()) === 'demo') {
    const mine = (await demoPhotos(album.id)).filter((p) => p.guest_id === guestId).length
    const blocked = checkUpload(album, mine, contributorName, isOwner)
    if (blocked) throw new Error(blocked)
    const stored: StoredPhoto = {
      id: crypto.randomUUID(),
      album_id: album.id,
      guest_id: guestId,
      contributor_name: contributorName.trim() || 'Guest',
      created_at: new Date().toISOString(),
      blob: file
    }
    await photoStore('readwrite', (s) => s.put(stored))
    return toAppPhoto(stored)
  }

  const form = new FormData()
  form.append('file', file)
  form.append('guestId', guestId)
  form.append('contributorName', contributorName)
  const data = await request<{ photo: AppPhoto }>(`/api/albums/${album.qr_code}/photos`, { method: 'POST', body: form })
  return data.photo
}

export async function deletePhoto(album: AppAlbum, photoId: string) {
  if ((await getBackend()) === 'demo') {
    await photoStore('readwrite', (s) => s.delete(photoId))
    return
  }
  await request(`/api/albums/${album.qr_code}/photos?id=${photoId}`, { method: 'DELETE' })
}
