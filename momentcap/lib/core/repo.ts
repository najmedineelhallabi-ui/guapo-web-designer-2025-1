import type { AlbumRecord, AlbumState } from '../albumRules'
import type { Plan } from '../planRules'
import type { Subscription } from '../pricing'

export type UserRecord = { id: string; email: string; name: string; password: string; created_at: string }

/** Storage operations the service needs. Implemented for the server (Blob/filesystem) and the browser (demo). */
export interface Repo {
  newId(): string

  findUser(email: string): Promise<UserRecord | null>
  saveUser(user: UserRecord): Promise<void>
  hashPassword(password: string): Promise<string>
  verifyPassword(password: string, stored: string): Promise<boolean>

  readAlbum(code: string): Promise<AlbumRecord | null>
  writeAlbum(album: AlbumRecord): Promise<void>
  readState(code: string): Promise<AlbumState>
  /** Atomically read-modify-write the album state. */
  updateState<T>(code: string, fn: (state: AlbumState) => T): Promise<T>
  deleteAlbumData(code: string): Promise<void>

  /** Organizer's private plan (guests, seating, checklist, budget, vendors) */
  readPlan(code: string): Promise<Plan>
  updatePlan<T>(code: string, fn: (plan: Plan) => T): Promise<T>

  /** Pro subscription of a user (null when none) */
  readSubscription(userId: string): Promise<Subscription | null>
  writeSubscription(userId: string, sub: Subscription | null): Promise<void>

  /** Indexes albums per owner id ("owner") or per organizer email ("co") */
  /** "team" indexes, per member email, the owner ids whose Business team includes them */
  setIndex(kind: 'owner' | 'co' | 'team', key: string, value: string, present: boolean): Promise<void>
  listIndex(kind: 'owner' | 'co' | 'team', key: string): Promise<string[]>

  putFile(path: string, data: Blob, contentType: string): Promise<void>
  deleteFiles(paths: string[]): Promise<void>
  fileUrl(path: string): Promise<string>
}
