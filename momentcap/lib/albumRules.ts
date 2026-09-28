// Shared (client + server) album model and rules.

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const FREE_DAYS = 7
export const MAX_FILE_MB = 20
export const MAX_VIDEO_MB = 100
export const MAX_VIDEO_SECONDS = 60

export const EVENT_TYPES = [
  { id: 'wedding', label: 'Wedding', emoji: '💍', example: "Sarah & Tom's Wedding" },
  { id: 'birthday', label: 'Birthday', emoji: '🎂', example: "Lina's 30th Birthday" },
  { id: 'party', label: 'Party', emoji: '🎉', example: 'Summer Party' },
  { id: 'baby', label: 'Baby & baptism', emoji: '🍼', example: "Adam's Baptism" },
  { id: 'corporate', label: 'Company event', emoji: '💼', example: 'Team Offsite 2026' },
  { id: 'other', label: 'Something else', emoji: '📸', example: 'Our Weekend Trip' }
] as const

export type EventType = (typeof EVENT_TYPES)[number]['id']

export const eventTypeInfo = (id: string) => EVENT_TYPES.find((t) => t.id === id) ?? EVENT_TYPES[EVENT_TYPES.length - 1]

/** Suggested moments (album sections) per occasion */
export const DEFAULT_MOMENTS: Record<EventType, string[]> = {
  wedding: ['Ceremony', 'Cocktail', 'Dinner', 'Party'],
  birthday: ['Arrival', 'Cake', 'Party'],
  party: ['Early evening', 'Late night'],
  baby: ['Ceremony', 'Reception'],
  corporate: ['Talks', 'Workshops', 'Drinks'],
  other: []
}

/** Suggested photo challenges per occasion */
export const DEFAULT_CHALLENGES: Record<EventType, string[]> = {
  wedding: [
    'A selfie with the newlyweds',
    'The first dance',
    'The best dance move',
    'Someone crying happy tears',
    'Your table, all together',
    'The most beautiful detail of the decoration',
    'The funniest face of the night',
    'A photo with someone you just met'
  ],
  birthday: [
    'A selfie with the birthday star',
    'The cake before it disappears',
    'Blowing out the candles',
    'The funniest face',
    'The best gift reaction',
    'A group photo with everyone'
  ],
  party: ['The best outfit', 'A group photo', 'The funniest moment', 'The best dance move', 'A photo with the host', 'The last ones standing'],
  baby: ['The baby smiling', 'Three generations together', 'The cutest detail', 'The proud parents', 'A family portrait'],
  corporate: [
    'Your team, all together',
    'The best idea on a board',
    'A selfie with a new colleague',
    'The speaker in action',
    'The coffee break crew'
  ],
  other: ['A group photo', 'The funniest moment', 'The best view', 'A selfie with the organizer']
}

export const THEMES = [
  { id: 'sun', label: 'Sunshine', color: '#FFD700', strong: '#F5C400', soft: '#FFF6C7' },
  { id: 'rose', label: 'Rose', color: '#F7B7C3', strong: '#F29AAB', soft: '#FDE8EC' },
  { id: 'sage', label: 'Sage', color: '#B5D6BF', strong: '#9CC8A9', soft: '#E8F3EB' },
  { id: 'sky', label: 'Sky', color: '#A9CCF0', strong: '#8DBAEA', soft: '#E6F0FB' },
  { id: 'lilac', label: 'Lilac', color: '#CDBDF2', strong: '#B9A4EC', soft: '#F0EBFC' },
  { id: 'coral', label: 'Coral', color: '#FFB38A', strong: '#FF9C66', soft: '#FFEDE3' }
] as const

export type ThemeId = (typeof THEMES)[number]['id']
export const themeInfo = (id: string) => THEMES.find((t) => t.id === id) ?? THEMES[0]

export const REACTIONS = [
  { id: 'heart', emoji: '❤️' },
  { id: 'laugh', emoji: '😂' },
  { id: 'wow', emoji: '😮' }
] as const

export type ReactionId = (typeof REACTIONS)[number]['id']

export const FRAMES = ['none', 'polaroid', 'event'] as const
export type FrameId = (typeof FRAMES)[number]

// ---------------------------------------------------------------------------
// Stored records
// ---------------------------------------------------------------------------

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
  /** New guest photos and messages wait for the organizer's approval */
  moderation: boolean
  /** Guests can upload short videos */
  allow_videos: boolean
  /** Guests can leave a message in the guestbook */
  guestbook: boolean
  /** Guests can react to photos */
  reactions: boolean
}

export type Named = { id: string; name: string }

/** A photo challenge, optionally scheduled: hidden from guests before starts_at, closed after ends_at. */
export type Challenge = Named & { starts_at: string | null; ends_at: string | null }

export type ChallengeInput = { id?: string; name: string; starts_at?: string | null; ends_at?: string | null } | string

export type AlbumRecord = {
  id: string
  owner_id: string
  name: string
  event_type: EventType
  welcome_message: string
  event_date: string
  location: string
  qr_code: string
  is_paid: boolean
  created_at: string
  theme: ThemeId
  cover_path: string | null
  moments: Named[]
  challenges: Challenge[]
  /** Optional access code guests must type. Never sent to guests. */
  pin: string | null
  /** Emails of people who can manage the album with the owner */
  co_organizers: string[]
  settings: AlbumSettings
}

export type PhotoRecord = {
  id: string
  path: string
  kind: 'image' | 'video'
  guest_id: string
  contributor_name: string
  created_at: string
  status: 'approved' | 'pending'
  moment_id: string | null
  challenge_id: string | null
  favorite: boolean
  /** guest ids per reaction */
  reactions: Partial<Record<ReactionId, string[]>>
}

export type GuestbookEntry = {
  id: string
  guest_id: string
  name: string
  message: string
  created_at: string
  status: 'approved' | 'pending'
}

export type AlbumState = { photos: PhotoRecord[]; guestbook: GuestbookEntry[] }

export const emptyState = (): AlbumState => ({ photos: [], guestbook: [] })

// ---------------------------------------------------------------------------
// What the client sees
// ---------------------------------------------------------------------------

export type AppAlbum = Omit<AlbumRecord, 'pin' | 'cover_path'> & {
  has_pin: boolean
  cover_url: string | null
  /** Only for organizers */
  pin?: string | null
  /** Only filled in album lists (dashboard) */
  photo_count?: number
  role?: 'owner' | 'co_organizer'
  /** For guests: scheduled challenges not revealed yet */
  upcoming_challenges?: number
  next_challenge_at?: string | null
}

export type AppPhoto = {
  id: string
  url: string
  kind: 'image' | 'video'
  contributor_name: string
  guest_id: string
  created_at: string
  status: 'approved' | 'pending'
  moment_id: string | null
  challenge_id: string | null
  favorite: boolean
  reactions: Record<ReactionId, number>
  my_reactions: ReactionId[]
  mine: boolean
}

export type AppGuestbookEntry = Omit<GuestbookEntry, 'guest_id'> & { mine: boolean }

export type AlbumView =
  | {
      locked: false
      album: AppAlbum
      photos: AppPhoto[]
      guestbook: AppGuestbookEntry[]
      isOrganizer: boolean
      isOwner: boolean
    }
  | {
      locked: true
      album: Pick<AppAlbum, 'name' | 'event_type' | 'theme' | 'cover_url' | 'qr_code'>
    }

// ---------------------------------------------------------------------------
// Defaults and normalization
// ---------------------------------------------------------------------------

export const defaultSettings: AlbumSettings = {
  uploads_open_at: null,
  uploads_close_at: null,
  guests_can_view: true,
  max_photos_per_guest: null,
  require_name: false,
  moderation: false,
  allow_videos: true,
  guestbook: true,
  reactions: true
}

export function withDefaults(album: Partial<AlbumRecord> & Pick<AlbumRecord, 'id' | 'owner_id' | 'name' | 'qr_code'>): AlbumRecord {
  return {
    event_date: '',
    location: '',
    is_paid: false,
    created_at: new Date().toISOString(),
    cover_path: null,
    moments: [],
    pin: null,
    co_organizers: [],
    ...album,
    challenges: (album.challenges || []).map((c) => ({ ...c, starts_at: c.starts_at ?? null, ends_at: c.ends_at ?? null })),
    event_type: eventTypeInfo(album.event_type || 'other').id,
    welcome_message: album.welcome_message || '',
    theme: themeInfo(album.theme || 'sun').id,
    settings: { ...defaultSettings, ...(album.settings || {}) }
  }
}

export const cleanText = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

const cleanList = (v: unknown, max: number, newId: () => string, existing: Named[]): Named[] | undefined => {
  if (!Array.isArray(v)) return undefined
  return v
    .map((item) => {
      const name = cleanText(typeof item === 'string' ? item : (item as Named)?.name, 80)
      const id = typeof item === 'object' && item && typeof (item as Named).id === 'string' ? (item as Named).id : ''
      // Keep ids stable so photos stay linked to their moment/challenge
      const keep = existing.find((e) => e.id === id) || existing.find((e) => e.name === name)
      return name ? { id: keep?.id || newId(), name } : null
    })
    .filter((x): x is Named => Boolean(x))
    .slice(0, max)
}

const isoOrNull = (v: unknown) => (typeof v === 'string' && v && !Number.isNaN(Date.parse(v)) ? new Date(v).toISOString() : null)

function cleanChallenges(v: unknown, newId: () => string, existing: Challenge[]): Challenge[] | undefined {
  const named = cleanList(v, 20, newId, existing)
  if (!named || !Array.isArray(v)) return undefined
  // cleanList drops empty names, so match the timing back by position among kept items
  const kept = (v as ChallengeInput[]).filter((item) => cleanText(typeof item === 'string' ? item : item?.name, 80))
  return named.map((n, i) => {
    const src = kept[i]
    const starts_at = typeof src === 'object' ? isoOrNull(src.starts_at) : null
    let ends_at = typeof src === 'object' ? isoOrNull(src.ends_at) : null
    if (starts_at && ends_at && ends_at <= starts_at) ends_at = null
    return { ...n, starts_at, ends_at }
  })
}

export type ChallengeStatus = 'upcoming' | 'active' | 'ended'

export function challengeStatus(c: Pick<Challenge, 'starts_at' | 'ends_at'>, now = Date.now()): ChallengeStatus {
  if (c.starts_at && now < Date.parse(c.starts_at)) return 'upcoming'
  if (c.ends_at && now > Date.parse(c.ends_at)) return 'ended'
  return 'active'
}

export type AlbumEditable = Partial<
  Pick<AlbumRecord, 'name' | 'event_type' | 'welcome_message' | 'event_date' | 'location' | 'theme'>
> & {
  moments?: ({ id?: string; name: string } | string)[]
  challenges?: ChallengeInput[]
  pin?: string | null
}

/** Normalizes the fields an organizer can set when creating or editing an album. */
export function albumFields(input: Record<string, unknown>, newId: () => string, current?: AlbumRecord) {
  const out: Partial<AlbumRecord> = {}
  if (typeof input.name === 'string' && input.name.trim()) out.name = cleanText(input.name, 120)
  if (typeof input.event_type === 'string') out.event_type = eventTypeInfo(input.event_type).id
  if (typeof input.welcome_message === 'string') out.welcome_message = cleanText(input.welcome_message, 280)
  if (typeof input.location === 'string') out.location = cleanText(input.location, 120)
  if (typeof input.theme === 'string') out.theme = themeInfo(input.theme).id
  if (typeof input.event_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input.event_date)) out.event_date = input.event_date
  const moments = cleanList(input.moments, 12, newId, current?.moments || [])
  if (moments) out.moments = moments
  const challenges = cleanChallenges(input.challenges, newId, current?.challenges || [])
  if (challenges) out.challenges = challenges
  if ('pin' in input) {
    const pin = typeof input.pin === 'string' ? input.pin.trim().toUpperCase() : ''
    if (pin && !/^[A-Z0-9]{4,8}$/.test(pin)) throw new AppError('invalid_pin', 400)
    out.pin = pin || null
  }
  return out
}

/** Validates and normalizes settings coming from a form or request body. */
export function sanitizeSettings(input: Partial<AlbumSettings>, current: AlbumSettings): AlbumSettings {
  const date = (v: unknown) => (typeof v === 'string' && v && !Number.isNaN(Date.parse(v)) ? new Date(v).toISOString() : null)
  const next: AlbumSettings = { ...current }
  if ('uploads_open_at' in input) next.uploads_open_at = date(input.uploads_open_at)
  if ('uploads_close_at' in input) next.uploads_close_at = date(input.uploads_close_at)
  for (const key of ['guests_can_view', 'require_name', 'moderation', 'allow_videos', 'guestbook', 'reactions'] as const) {
    if (key in input) next[key] = Boolean(input[key])
  }
  if ('max_photos_per_guest' in input) {
    const n = Number(input.max_photos_per_guest)
    next.max_photos_per_guest =
      input.max_photos_per_guest === null || !Number.isFinite(n) || n < 1 ? null : Math.min(Math.floor(n), 1000)
  }
  if (next.uploads_open_at && next.uploads_close_at && next.uploads_close_at <= next.uploads_open_at) {
    throw new AppError('close_before_open', 400)
  }
  return next
}

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

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

export type AlbumStatus = 'open' | 'scheduled' | 'closed'

export function albumStatus(settings: AlbumSettings, now = Date.now()): AlbumStatus {
  const s = uploadState(settings, now)
  return s.open ? 'open' : s.reason === 'not_yet' ? 'scheduled' : 'closed'
}

/** Throws if a guest can't add this photo right now. Organizers are never blocked. */
export function checkUpload(
  album: Pick<AlbumRecord, 'settings'>,
  opts: { guestPhotoCount: number; contributorName: string; isOrganizer: boolean; kind?: 'image' | 'video' }
) {
  if (opts.isOrganizer) return
  const state = uploadState(album.settings)
  if (!state.open) {
    if (state.reason === 'not_yet') throw new AppError('uploads_not_open', 403, { opensAt: state.opensAt })
    throw new AppError('uploads_closed', 403)
  }
  if (album.settings.require_name && !opts.contributorName.trim()) throw new AppError('name_required', 400)
  if (opts.kind === 'video' && !album.settings.allow_videos) throw new AppError('videos_disabled', 403)
  const max = album.settings.max_photos_per_guest
  if (max !== null && opts.guestPhotoCount >= max) throw new AppError('limit_reached', 403, { max })
}

// ---------------------------------------------------------------------------
// Errors (codes are translated on the client)
// ---------------------------------------------------------------------------

export const ERROR_MESSAGES: Record<string, string> = {
  not_found: 'Album not found',
  forbidden: "You're not allowed to do that",
  owner_only: 'Only the album owner can do that',
  organizer_only: 'Only the organizer can do that',
  login_required: 'Please log in first',
  pin_required: 'This album is protected by a code',
  pin_wrong: 'Wrong code',
  invalid_pin: 'The code must be 4 to 8 letters or numbers',
  uploads_not_open: 'Uploads open on {opensAt}',
  uploads_closed: 'Uploads for this album are closed',
  name_required: 'Please enter your name first',
  limit_reached: 'You can add up to {max} photos to this album',
  videos_disabled: "Videos aren't allowed in this album",
  file_too_large: 'This file is too large',
  video_too_long: 'Videos can be up to {seconds} seconds long',
  bad_file: 'Only photos and videos can be uploaded',
  close_before_open: 'The closing time must be after the opening time',
  invalid_input: 'Please check the form',
  missing_name: 'Please give your album a name',
  missing_date: 'Please pick the event date',
  invalid_email: 'Please enter a valid email',
  weak_password: 'Password must be at least 6 characters',
  missing_user_name: 'Please enter your name',
  email_taken: 'An account with this email already exists',
  wrong_credentials: 'Wrong email or password',
  guestbook_disabled: 'The guestbook is turned off for this album',
  empty_message: 'Please write a message',
  reactions_disabled: 'Reactions are turned off for this album',
  payments_unavailable: 'Online payment is coming soon',
  storage_unavailable: 'Storage is not configured',
  server_error: 'Something went wrong. Please try again.'
}

export class AppError extends Error {
  constructor(
    public code: string,
    public status = 400,
    public params: Record<string, string | number> = {}
  ) {
    super(formatError(code, params))
  }
}

export function formatError(code: string, params: Record<string, string | number> = {}) {
  const template = ERROR_MESSAGES[code] || ERROR_MESSAGES.server_error
  return template.replace(/\{(\w+)\}/g, (_, k) => {
    const v = params[k]
    if (k === 'opensAt' && typeof v === 'string') return new Date(v).toLocaleString()
    return v === undefined ? '' : String(v)
  })
}
