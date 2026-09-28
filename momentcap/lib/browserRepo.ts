'use client'

// Demo-mode storage: everything lives in this browser.
// Records in localStorage, photo/video files in IndexedDB.

import { emptyState, type AlbumRecord, type AlbumState } from './albumRules'
import type { Repo, UserRecord } from './core/repo'
import { emptyPlan, type Plan } from './planRules'
import type { Subscription } from './pricing'

type LegacyUser = { id: string; email: string; name: string; passwordHash: string }

const K_USERS = 'mc_demo_users'
const K_ALBUMS = 'mc2_albums'
const kState = (code: string) => `mc2_state_${code}`
const kPlan = (code: string) => `mc2_plan_${code}`
const kIndex = (kind: string, key: string) => `mc2_index_${kind}_${key}`

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

async function sha256(text: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('')
}

// --- IndexedDB files --------------------------------------------------------

let dbPromise: Promise<IDBDatabase> | null = null
function db(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open('momentcap-files', 1)
    req.onupgradeneeded = () => req.result.createObjectStore('files', { keyPath: 'path' })
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

async function files<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const database = await db()
  return new Promise((resolve, reject) => {
    const req = run(database.transaction('files', mode).objectStore('files'))
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

const urlCache = new Map<string, string>()

// --- Repo ------------------------------------------------------------------

export const browserRepo: Repo = {
  newId: () => crypto.randomUUID(),

  async findUser(email) {
    const u = read<LegacyUser[]>(K_USERS, []).find((x) => x.email === email.toLowerCase())
    return u ? { id: u.id, email: u.email, name: u.name, password: u.passwordHash, created_at: '' } : null
  },
  async saveUser(user: UserRecord) {
    const users = read<LegacyUser[]>(K_USERS, []).filter((u) => u.email !== user.email)
    write(K_USERS, [...users, { id: user.id, email: user.email, name: user.name, passwordHash: user.password }])
  },
  hashPassword: (pw) => sha256(pw),
  verifyPassword: async (pw, stored) => (await sha256(pw)) === stored,

  async readAlbum(code) {
    return read<Record<string, AlbumRecord>>(K_ALBUMS, {})[code] || null
  },
  async writeAlbum(album) {
    const all = read<Record<string, AlbumRecord>>(K_ALBUMS, {})
    all[album.qr_code] = album
    write(K_ALBUMS, all)
  },
  async readState(code) {
    return read<AlbumState>(kState(code), emptyState())
  },
  async updateState(code, fn) {
    const state = read<AlbumState>(kState(code), emptyState())
    const result = fn(state)
    write(kState(code), state)
    return result
  },
  async readPlan(code) {
    return { ...emptyPlan(), ...read<Partial<Plan>>(kPlan(code), {}) }
  },
  async updatePlan(code, fn) {
    const plan = { ...emptyPlan(), ...read<Partial<Plan>>(kPlan(code), {}) }
    const result = fn(plan)
    write(kPlan(code), plan)
    return result
  },
  async deleteAlbumData(code) {
    localStorage.removeItem(kPlan(code))
    const state = read<AlbumState>(kState(code), emptyState())
    const album = read<Record<string, AlbumRecord>>(K_ALBUMS, {})[code]
    await this.deleteFiles([...state.photos.map((p) => p.path), ...(album?.cover_path ? [album.cover_path] : [])])
    localStorage.removeItem(kState(code))
    const all = read<Record<string, AlbumRecord>>(K_ALBUMS, {})
    delete all[code]
    write(K_ALBUMS, all)
  },

  async readSubscription(userId) {
    return read<Subscription | null>(`mc2_sub_${userId}`, null)
  },
  async writeSubscription(userId, sub) {
    if (sub) write(`mc2_sub_${userId}`, sub)
    else localStorage.removeItem(`mc2_sub_${userId}`)
  },

  async setIndex(kind, key, code, present) {
    const k = kIndex(kind, key.toLowerCase())
    const list = read<string[]>(k, []).filter((c) => c !== code)
    write(k, present ? [...list, code] : list)
  },
  async listIndex(kind, key) {
    return read<string[]>(kIndex(kind, key.toLowerCase()), [])
  },

  async putFile(path, data) {
    await files('readwrite', (s) => s.put({ path, blob: data }))
  },
  async deleteFiles(paths) {
    for (const path of paths) {
      await files('readwrite', (s) => s.delete(path))
      const url = urlCache.get(path)
      if (url) URL.revokeObjectURL(url)
      urlCache.delete(path)
    }
  },
  async fileUrl(path) {
    const cached = urlCache.get(path)
    if (cached) return cached
    const record = await files<{ path: string; blob: Blob } | undefined>('readonly', (s) => s.get(path))
    const url = record ? URL.createObjectURL(record.blob) : ''
    if (url) urlCache.set(path, url)
    return url
  }
}
