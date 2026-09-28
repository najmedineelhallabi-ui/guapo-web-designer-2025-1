// Shared (client + server) album types and rules.

export type AlbumSettings = {
  /** ISO date-time; guests can't upload before this. null = no limit */
  uploads_open_at: string | null
  /** ISO date-time; guests can't upload after this. null = no limit */
  uploads_close_at: string | null
  /** Can guests see everyone's photos, or only their own? */
  guests_can_view: boolean
  /** Max photos one guest can add. null = unlimited */
  max_photos_per_guest: number | null
  /** Guests must type their name before uploading */
  require_name: boolean
}

export type AppAlbum = {
  id: string
  owner_id: string
  name: string
  event_date: string
  location: string
  qr_code: string
  is_paid: boolean
  created_at: string
  settings: AlbumSettings
}

export type AppPhoto = {
  id: string
  album_id: string
  url: string
  contributor_name: string
  guest_id: string
  created_at: string
}

export const FREE_DAYS = 7
export const MAX_FILE_MB = 20

export const defaultSettings: AlbumSettings = {
  uploads_open_at: null,
  uploads_close_at: null,
  guests_can_view: true,
  max_photos_per_guest: null,
  require_name: false
}

export function withDefaults(album: Omit<AppAlbum, 'settings'> & { settings?: Partial<AlbumSettings> }): AppAlbum {
  return { ...album, settings: { ...defaultSettings, ...(album.settings || {}) } }
}

export type UploadState =
  | { open: true }
  | { open: false; reason: 'not_yet'; opensAt: string }
  | { open: false; reason: 'closed'; closedAt: string }

export function uploadState(settings: AlbumSettings, now = Date.now()): UploadState {
  if (settings.uploads_open_at && now < Date.parse(settings.uploads_open_at)) {
    return { open: false, reason: 'not_yet', opensAt: settings.uploads_open_at }
  }
  if (settings.uploads_close_at && now > Date.parse(settings.uploads_close_at)) {
    return { open: false, reason: 'closed', closedAt: settings.uploads_close_at }
  }
  return { open: true }
}

/** Validates and normalizes settings coming from a form or request body. */
export function sanitizeSettings(input: Partial<AlbumSettings>, current: AlbumSettings): AlbumSettings {
  const date = (v: unknown) => (typeof v === 'string' && v && !Number.isNaN(Date.parse(v)) ? new Date(v).toISOString() : null)
  const next: AlbumSettings = { ...current }
  if ('uploads_open_at' in input) next.uploads_open_at = date(input.uploads_open_at)
  if ('uploads_close_at' in input) next.uploads_close_at = date(input.uploads_close_at)
  if ('guests_can_view' in input) next.guests_can_view = Boolean(input.guests_can_view)
  if ('require_name' in input) next.require_name = Boolean(input.require_name)
  if ('max_photos_per_guest' in input) {
    const n = Number(input.max_photos_per_guest)
    next.max_photos_per_guest = input.max_photos_per_guest === null || !Number.isFinite(n) || n < 1 ? null : Math.min(Math.floor(n), 1000)
  }
  if (next.uploads_open_at && next.uploads_close_at && next.uploads_close_at <= next.uploads_open_at) {
    throw new Error('The closing time must be after the opening time')
  }
  return next
}

/** Returns an error message if this guest can't upload right now, otherwise null. */
export function checkUpload(album: AppAlbum, guestPhotoCount: number, contributorName: string, isOwner: boolean): string | null {
  if (isOwner) return null
  const state = uploadState(album.settings)
  if (!state.open) {
    return state.reason === 'not_yet'
      ? `Uploads open on ${new Date(state.opensAt).toLocaleString()}`
      : 'Uploads for this album are closed'
  }
  if (album.settings.require_name && !contributorName.trim()) return 'Please enter your name first'
  const max = album.settings.max_photos_per_guest
  if (max !== null && guestPhotoCount >= max) return `You can add up to ${max} photo${max > 1 ? 's' : ''} to this album`
  return null
}
