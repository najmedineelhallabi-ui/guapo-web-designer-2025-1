// All album business rules, shared by the API (server mode) and the browser (demo mode).

import {
  AppError,
  albumFields,
  challengeStatus,
  checkUpload,
  cleanText,
  defaultSettings,
  emptyState,
  sanitizeSettings,
  withDefaults,
  MAX_FILE_MB,
  MAX_VIDEO_MB,
  REACTIONS,
  type AlbumEditable,
  type AlbumRecord,
  type AlbumSettings,
  type AlbumView,
  type AppAlbum,
  type AppGuestbookEntry,
  type AppPhoto,
  type PhotoRecord,
  type ReactionId
} from '../albumRules'
import type { Repo, UserRecord } from './repo'
import {
  atLeast,
  featuresFor,
  nextPeriodEnd,
  packInfo,
  subscriptionActive,
  subscriptionInfo,
  FEATURE_LABELS,
  TIER_ORDER,
  type Features,
  type PlanId,
  type Subscription,
  type Tier
} from '../pricing'

export type Viewer = { id: string; email: string; name: string }
export type Ctx = { user: Viewer | null; guestId: string | null; pin: string | null }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CODE_RE = /^[A-Z0-9]{4,16}$/

export const publicUser = (u: UserRecord): Viewer => ({ id: u.id, email: u.email, name: u.name })

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// What an album can use: its own pack, or everything when the owner has a Pro subscription
export type Access = { tier: Tier; features: Features; subscribed: boolean }
const accessCache = new WeakMap<AlbumRecord, Access>()

function accessFor(album: AlbumRecord, sub: Subscription | null): Access {
  const subscribed = subscriptionActive(sub)
  const tier: Tier = subscribed ? 'event' : album.tier
  return { tier, features: featuresFor(tier), subscribed }
}

/** Access computed when the album was loaded (falls back to the album's own pack). */
export const access = (album: AlbumRecord): Access => accessCache.get(album) ?? accessFor(album, null)

async function withAccess(repo: Repo, album: AlbumRecord, sub?: Subscription | null) {
  accessCache.set(album, accessFor(album, sub === undefined ? await repo.readSubscription(album.owner_id) : sub))
  return album
}

export function requireFeature(album: AlbumRecord, feature: keyof Features) {
  if (!access(album).features[feature]) {
    const pack = feature === 'planning' || feature === 'coOrganizers' ? 'event' : 'photos'
    throw new AppError('upgrade_required', 402, { feature: FEATURE_LABELS[feature] || feature, pack: packInfo(pack).name })
  }
}

export async function loadAlbum(repo: Repo, code: string) {
  const c = String(code || '').toUpperCase()
  if (!CODE_RE.test(c)) throw new AppError('not_found', 404)
  const album = await repo.readAlbum(c)
  if (!album) throw new AppError('not_found', 404)
  return withAccess(repo, withDefaults(album))
}

export const isOwner = (album: AlbumRecord, ctx: Ctx) => Boolean(ctx.user && ctx.user.id === album.owner_id)
export const isOrganizer = (album: AlbumRecord, ctx: Ctx) =>
  isOwner(album, ctx) || Boolean(ctx.user && album.co_organizers.includes(ctx.user.email.toLowerCase()))

export function requireOrganizer(album: AlbumRecord, ctx: Ctx) {
  if (!ctx.user) throw new AppError('login_required', 401)
  if (!isOrganizer(album, ctx)) throw new AppError('organizer_only', 403)
}

function requireOwner(album: AlbumRecord, ctx: Ctx) {
  if (!ctx.user) throw new AppError('login_required', 401)
  if (!isOwner(album, ctx)) throw new AppError('owner_only', 403)
}

/** Guests must know the album's code when one is set. */
export function checkPin(album: AlbumRecord, ctx: Ctx) {
  // The access code is a paid feature: it only applies once unlocked
  if (!album.pin || !access(album).features.pin || isOrganizer(album, ctx)) return
  if (!ctx.pin) throw new AppError('pin_required', 401)
  if (ctx.pin.trim().toUpperCase() !== album.pin) throw new AppError('pin_wrong', 401)
}

function requireGuestId(ctx: Ctx) {
  if (!ctx.guestId || !/^[0-9a-f-]{36}$/.test(ctx.guestId)) throw new AppError('invalid_input', 400)
  return ctx.guestId
}

export async function toAppAlbum(repo: Repo, album: AlbumRecord, organizer: boolean, acc: Access = access(album)): Promise<AppAlbum> {
  const { pin, cover_path, ...rest } = album
  const f = acc.features
  // Guests only see features the album has unlocked
  const challenges = organizer || f.challenges ? album.challenges : []
  // Guests don't see scheduled challenges before their time (it's a surprise)
  const upcoming = challenges.filter((c) => challengeStatus(c) === 'upcoming')
  const nextAt = upcoming.map((c) => c.starts_at!).sort()[0] || null
  const settings = organizer
    ? album.settings
    : { ...album.settings, moderation: album.settings.moderation && f.moderation, allow_videos: album.settings.allow_videos && f.videos }
  return {
    ...rest,
    settings,
    moments: organizer || f.moments ? album.moments : [],
    effective_tier: acc.tier,
    subscription_covered: acc.subscribed,
    features: f,
    is_paid: atLeast(acc.tier, 'photos'),
    challenges: organizer ? challenges : challenges.filter((c) => challengeStatus(c) !== 'upcoming'),
    upcoming_challenges: upcoming.length,
    next_challenge_at: nextAt,
    co_organizers: organizer ? album.co_organizers : [],
    has_pin: Boolean(pin),
    ...(organizer ? { pin } : {}),
    cover_url: cover_path ? await repo.fileUrl(cover_path) : null
  }
}

async function toAppPhoto(repo: Repo, p: PhotoRecord, guestId: string | null): Promise<AppPhoto> {
  const reactions = Object.fromEntries(REACTIONS.map((r) => [r.id, p.reactions[r.id]?.length || 0])) as Record<ReactionId, number>
  return {
    id: p.id,
    url: await repo.fileUrl(p.path),
    kind: p.kind,
    contributor_name: p.contributor_name,
    guest_id: p.guest_id,
    created_at: p.created_at,
    status: p.status,
    moment_id: p.moment_id,
    challenge_id: p.challenge_id,
    favorite: p.favorite,
    reactions,
    my_reactions: guestId ? REACTIONS.filter((r) => p.reactions[r.id]?.includes(guestId)).map((r) => r.id) : [],
    mine: Boolean(guestId && p.guest_id === guestId)
  }
}

// ---------------------------------------------------------------------------
// Accounts
// ---------------------------------------------------------------------------

export async function signUp(repo: Repo, input: { name?: string; email?: string; password?: string }) {
  const name = cleanText(input.name, 80)
  const email = cleanText(input.email, 200).toLowerCase()
  if (!name) throw new AppError('missing_user_name', 400)
  if (!EMAIL_RE.test(email)) throw new AppError('invalid_email', 400)
  if (typeof input.password !== 'string' || input.password.length < 6) throw new AppError('weak_password', 400)
  if (await repo.findUser(email)) throw new AppError('email_taken', 409)

  const user: UserRecord = {
    id: repo.newId(),
    email,
    name,
    password: await repo.hashPassword(input.password),
    created_at: new Date().toISOString()
  }
  await repo.saveUser(user)
  return publicUser(user)
}

export async function signIn(repo: Repo, input: { email?: string; password?: string }) {
  const email = cleanText(input.email, 200).toLowerCase()
  const user = email ? await repo.findUser(email) : null
  if (!user || typeof input.password !== 'string' || !(await repo.verifyPassword(input.password, user.password))) {
    throw new AppError('wrong_credentials', 401)
  }
  return publicUser(user)
}

// ---------------------------------------------------------------------------
// Albums
// ---------------------------------------------------------------------------

export async function listAlbums(repo: Repo, ctx: Ctx): Promise<AppAlbum[]> {
  if (!ctx.user) throw new AppError('login_required', 401)
  const owned = await repo.listIndex('owner', ctx.user.id)
  const shared = await repo.listIndex('co', ctx.user.email.toLowerCase())
  const codes = [...new Set([...owned, ...shared])]

  const albums = await Promise.all(
    codes.map(async (code) => {
      const raw = await repo.readAlbum(code)
      if (!raw) return null
      const album = await withAccess(repo, withDefaults(raw))
      if (!isOrganizer(album, ctx)) return null
      const state = await repo.readState(code)
      return {
        ...(await toAppAlbum(repo, album, true)),
        photo_count: state.photos.length,
        role: isOwner(album, ctx) ? ('owner' as const) : ('co_organizer' as const)
      }
    })
  )
  return albums.filter((a): a is NonNullable<typeof a> => Boolean(a)).sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export type NewAlbumInput = AlbumEditable & { settings?: Partial<AlbumSettings> }

export async function createAlbum(repo: Repo, ctx: Ctx, input: NewAlbumInput) {
  if (!ctx.user) throw new AppError('login_required', 401)
  const fields = albumFields(input as Record<string, unknown>, () => repo.newId())
  if (!fields.name) throw new AppError('missing_name', 400)
  if (!fields.event_date) throw new AppError('missing_date', 400)
  const settings = sanitizeSettings(input.settings || {}, defaultSettings)

  let code = ''
  do {
    code = repo.newId().split('-')[0].toUpperCase()
  } while (await repo.readAlbum(code))

  const album = withDefaults({
    ...fields,
    id: repo.newId(),
    owner_id: ctx.user.id,
    name: fields.name,
    qr_code: code,
    created_at: new Date().toISOString(),
    settings
  })
  await repo.writeAlbum(album)
  await repo.updateState(code, () => undefined)
  await repo.setIndex('owner', ctx.user.id, code, true)
  return toAppAlbum(repo, await withAccess(repo, album), true)
}

export async function getAlbum(repo: Repo, ctx: Ctx, code: string): Promise<AlbumView> {
  const album = await loadAlbum(repo, code)
  const organizer = isOrganizer(album, ctx)

  try {
    checkPin(album, ctx)
  } catch (err) {
    if (err instanceof AppError && err.code === 'pin_wrong') throw err
    return {
      locked: true,
      album: {
        name: album.name,
        event_type: album.event_type,
        theme: album.theme,
        qr_code: album.qr_code,
        cover_url: album.cover_path ? await repo.fileUrl(album.cover_path) : null
      }
    }
  }

  const state = await repo.readState(album.qr_code)
  const guestId = ctx.guestId
  const visiblePhotos = organizer
    ? state.photos
    : state.photos.filter((p) =>
        p.guest_id === guestId ? true : p.status === 'approved' && album.settings.guests_can_view
      )
  const visibleBook = organizer
    ? state.guestbook
    : album.settings.guestbook
      ? state.guestbook.filter((g) => g.status === 'approved' || g.guest_id === guestId)
      : []

  const photos = await Promise.all(
    [...visiblePhotos].sort((a, b) => a.created_at.localeCompare(b.created_at)).map((p) => toAppPhoto(repo, p, guestId))
  )
  const guestbook: AppGuestbookEntry[] = [...visibleBook]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map(({ guest_id, ...g }) => ({ ...g, mine: Boolean(guestId && guest_id === guestId) }))

  return {
    locked: false,
    album: await toAppAlbum(repo, album, organizer),
    photos,
    guestbook,
    isOrganizer: organizer,
    isOwner: isOwner(album, ctx)
  }
}

export async function updateAlbum(
  repo: Repo,
  ctx: Ctx,
  code: string,
  patch: AlbumEditable & { settings?: Partial<AlbumSettings> }
) {
  const album = await loadAlbum(repo, code)
  requireOrganizer(album, ctx)
  if ('pin' in patch) requireOwner(album, ctx)

  const fields = albumFields(patch as Record<string, unknown>, () => repo.newId(), album)
  const updated: AlbumRecord = {
    ...album,
    ...fields,
    settings: patch.settings ? sanitizeSettings(patch.settings, album.settings) : album.settings
  }
  await repo.writeAlbum(updated)
  return toAppAlbum(repo, updated, true, access(album))
}

export async function deleteAlbum(repo: Repo, ctx: Ctx, code: string) {
  const album = await loadAlbum(repo, code)
  requireOwner(album, ctx)
  await repo.deleteAlbumData(album.qr_code)
  await repo.setIndex('owner', album.owner_id, album.qr_code, false)
  for (const email of album.co_organizers) await repo.setIndex('co', email, album.qr_code, false)
  return { ok: true }
}

export async function setCover(repo: Repo, ctx: Ctx, code: string, file: Blob | null) {
  const album = await loadAlbum(repo, code)
  requireOrganizer(album, ctx)
  const old = album.cover_path
  let path: string | null = null
  if (file) {
    if (!file.type.startsWith('image/')) throw new AppError('bad_file', 400)
    if (file.size > MAX_FILE_MB * 1024 * 1024) throw new AppError('file_too_large', 413)
    path = `albums/${album.qr_code}/cover-${repo.newId()}.jpg`
    await repo.putFile(path, file, 'image/jpeg')
  }
  await repo.writeAlbum({ ...album, cover_path: path })
  if (old) await repo.deleteFiles([old]).catch(() => {})
  return { cover_url: path ? await repo.fileUrl(path) : null }
}

// ---------------------------------------------------------------------------
// Packs & subscriptions (payments are simulated until Stripe is connected)
// ---------------------------------------------------------------------------

/** Buys a one-shot pack for one album; the organizer only pays the difference. */
export async function purchasePack(repo: Repo, ctx: Ctx, code: string, packInput: string, allowDemoPayment: boolean) {
  const album = await loadAlbum(repo, code)
  requireOwner(album, ctx)
  const pack = packInput as Tier
  if (!TIER_ORDER.includes(pack) || pack === 'free') throw new AppError('invalid_plan', 400)
  if (atLeast(album.tier, pack)) throw new AppError('already_has_pack', 409)
  if (!allowDemoPayment) throw new AppError('payments_unavailable', 402)
  const updated = { ...album, tier: pack, is_paid: true }
  await repo.writeAlbum(updated)
  return toAppAlbum(repo, await withAccess(repo, updated), true)
}

export async function getAccount(repo: Repo, ctx: Ctx) {
  if (!ctx.user) throw new AppError('login_required', 401)
  const subscription = await repo.readSubscription(ctx.user.id)
  return { user: ctx.user, subscription, active: subscriptionActive(subscription) }
}

export async function subscribe(repo: Repo, ctx: Ctx, planInput: string, allowDemoPayment: boolean) {
  if (!ctx.user) throw new AppError('login_required', 401)
  const plan = subscriptionInfo(planInput)
  if (!plan) throw new AppError('invalid_plan', 400)
  if (!allowDemoPayment) throw new AppError('payments_unavailable', 402)
  const current = await repo.readSubscription(ctx.user.id)
  const now = new Date()
  const sub: Subscription = {
    plan: plan.id as PlanId,
    status: 'active',
    started_at: current && subscriptionActive(current) ? current.started_at : now.toISOString(),
    current_period_end: nextPeriodEnd(plan.id as PlanId, now)
  }
  await repo.writeSubscription(ctx.user.id, sub)
  return getAccount(repo, ctx)
}

/** Stops renewal; the subscription keeps working until the end of the paid period. */
export async function cancelSubscription(repo: Repo, ctx: Ctx) {
  if (!ctx.user) throw new AppError('login_required', 401)
  const sub = await repo.readSubscription(ctx.user.id)
  if (sub) await repo.writeSubscription(ctx.user.id, { ...sub, status: 'canceled' })
  return getAccount(repo, ctx)
}

export async function resumeSubscription(repo: Repo, ctx: Ctx) {
  if (!ctx.user) throw new AppError('login_required', 401)
  const sub = await repo.readSubscription(ctx.user.id)
  if (sub && subscriptionActive(sub)) await repo.writeSubscription(ctx.user.id, { ...sub, status: 'active' })
  return getAccount(repo, ctx)
}

// ---------------------------------------------------------------------------
// Co-organizers
// ---------------------------------------------------------------------------

export async function addCoOrganizer(repo: Repo, ctx: Ctx, code: string, emailInput: string) {
  const album = await loadAlbum(repo, code)
  requireOwner(album, ctx)
  requireFeature(album, 'coOrganizers')
  const email = cleanText(emailInput, 200).toLowerCase()
  if (!EMAIL_RE.test(email)) throw new AppError('invalid_email', 400)
  if (email === ctx.user!.email.toLowerCase() || album.co_organizers.includes(email)) return { co_organizers: album.co_organizers }
  const co_organizers = [...album.co_organizers, email].slice(0, 10)
  await repo.writeAlbum({ ...album, co_organizers })
  await repo.setIndex('co', email, album.qr_code, true)
  return { co_organizers }
}

export async function removeCoOrganizer(repo: Repo, ctx: Ctx, code: string, email: string) {
  const album = await loadAlbum(repo, code)
  requireOwner(album, ctx)
  const target = String(email || '').toLowerCase()
  const co_organizers = album.co_organizers.filter((e) => e !== target)
  await repo.writeAlbum({ ...album, co_organizers })
  await repo.setIndex('co', target, album.qr_code, false)
  return { co_organizers }
}

// ---------------------------------------------------------------------------
// Photos
// ---------------------------------------------------------------------------

export type PhotoMeta = { contributorName?: string; momentId?: string | null; challengeId?: string | null }

/** Validates an upload before the file is stored. */
/** Free albums hold a limited number of photos (organizers included). */
function checkPhotoLimit(album: AlbumRecord, count: number) {
  const max = access(album).features.photoLimit
  if (max !== null && count >= max) throw new AppError('photo_limit_free', 402, { max })
}

export async function prepareUpload(repo: Repo, ctx: Ctx, code: string, kind: 'image' | 'video', size: number, meta: PhotoMeta) {
  const album = await loadAlbum(repo, code)
  checkPin(album, ctx)
  const guestId = requireGuestId(ctx)
  if (size > (kind === 'video' ? MAX_VIDEO_MB : MAX_FILE_MB) * 1024 * 1024) throw new AppError('file_too_large', 413)
  if (kind === 'video') requireFeature(album, 'videos')
  const state = await repo.readState(album.qr_code)
  checkPhotoLimit(album, state.photos.length)
  checkUpload(album, {
    guestPhotoCount: state.photos.filter((p) => p.guest_id === guestId).length,
    contributorName: meta.contributorName || '',
    isOrganizer: isOrganizer(album, ctx),
    kind
  })
  const ext = kind === 'video' ? 'mp4' : 'jpg'
  return { album, guestId, path: `albums/${album.qr_code}/media/${repo.newId()}.${ext}` }
}

/** Records an uploaded file in the album (the file is already stored at `path`). */
export async function registerPhoto(
  repo: Repo,
  ctx: Ctx,
  album: AlbumRecord,
  guestId: string,
  path: string,
  kind: 'image' | 'video',
  meta: PhotoMeta
) {
  const organizer = isOrganizer(album, ctx)
  const f = access(album).features
  const record: PhotoRecord = {
    id: repo.newId(),
    path,
    kind,
    guest_id: guestId,
    contributor_name: cleanText(meta.contributorName, 40) || (organizer ? ctx.user!.name : '') || 'Guest',
    created_at: new Date().toISOString(),
    status: album.settings.moderation && f.moderation && !organizer ? 'pending' : 'approved',
    moment_id: f.moments && album.moments.some((m) => m.id === meta.momentId) ? meta.momentId! : null,
    // Guests can only tag a challenge while it's running
    challenge_id: f.challenges && album.challenges.some((c) => c.id === meta.challengeId && (organizer || challengeStatus(c) === 'active'))
      ? meta.challengeId!
      : null,
    favorite: false,
    reactions: {}
  }
  await repo.updateState(album.qr_code, (state) => {
    // Re-check the limits inside the atomic update
    checkPhotoLimit(album, state.photos.length)
    checkUpload(album, {
      guestPhotoCount: state.photos.filter((p) => p.guest_id === guestId).length,
      contributorName: record.contributor_name,
      isOrganizer: organizer,
      kind
    })
    state.photos.push(record)
  })
  return toAppPhoto(repo, record, guestId)
}

export async function addPhoto(repo: Repo, ctx: Ctx, code: string, file: Blob, kind: 'image' | 'video', meta: PhotoMeta) {
  if (kind === 'image' ? !file.type.startsWith('image/') : !file.type.startsWith('video/')) throw new AppError('bad_file', 400)
  const { album, guestId, path } = await prepareUpload(repo, ctx, code, kind, file.size, meta)
  await repo.putFile(path, file, kind === 'video' ? file.type || 'video/mp4' : 'image/jpeg')
  try {
    return await registerPhoto(repo, ctx, album, guestId, path, kind, meta)
  } catch (err) {
    await repo.deleteFiles([path]).catch(() => {})
    throw err
  }
}

export async function deletePhoto(repo: Repo, ctx: Ctx, code: string, photoId: string) {
  const album = await loadAlbum(repo, code)
  const organizer = isOrganizer(album, ctx)
  const removed = await repo.updateState(album.qr_code, (state) => {
    const photo = state.photos.find((p) => p.id === photoId)
    if (!photo) throw new AppError('not_found', 404)
    // Guests can remove their own photos
    if (!organizer && photo.guest_id !== ctx.guestId) throw new AppError('forbidden', 403)
    state.photos = state.photos.filter((p) => p.id !== photoId)
    return photo
  })
  await repo.deleteFiles([removed.path]).catch(() => {})
  return { ok: true }
}

export async function moderatePhoto(repo: Repo, ctx: Ctx, code: string, photoId: string, approve: boolean) {
  if (!approve) return deletePhoto(repo, ctx, code, photoId)
  const album = await loadAlbum(repo, code)
  requireOrganizer(album, ctx)
  await repo.updateState(album.qr_code, (state) => {
    const photo = state.photos.find((p) => p.id === photoId)
    if (!photo) throw new AppError('not_found', 404)
    photo.status = 'approved'
  })
  return { ok: true }
}

export async function approveAllPhotos(repo: Repo, ctx: Ctx, code: string) {
  const album = await loadAlbum(repo, code)
  requireOrganizer(album, ctx)
  await repo.updateState(album.qr_code, (state) => {
    state.photos.forEach((p) => (p.status = 'approved'))
    state.guestbook.forEach((g) => (g.status = 'approved'))
  })
  return { ok: true }
}

export async function toggleFavorite(repo: Repo, ctx: Ctx, code: string, photoId: string) {
  const album = await loadAlbum(repo, code)
  requireOrganizer(album, ctx)
  const favorite = await repo.updateState(album.qr_code, (state) => {
    const photo = state.photos.find((p) => p.id === photoId)
    if (!photo) throw new AppError('not_found', 404)
    photo.favorite = !photo.favorite
    return photo.favorite
  })
  return { favorite }
}

export async function react(repo: Repo, ctx: Ctx, code: string, photoId: string, reaction: string) {
  const album = await loadAlbum(repo, code)
  checkPin(album, ctx)
  if (!album.settings.reactions) throw new AppError('reactions_disabled', 403)
  const guestId = requireGuestId(ctx)
  if (!REACTIONS.some((r) => r.id === reaction)) throw new AppError('invalid_input', 400)
  const organizer = isOrganizer(album, ctx)
  const photo = await repo.updateState(album.qr_code, (state) => {
    const p = state.photos.find((x) => x.id === photoId)
    const visible = p && (organizer || p.guest_id === guestId || (p.status === 'approved' && album.settings.guests_can_view))
    if (!p || !visible) throw new AppError('not_found', 404)
    const list = p.reactions[reaction as ReactionId] || []
    p.reactions[reaction as ReactionId] = list.includes(guestId) ? list.filter((g) => g !== guestId) : [...list, guestId]
    return p
  })
  const view = await toAppPhoto(repo, photo, guestId)
  return { reactions: view.reactions, my_reactions: view.my_reactions }
}

// ---------------------------------------------------------------------------
// Guestbook
// ---------------------------------------------------------------------------

export async function addGuestbookEntry(repo: Repo, ctx: Ctx, code: string, input: { name?: string; message?: string }) {
  const album = await loadAlbum(repo, code)
  checkPin(album, ctx)
  if (!album.settings.guestbook) throw new AppError('guestbook_disabled', 403)
  const guestId = requireGuestId(ctx)
  const organizer = isOrganizer(album, ctx)
  const name = cleanText(input.name, 40) || (organizer ? ctx.user!.name : '')
  const message = cleanText(input.message, 500)
  if (!name) throw new AppError('name_required', 400)
  if (!message) throw new AppError('empty_message', 400)
  checkUpload(album, { guestPhotoCount: 0, contributorName: name, isOrganizer: organizer })

  const entry = {
    id: repo.newId(),
    guest_id: guestId,
    name,
    message,
    created_at: new Date().toISOString(),
    status: album.settings.moderation && access(album).features.moderation && !organizer ? ('pending' as const) : ('approved' as const)
  }
  await repo.updateState(album.qr_code, (state) => {
    if (state.guestbook.filter((g) => g.guest_id === guestId).length >= 20) throw new AppError('limit_reached', 403, { max: 20 })
    state.guestbook.push(entry)
  })
  const { guest_id, ...rest } = entry
  return { ...rest, mine: true }
}

export async function moderateGuestbookEntry(repo: Repo, ctx: Ctx, code: string, entryId: string, approve: boolean) {
  const album = await loadAlbum(repo, code)
  const organizer = isOrganizer(album, ctx)
  await repo.updateState(album.qr_code, (state) => {
    const entry = state.guestbook.find((g) => g.id === entryId)
    if (!entry) throw new AppError('not_found', 404)
    if (approve) {
      if (!organizer) throw new AppError('organizer_only', 403)
      entry.status = 'approved'
    } else {
      if (!organizer && entry.guest_id !== ctx.guestId) throw new AppError('forbidden', 403)
      state.guestbook = state.guestbook.filter((g) => g.id !== entryId)
    }
  })
  return { ok: true }
}

export { emptyState }
