'use client'

// Client data layer. Every action goes through the shared service:
// - server mode: over HTTP (/api/rpc, /api/upload), with Blob direct uploads for big files
// - demo mode: called directly in the browser against local storage

import * as service from './core/service'
import { browserRepo } from './browserRepo'
import { AppError, formatError } from './albumRules'
import type { AlbumEditable, AlbumSettings, AlbumView, AppAlbum, AppGuestbookEntry, AppPhoto, ReactionId } from './albumRules'

export type { AlbumView, AppAlbum, AppPhoto, AppGuestbookEntry, AlbumSettings }
export type AppUser = service.Viewer
export type Backend = 'server' | 'demo'
type Config = { backend: Backend; directUpload: boolean; blobAccess: 'public' | 'private'; demoPayments: boolean }

// ---------------------------------------------------------------------------
// Config & local identity
// ---------------------------------------------------------------------------

let configPromise: Promise<Config> | null = null

export function getConfig(): Promise<Config> {
  configPromise ??= fetch('/api/config')
    .then((r) => r.json())
    .then((d) => ({
      backend: d.backend === 'server' ? 'server' : 'demo',
      directUpload: Boolean(d.directUpload),
      blobAccess: d.blobAccess === 'public' ? 'public' : 'private',
      demoPayments: Boolean(d.demoPayments)
    }) as Config)
    .catch(() => ({ backend: 'demo', directUpload: false, blobAccess: 'private', demoPayments: true }) as Config)
  return configPromise
}

export const getBackend = async () => (await getConfig()).backend

const AUTH_EVENT = 'mc-auth'
const LS_TOKEN = 'mc_token'
const LS_USER = 'mc_user'
const LS_GUEST = 'mc_guest_id'
const LS_DEMO_SESSION = 'mc_demo_session'
const pinKey = (code: string) => `mc_pin_${code.toUpperCase()}`

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

/** Stable anonymous id for this guest's browser (per-guest limits, reactions, "my photos"). */
export function getGuestId(): string {
  let id = readLS<string | null>(LS_GUEST, null)
  if (!id) {
    id = crypto.randomUUID()
    writeLS(LS_GUEST, id)
  }
  return id
}

export const getAlbumPin = (code: string) => readLS<string | null>(pinKey(code), null)
export const setAlbumPin = (code: string, pin: string | null) => writeLS(pinKey(code), pin)

async function demoUser(): Promise<AppUser | null> {
  const id = readLS<string | null>(LS_DEMO_SESSION, null)
  if (!id) return null
  const users = readLS<{ id: string; email: string; name: string }[]>('mc_demo_users', [])
  const u = users.find((x) => x.id === id)
  return u ? { id: u.id, email: u.email, name: u.name } : null
}

// ---------------------------------------------------------------------------
// Transport
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public params: Record<string, string | number> = {}
  ) {
    super(message)
  }
}

const toApiError = (err: unknown) =>
  err instanceof ApiError
    ? err
    : err instanceof AppError
      ? new ApiError(err.message, err.code, err.status, err.params)
      : new ApiError(err instanceof Error && err.message ? err.message : formatError('server_error'), 'server_error', 500)

function headersFor(code?: string): Record<string, string> {
  const h: Record<string, string> = { 'X-Guest-Id': getGuestId() }
  const token = readLS<string | null>(LS_TOKEN, null)
  if (token) h.Authorization = `Bearer ${token}`
  const pin = code ? getAlbumPin(code) : null
  if (pin) h['X-Album-Pin'] = encodeURIComponent(pin)
  return h
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}))
  if (res.status === 401 && data.code === 'login_required' && readLS(LS_TOKEN, null)) {
    writeLS(LS_TOKEN, null)
    writeLS(LS_USER, null)
    notifyAuth()
  }
  if (!res.ok) throw new ApiError(data.error || formatError('server_error'), data.code || 'server_error', res.status, data.params)
  return data as T
}

async function rpc<T>(method: string, args: unknown[], code?: string): Promise<T> {
  const res = await fetch('/api/rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headersFor(code) },
    body: JSON.stringify({ method, args })
  })
  return handleResponse<T>(res)
}

async function demoCtx(code?: string): Promise<service.Ctx> {
  return { user: await demoUser(), guestId: getGuestId(), pin: code ? getAlbumPin(code) : null }
}

/** Runs an action on the server or locally (demo). */
async function run<T>(
  method: string,
  args: unknown[],
  local: (ctx: service.Ctx) => Promise<T>,
  code?: string
): Promise<T> {
  try {
    if ((await getBackend()) === 'server') return await rpc<T>(method, args, code)
    return await local(await demoCtx(code))
  } catch (err) {
    throw toApiError(err)
  }
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function getUser(): Promise<AppUser | null> {
  if ((await getBackend()) === 'demo') return demoUser()
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

async function authenticate(method: 'signUp' | 'signIn', input: Record<string, string>) {
  try {
    if ((await getBackend()) === 'server') {
      const data = await rpc<{ user: AppUser; token: string }>(method, [input])
      writeLS(LS_TOKEN, data.token)
      writeLS(LS_USER, data.user)
    } else {
      const user = await service[method](browserRepo, input)
      writeLS(LS_DEMO_SESSION, user.id)
    }
    notifyAuth()
  } catch (err) {
    throw toApiError(err)
  }
}

export const signUp = (name: string, email: string, password: string) => authenticate('signUp', { name, email, password })
export const signIn = (email: string, password: string) => authenticate('signIn', { email, password })

export async function signOut() {
  writeLS(LS_DEMO_SESSION, null)
  writeLS(LS_TOKEN, null)
  writeLS(LS_USER, null)
  notifyAuth()
}

// ---------------------------------------------------------------------------
// Albums
// ---------------------------------------------------------------------------

export const listAlbums = () => run<AppAlbum[]>('listAlbums', [], (ctx) => service.listAlbums(browserRepo, ctx))

export async function createAlbum(input: service.NewAlbumInput) {
  const album = await run<AppAlbum>('createAlbum', [input], (ctx) => service.createAlbum(browserRepo, ctx, input))
  return { album, qrUrl: `${window.location.origin}/album/${album.qr_code}` }
}

export const getAlbum = (code: string) =>
  run<AlbumView>('getAlbum', [code], (ctx) => service.getAlbum(browserRepo, ctx, code), code)

export type AlbumPatch = AlbumEditable & { settings?: Partial<AlbumSettings> }

export const updateAlbum = (code: string, patch: AlbumPatch) =>
  run<AppAlbum>('updateAlbum', [code, patch], (ctx) => service.updateAlbum(browserRepo, ctx, code, patch), code)

export const deleteAlbum = (code: string) =>
  run('deleteAlbum', [code], (ctx) => service.deleteAlbum(browserRepo, ctx, code), code)

export async function upgradeAlbum(code: string) {
  const { demoPayments } = await getConfig()
  return run('upgradeAlbum', [code], (ctx) => service.upgradeAlbum(browserRepo, ctx, code, demoPayments), code)
}

export const addCoOrganizer = (code: string, email: string) =>
  run<{ co_organizers: string[] }>('addCoOrganizer', [code, email], (ctx) => service.addCoOrganizer(browserRepo, ctx, code, email), code)

export const removeCoOrganizer = (code: string, email: string) =>
  run<{ co_organizers: string[] }>('removeCoOrganizer', [code, email], (ctx) => service.removeCoOrganizer(browserRepo, ctx, code, email), code)

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export type UploadMeta = service.PhotoMeta

// Serverless functions only accept ~4.5 MB request bodies
const MAX_PROXY_BYTES = 4 * 1024 * 1024

export async function uploadMedia(code: string, file: File, kind: 'image' | 'video', meta: UploadMeta): Promise<AppPhoto> {
  try {
    const config = await getConfig()
    if (config.backend === 'demo') {
      return await service.addPhoto(browserRepo, await demoCtx(code), code, file, kind, meta)
    }

    if (config.directUpload && file.size > MAX_PROXY_BYTES) {
      const { path, ticket } = await rpc<{ path: string; ticket: string }>('prepareDirectUpload', [code, kind, file.size, meta], code)
      const { upload } = await import('@vercel/blob/client')
      await upload(path, file, {
        access: config.blobAccess,
        handleUploadUrl: '/api/upload/token',
        clientPayload: JSON.stringify({ ticket }),
        headers: headersFor(code),
        contentType: file.type
      })
      return await rpc<AppPhoto>('registerDirectUpload', [code, path, ticket, kind, meta], code)
    }

    const form = new FormData()
    form.append('code', code)
    form.append('target', 'photo')
    form.append('kind', kind)
    form.append('meta', JSON.stringify(meta))
    form.append('file', file)
    return await handleResponse<AppPhoto>(await fetch('/api/upload', { method: 'POST', headers: headersFor(code), body: form }))
  } catch (err) {
    throw toApiError(err)
  }
}

export async function setCover(code: string, file: File | null): Promise<{ cover_url: string | null }> {
  try {
    if ((await getBackend()) === 'demo') return await service.setCover(browserRepo, await demoCtx(code), code, file)
    const form = new FormData()
    form.append('code', code)
    form.append('target', 'cover')
    if (file) form.append('file', file)
    return await handleResponse(await fetch('/api/upload', { method: 'POST', headers: headersFor(code), body: form }))
  } catch (err) {
    throw toApiError(err)
  }
}

export const deletePhoto = (code: string, id: string) =>
  run('deletePhoto', [code, id], (ctx) => service.deletePhoto(browserRepo, ctx, code, id), code)

export const moderatePhoto = (code: string, id: string, approve: boolean) =>
  run('moderatePhoto', [code, id, approve], (ctx) => service.moderatePhoto(browserRepo, ctx, code, id, approve), code)

export const approveAll = (code: string) =>
  run('approveAll', [code], (ctx) => service.approveAllPhotos(browserRepo, ctx, code), code)

export const toggleFavorite = (code: string, id: string) =>
  run<{ favorite: boolean }>('toggleFavorite', [code, id], (ctx) => service.toggleFavorite(browserRepo, ctx, code, id), code)

export const react = (code: string, id: string, reaction: ReactionId) =>
  run<{ reactions: Record<ReactionId, number>; my_reactions: ReactionId[] }>(
    'react',
    [code, id, reaction],
    (ctx) => service.react(browserRepo, ctx, code, id, reaction),
    code
  )

export const addGuestbookEntry = (code: string, input: { name: string; message: string }) =>
  run<AppGuestbookEntry>('addGuestbookEntry', [code, input], (ctx) => service.addGuestbookEntry(browserRepo, ctx, code, input), code)

export const moderateGuestbookEntry = (code: string, id: string, approve: boolean) =>
  run('moderateGuestbookEntry', [code, id, approve], (ctx) => service.moderateGuestbookEntry(browserRepo, ctx, code, id, approve), code)
