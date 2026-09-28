import 'server-only'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { put, get, list, del, BlobPreconditionFailedError, type BlobAccessType } from '@vercel/blob'

export type StoredFile = { body: Buffer; contentType: string }

export interface Storage {
  write(pathname: string, body: Buffer | string, contentType: string): Promise<void>
  read(pathname: string): Promise<StoredFile | null>
  list(prefix: string): Promise<string[]>
  remove(pathnames: string[]): Promise<void>
  /** Atomic read-modify-write of a JSON document (null when it doesn't exist yet). */
  updateJSON<T, R>(pathname: string, fn: (current: T | null) => { value: T; result: R }): Promise<R>
  /** Size in bytes, or null if the file doesn't exist */
  size(pathname: string): Promise<number | null>
}

// --- Vercel Blob -----------------------------------------------------------
// Works with both private and public stores: we try private first and
// remember the store's access type after the first write.

let blobAccess: BlobAccessType =
  process.env.MOMENTCAP_BLOB_ACCESS === 'public' ? 'public' : 'private'

async function streamToBuffer(stream: ReadableStream<Uint8Array>) {
  return Buffer.from(await new Response(stream).arrayBuffer())
}

const blobStorage: Storage = {
  async write(pathname, body, contentType) {
    const opts = { contentType, addRandomSuffix: false, allowOverwrite: true }
    try {
      await put(pathname, body, { ...opts, access: blobAccess })
    } catch (err) {
      // Wrong access type for this store: switch once and retry
      if (!/access|private|public/i.test(String(err))) throw err
      blobAccess = blobAccess === 'private' ? 'public' : 'private'
      await put(pathname, body, { ...opts, access: blobAccess })
    }
  },
  async read(pathname) {
    const res = await get(pathname, { access: blobAccess, useCache: false }).catch(() => null)
    if (!res || res.statusCode !== 200 || !res.stream) return null
    return { body: await streamToBuffer(res.stream), contentType: res.blob.contentType }
  },
  async list(prefix) {
    const out: string[] = []
    let cursor: string | undefined
    do {
      const page = await list({ prefix, cursor, limit: 1000 })
      out.push(...page.blobs.map((b) => b.pathname))
      cursor = page.hasMore ? page.cursor : undefined
    } while (cursor)
    return out
  },
  async remove(pathnames) {
    if (pathnames.length) await del(pathnames)
  },
  async updateJSON(pathname, fn) {
    // Optimistic concurrency with ETags; retried when another request wrote in between
    for (let attempt = 0; attempt < 8; attempt++) {
      const res = await get(pathname, { access: blobAccess, useCache: false }).catch(() => null)
      const exists = Boolean(res && res.statusCode === 200 && res.stream)
      const current = exists ? JSON.parse((await streamToBuffer(res!.stream!)).toString('utf8')) : null
      const { value, result } = fn(current)
      try {
        await put(pathname, JSON.stringify(value), {
          access: blobAccess,
          contentType: 'application/json',
          addRandomSuffix: false,
          ...(exists ? { ifMatch: res!.blob.etag } : { allowOverwrite: false })
        })
        return result
      } catch (err) {
        const conflict = err instanceof BlobPreconditionFailedError || /already exists|precondition/i.test(String(err))
        if (!conflict) throw err
        await new Promise((r) => setTimeout(r, 50 + Math.random() * 150 * (attempt + 1)))
      }
    }
    throw new Error('Too many concurrent updates, please retry')
  },
  async size(pathname) {
    const res = await get(pathname, { access: blobAccess, useCache: false }).catch(() => null)
    if (!res || res.statusCode !== 200) return null
    res.stream?.cancel().catch(() => {})
    return res.blob.size
  }
}

// Serializes updates within this process (the filesystem driver runs on one server)
const locks = new Map<string, Promise<unknown>>()
function withLock<R>(key: string, fn: () => Promise<R>): Promise<R> {
  const prev = locks.get(key) || Promise.resolve()
  const next = prev.catch(() => {}).then(fn)
  locks.set(key, next)
  return next
}

// --- Local filesystem (development / tests only) ---------------------------

function fsStorage(root: string): Storage {
  const abs = (p: string) => {
    const full = path.resolve(root, p)
    if (!full.startsWith(path.resolve(root) + path.sep)) throw new Error('Invalid path')
    return full
  }
  return {
    async write(pathname, body, contentType) {
      const file = abs(pathname)
      await fs.mkdir(path.dirname(file), { recursive: true })
      await fs.writeFile(file, body)
      await fs.writeFile(file + '.type', contentType)
    },
    async read(pathname) {
      try {
        const file = abs(pathname)
        const [body, type] = await Promise.all([fs.readFile(file), fs.readFile(file + '.type', 'utf8')])
        return { body, contentType: type }
      } catch {
        return null
      }
    },
    async list(prefix) {
      const base = path.resolve(root)
      const out: string[] = []
      const walk = async (dir: string) => {
        const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])
        for (const e of entries) {
          const full = path.join(dir, e.name)
          if (e.isDirectory()) await walk(full)
          else if (!e.name.endsWith('.type')) out.push(path.relative(base, full).split(path.sep).join('/'))
        }
      }
      await walk(base)
      return out.filter((p) => p.startsWith(prefix)).sort()
    },
    async remove(pathnames) {
      await Promise.all(pathnames.flatMap((p) => [fs.rm(abs(p), { force: true }), fs.rm(abs(p) + '.type', { force: true })]))
    },
    updateJSON(pathname, fn) {
      return withLock(pathname, async () => {
        const file = await this.read(pathname)
        const { value, result } = fn(file ? JSON.parse(file.body.toString('utf8')) : null)
        await this.write(pathname, JSON.stringify(value), 'application/json')
        return result
      })
    },
    async size(pathname) {
      const stat = await fs.stat(abs(pathname)).catch(() => null)
      return stat ? stat.size : null
    }
  }
}

export function getStorage(): Storage | null {
  if (process.env.BLOB_READ_WRITE_TOKEN) return blobStorage
  if (process.env.MOMENTCAP_LOCAL_STORE) return fsStorage(process.env.MOMENTCAP_LOCAL_STORE)
  return null
}

export async function readJSON<T>(storage: Storage, pathname: string): Promise<T | null> {
  const file = await storage.read(pathname)
  return file ? (JSON.parse(file.body.toString('utf8')) as T) : null
}

export async function writeJSON(storage: Storage, pathname: string, value: unknown) {
  await storage.write(pathname, JSON.stringify(value), 'application/json')
}
