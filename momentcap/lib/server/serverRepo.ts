import 'server-only'
import { randomUUID } from 'node:crypto'
import { emptyState, type AlbumRecord, type AlbumState } from '../albumRules'
import type { Repo, UserRecord } from '../core/repo'
import { emptyPlan, type Plan } from '../planRules'
import type { Subscription } from '../pricing'
import { getStorage, readJSON, writeJSON, type Storage } from './storage'
import { emailKey, hashPassword, signedFileUrl, verifyPassword } from './auth'

// Layout in storage:
//   users/<emailKey>.json               user record
//   albums/<CODE>/album.json            album record
//   albums/<CODE>/state.json            photos, guestbook (updated atomically)
//   albums/<CODE>/plan.json             guests, RSVPs, seating, checklist, budget, vendors
//   albums/<CODE>/media/<id>.<ext>      photo and video files
//   albums/<CODE>/cover-<id>.jpg        cover photo
//   index/owner/<userId>/<CODE>         albums a user owns
//   index/co/<emailKey>/<CODE>          albums a user co-organizes

const indexKey = (kind: 'owner' | 'co', key: string) => (kind === 'co' ? emailKey(key) : key)

export function createServerRepo(storage: Storage): Repo {
  return {
    newId: () => randomUUID(),

    findUser: (email) => readJSON<UserRecord>(storage, `users/${emailKey(email)}.json`),
    saveUser: (user) => writeJSON(storage, `users/${emailKey(user.email)}.json`, user),
    hashPassword: async (pw) => hashPassword(pw),
    verifyPassword: async (pw, stored) => verifyPassword(pw, stored),

    readAlbum: (code) => readJSON<AlbumRecord>(storage, `albums/${code}/album.json`),
    writeAlbum: (album) => writeJSON(storage, `albums/${album.qr_code}/album.json`, album),
    readState: async (code) => (await readJSON<AlbumState>(storage, `albums/${code}/state.json`)) || emptyState(),
    updateState: (code, fn) =>
      storage.updateJSON<AlbumState, ReturnType<typeof fn>>(`albums/${code}/state.json`, (current) => {
        const state = current || emptyState()
        const result = fn(state)
        return { value: state, result }
      }),
    readPlan: async (code) => ({ ...emptyPlan(), ...((await readJSON<Plan>(storage, `albums/${code}/plan.json`)) || {}) }),
    updatePlan: (code, fn) =>
      storage.updateJSON<Plan, ReturnType<typeof fn>>(`albums/${code}/plan.json`, (current) => {
        const plan = { ...emptyPlan(), ...(current || {}) }
        const result = fn(plan)
        return { value: plan, result }
      }),
    async deleteAlbumData(code) {
      await storage.remove(await storage.list(`albums/${code}/`))
    },

    readSubscription: (userId) => readJSON<Subscription>(storage, `subscriptions/${userId}.json`),
    async writeSubscription(userId, sub) {
      if (sub) await writeJSON(storage, `subscriptions/${userId}.json`, sub)
      else await storage.remove([`subscriptions/${userId}.json`])
    },

    async setIndex(kind, key, code, present) {
      const path = `index/${kind}/${indexKey(kind, key)}/${code}`
      if (present) await storage.write(path, code, 'text/plain')
      else await storage.remove([path])
    },
    async listIndex(kind, key) {
      const prefix = `index/${kind}/${indexKey(kind, key)}/`
      return (await storage.list(prefix)).map((p) => p.slice(prefix.length))
    },

    async putFile(path, data, contentType) {
      await storage.write(path, Buffer.from(await data.arrayBuffer()), contentType)
    },
    deleteFiles: (paths) => storage.remove(paths),
    fileUrl: async (path) => signedFileUrl(path)
  }
}

export function serverRepo(): Repo | null {
  const storage = getStorage()
  return storage ? createServerRepo(storage) : null
}
