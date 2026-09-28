'use client'

// Single client-side data layer for the app.
// Uses Supabase (auth + API routes) when it is configured, otherwise a
// browser-only demo mode (localStorage + IndexedDB) so every flow still works.

import { supabase, isSupabaseConfigured } from './supabase'

export type AppUser = { id: string; email: string; name: string }

export type AppAlbum = {
  id: string
  owner_id: string
  name: string
  event_date: string
  location: string
  qr_code: string
  is_paid: boolean
  album_visibility: 'public' | 'private'
  created_at: string
}

export type AppPhoto = {
  id: string
  album_id: string
  url: string
  contributor_name: string
  created_at: string
}

export const isDemoMode = !isSupabaseConfigured

const newCode = () => crypto.randomUUID().split('-')[0].toUpperCase()

// ---------------------------------------------------------------------------
// Demo storage
// ---------------------------------------------------------------------------

const LS_USERS = 'mc_demo_users'
const LS_SESSION = 'mc_demo_session'
const LS_ALBUMS = 'mc_demo_albums'
const AUTH_EVENT = 'mc-demo-auth'

type DemoUser = AppUser & { passwordHash: string }

function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeLS(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

async function hashPassword(password: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('')
}

function demoCurrentUser(): AppUser | null {
  const id = readLS<string | null>(LS_SESSION, null)
  const user = readLS<DemoUser[]>(LS_USERS, []).find((u) => u.id === id)
  return user ? { id: user.id, email: user.email, name: user.name } : null
}

function setDemoSession(id: string | null) {
  if (id) writeLS(LS_SESSION, id)
  else localStorage.removeItem(LS_SESSION)
  window.dispatchEvent(new Event(AUTH_EVENT))
}

// Photos are stored as blobs in IndexedDB (localStorage is too small)
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

const toAppPhoto = ({ blob, ...rest }: StoredPhoto): AppPhoto => ({ ...rest, url: URL.createObjectURL(blob) })

// ---------------------------------------------------------------------------
// Remote helpers
// ---------------------------------------------------------------------------

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function jsonOrThrow(res: Response, fallback: string) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || fallback)
  return data
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getUser(): Promise<AppUser | null> {
  if (isDemoMode) return demoCurrentUser()
  const { data } = await supabase.auth.getSession()
  const u = data.session?.user
  return u ? { id: u.id, email: u.email || '', name: (u.user_metadata?.name as string) || '' } : null
}

export function onAuthChange(callback: () => void): () => void {
  if (isDemoMode) {
    window.addEventListener(AUTH_EVENT, callback)
    window.addEventListener('storage', callback)
    return () => {
      window.removeEventListener(AUTH_EVENT, callback)
      window.removeEventListener('storage', callback)
    }
  }
  const { data } = supabase.auth.onAuthStateChange(() => callback())
  return () => data.subscription.unsubscribe()
}

/** Returns true when the user must confirm their email before logging in. */
export async function signUp(name: string, email: string, password: string, redirectTo: string): Promise<boolean> {
  if (isDemoMode) {
    const users = readLS<DemoUser[]>(LS_USERS, [])
    const normalized = email.trim().toLowerCase()
    if (users.some((u) => u.email === normalized)) throw new Error('An account with this email already exists')
    const user: DemoUser = { id: crypto.randomUUID(), email: normalized, name, passwordHash: await hashPassword(password) }
    writeLS(LS_USERS, [...users, user])
    setDemoSession(user.id)
    return false
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name }, emailRedirectTo: redirectTo }
  })
  if (error) throw error
  return !data.session
}

export async function signIn(email: string, password: string) {
  if (isDemoMode) {
    const normalized = email.trim().toLowerCase()
    const hash = await hashPassword(password)
    const user = readLS<DemoUser[]>(LS_USERS, []).find((u) => u.email === normalized && u.passwordHash === hash)
    if (!user) throw new Error('Wrong email or password')
    setDemoSession(user.id)
    return
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut() {
  if (isDemoMode) return setDemoSession(null)
  await supabase.auth.signOut()
}

export async function listAlbums(): Promise<AppAlbum[]> {
  if (isDemoMode) {
    const user = demoCurrentUser()
    return readLS<AppAlbum[]>(LS_ALBUMS, [])
      .filter((a) => a.owner_id === user?.id)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
  }
  const res = await fetch('/api/albums', { headers: await authHeaders() })
  return (await jsonOrThrow(res, 'Could not load your albums')).albums || []
}

export async function createAlbum(input: { name: string; event_date: string; location: string }) {
  const albumUrl = (code: string) => `${window.location.origin}/album/${code}`

  if (isDemoMode) {
    const user = demoCurrentUser()
    if (!user) throw new Error('Please log in to create an album')
    const album: AppAlbum = {
      id: crypto.randomUUID(),
      owner_id: user.id,
      name: input.name,
      event_date: input.event_date,
      location: input.location,
      qr_code: newCode(),
      is_paid: false,
      album_visibility: 'public',
      created_at: new Date().toISOString()
    }
    writeLS(LS_ALBUMS, [...readLS<AppAlbum[]>(LS_ALBUMS, []), album])
    return { album, qrUrl: albumUrl(album.qr_code) }
  }

  const res = await fetch('/api/albums', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify({ ...input, owner_type: 'couple' })
  })
  const data = await jsonOrThrow(res, 'Could not create the album. Please try again.')
  return { album: data.album as AppAlbum, qrUrl: (data.qrUrl as string) || albumUrl(data.album.qr_code) }
}

export async function getAlbum(code: string): Promise<{ album: AppAlbum; photos: AppPhoto[] } | null> {
  if (isDemoMode) {
    const album = readLS<AppAlbum[]>(LS_ALBUMS, []).find((a) => a.qr_code === code.toUpperCase())
    if (!album) return null
    const all = await photoStore<StoredPhoto[]>('readonly', (s) => s.getAll())
    const photos = all
      .filter((p) => p.album_id === album.id)
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map(toAppPhoto)
    return { album, photos }
  }
  const res = await fetch(`/api/albums/${encodeURIComponent(code)}`)
  if (res.status === 404) return null
  const { album } = await jsonOrThrow(res, 'Could not load the album')
  const { photos = [], ...rest } = album
  return { album: rest, photos }
}

export async function uploadPhoto(album: AppAlbum, file: File, contributorName: string, inviteId: string): Promise<AppPhoto> {
  if (isDemoMode) {
    const stored: StoredPhoto = {
      id: crypto.randomUUID(),
      album_id: album.id,
      contributor_name: contributorName || 'Guest',
      created_at: new Date().toISOString(),
      blob: file
    }
    await photoStore('readwrite', (s) => s.put(stored))
    return toAppPhoto(stored)
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('albumId', album.id)
  formData.append('inviteId', inviteId)
  formData.append('visibility', 'public')
  formData.append('contributorName', contributorName)
  const res = await fetch('/api/photos', { method: 'POST', body: formData })
  return (await jsonOrThrow(res, 'Upload failed')).photo
}
