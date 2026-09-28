// Event preparation: event page, RSVPs, table finder (public) and the
// organizer's plan (guests, seating, checklist, budget, vendors).

import { AppError, cleanText, type AppAlbum } from '../albumRules'
import {
  isSeatingTable,
  CHECKLIST_TEMPLATES,
  SECTION_LIMITS,
  daysBefore,
  normalizeName,
  sanitizeEventInfo,
  sanitizeItem,
  type EventInfo,
  type Guest,
  type Plan,
  type PlanItem,
  type Table,
  type PlanSection
} from '../planRules'
import type { Repo } from './repo'
import { access, checkPin, isOrganizer, loadAlbum, requireFeature, requireOrganizer, toAppAlbum, type Ctx } from './service'

const SECTIONS: PlanSection[] = ['guests', 'tables', 'tasks', 'budget', 'vendors']

/** The organizer sees each guest's key as their personal invitation key. */
const organizerGuest = ({ edit_key, ...g }: Guest): Guest => (edit_key ? { ...g, invite_key: edit_key } : g)
const publicPlan = (plan: Plan): Plan => ({ ...plan, guests: plan.guests.map(organizerGuest) })

// ---------------------------------------------------------------------------
// Organizer
// ---------------------------------------------------------------------------

export async function getPlan(repo: Repo, ctx: Ctx, code: string): Promise<{ album: AppAlbum; plan: Plan; isOwner: boolean }> {
  const album = await loadAlbum(repo, code)
  requireOrganizer(album, ctx)
  const plan = await repo.readPlan(album.qr_code)
  return { album: await toAppAlbum(repo, album, true), plan: publicPlan(plan), isOwner: ctx.user?.id === album.owner_id }
}

export async function updateEvent(repo: Repo, ctx: Ctx, code: string, patch: Partial<EventInfo>) {
  const album = await loadAlbum(repo, code)
  requireOrganizer(album, ctx)
  requireFeature(album, 'planning')
  const event = sanitizeEventInfo(patch || {}, album.event, () => repo.newId())
  await repo.writeAlbum({ ...album, event })
  return event
}

/** Creates album moments from the program titles (keeps existing ones). */
export async function programToMoments(repo: Repo, ctx: Ctx, code: string) {
  const album = await loadAlbum(repo, code)
  requireOrganizer(album, ctx)
  requireFeature(album, 'moments')
  const names = new Set(album.moments.map((m) => m.name.toLowerCase()))
  const moments = [...album.moments]
  for (const item of album.event.program) {
    if (!names.has(item.title.toLowerCase()) && moments.length < 12) {
      moments.push({ id: repo.newId(), name: item.title })
      names.add(item.title.toLowerCase())
    }
  }
  await repo.writeAlbum({ ...album, moments })
  return { moments }
}

function checkSection(section: unknown): PlanSection {
  if (!SECTIONS.includes(section as PlanSection)) throw new AppError('invalid_input', 400)
  return section as PlanSection
}

export async function savePlanItem(repo: Repo, ctx: Ctx, code: string, sectionInput: string, raw: Record<string, unknown>) {
  const section = checkSection(sectionInput)
  const album = await loadAlbum(repo, code)
  requireOrganizer(album, ctx)
  // The checklist is free; everything else in the planner is part of the Full event pack
  if (section !== 'tasks') requireFeature(album, 'planning')
  const saved = await repo.updatePlan(album.qr_code, (plan) => {
    const list = plan[section] as PlanItem[]
    const id = typeof raw?.id === 'string' && raw.id ? raw.id : ''
    const index = id ? list.findIndex((x) => x.id === id) : -1
    if (index < 0 && list.length >= SECTION_LIMITS[section]) throw new AppError('invalid_input', 400)
    const item = sanitizeItem(section, raw || {}, index >= 0 ? id : repo.newId(), index >= 0 ? list[index] : undefined)
    if (section === 'guests') {
      const g = item as Guest
      if (g.table_id && !plan.tables.some((t) => t.id === g.table_id && isSeatingTable(t))) g.table_id = null
    }
    if (index >= 0) list[index] = item
    else list.push(item)
    return item
  })
  if (section === 'guests') return organizerGuest(saved as Guest)
  return saved
}

/** Gives every guest a personal invitation key (their private link to the invitation). */
export async function ensureInviteKeys(repo: Repo, ctx: Ctx, code: string) {
  const album = await loadAlbum(repo, code)
  requireOrganizer(album, ctx)
  requireFeature(album, 'planning')
  return repo.updatePlan(album.qr_code, (plan) => {
    for (const g of plan.guests) g.edit_key ||= repo.newId()
    return { keys: Object.fromEntries(plan.guests.map((g) => [g.id, g.edit_key as string])) as Record<string, string> }
  })
}

/** Records that personal invitations went out (email, WhatsApp, SMS or copied link). */
export async function markInvited(repo: Repo, ctx: Ctx, code: string, guestIds: string[]) {
  const album = await loadAlbum(repo, code)
  requireOrganizer(album, ctx)
  requireFeature(album, 'planning')
  const ids = new Set(Array.isArray(guestIds) ? guestIds.map(String) : [])
  const now = new Date().toISOString()
  return repo.updatePlan(album.qr_code, (plan) => {
    for (const g of plan.guests) if (ids.has(g.id)) g.invited_at = now
    return { invited_at: now }
  })
}

export async function deletePlanItem(repo: Repo, ctx: Ctx, code: string, sectionInput: string, id: string) {
  const section = checkSection(sectionInput)
  const album = await loadAlbum(repo, code)
  requireOrganizer(album, ctx)
  if (section !== 'tasks') requireFeature(album, 'planning')
  await repo.updatePlan(album.qr_code, (plan) => {
    ;(plan[section] as PlanItem[]) = (plan[section] as PlanItem[]).filter((x) => x.id !== id)
    // Deleting a table frees its guests
    if (section === 'tables') plan.guests.forEach((g) => g.table_id === id && (g.table_id = null))
  })
  return { ok: true }
}

export type GuestImportRow = { name?: string; group?: string; email?: string; phone?: string; party_size?: number | string; table?: string }

/** Adds guests in bulk (CSV/paste). A "table" column creates tables by name. */
export async function importGuests(repo: Repo, ctx: Ctx, code: string, rows: GuestImportRow[]) {
  const album = await loadAlbum(repo, code)
  requireOrganizer(album, ctx)
  requireFeature(album, 'planning')
  if (!Array.isArray(rows)) throw new AppError('invalid_input', 400)
  return repo.updatePlan(album.qr_code, (plan) => {
    let added = 0
    const known = new Set(plan.guests.map((g) => normalizeName(g.name)))
    for (const row of rows.slice(0, 1000)) {
      const name = cleanText(row?.name, 80)
      if (!name || known.has(normalizeName(name)) || plan.guests.length >= SECTION_LIMITS.guests) continue
      let tableId: string | null = null
      const tableName = cleanText(row.table, 60)
      if (tableName) {
        let table = plan.tables.find((t) => isSeatingTable(t) && t.name.toLowerCase() === tableName.toLowerCase())
        if (!table && plan.tables.length < SECTION_LIMITS.tables) {
          table = { id: repo.newId(), name: tableName, seats: 8 }
          plan.tables.push(table)
        }
        tableId = table?.id || null
      }
      plan.guests.push(sanitizeItem('guests', { ...row, name, table_id: tableId }, repo.newId()) as Guest)
      known.add(normalizeName(name))
      added++
    }
    return { added }
  })
}

export async function setBudgetTotal(repo: Repo, ctx: Ctx, code: string, total: number | null) {
  const album = await loadAlbum(repo, code)
  requireOrganizer(album, ctx)
  requireFeature(album, 'planning')
  const n = Number(total)
  const value = total === null || !Number.isFinite(n) || n <= 0 ? null : Math.round(n * 100) / 100
  await repo.updatePlan(album.qr_code, (plan) => {
    plan.budget_total = value
  })
  return { budget_total: value }
}

/** Adds the suggested checklist for this occasion, with due dates counted back from the event. */
export async function seedChecklist(repo: Repo, ctx: Ctx, code: string) {
  const album = await loadAlbum(repo, code)
  requireOrganizer(album, ctx)
  return repo.updatePlan(album.qr_code, (plan) => {
    const titles = new Set(plan.tasks.map((t) => t.title.toLowerCase()))
    const today = new Date().toISOString().slice(0, 10)
    for (const t of CHECKLIST_TEMPLATES[album.event_type]) {
      if (titles.has(t.title.toLowerCase())) continue
      const due = album.event_date ? daysBefore(album.event_date, t.daysBefore) : null
      // Suggested dates already in the past become "today" instead of starting out late
      plan.tasks.push({ id: repo.newId(), title: t.title, category: t.category, done: false, due: due && due < today ? today : due })
    }
    plan.checklist_seeded = true
    return { tasks: plan.tasks }
  })
}

// ---------------------------------------------------------------------------
// Public: event page, RSVP, table finder
// ---------------------------------------------------------------------------

export type MyRsvp = Pick<Guest, 'id' | 'name' | 'rsvp' | 'party_size' | 'diet' | 'note'>

export type EventPage =
  | { locked: true; album: Pick<AppAlbum, 'name' | 'event_type' | 'theme' | 'cover_url' | 'qr_code'> }
  | {
      locked: false
      album: Pick<AppAlbum, 'name' | 'event_type' | 'theme' | 'cover_url' | 'qr_code' | 'welcome_message' | 'event_date' | 'location' | 'event'>
      /** False when the album doesn't have the Full event pack */
      available: boolean
      rsvpOpen: boolean
      tableFinder: boolean
      myRsvp: MyRsvp | null
      /** The guest's own table, when they opened their personal invitation and are seated */
      myTable: { id: string; name: string; mates: string[] } | null
      /** Room plan to point out their table */
      layout: Table[]
      isOrganizer: boolean
    }

const rsvpOpen = (event: EventInfo) => {
  if (!event.rsvp_enabled) return false
  if (!event.rsvp_deadline) return true
  const [y, m, d] = event.rsvp_deadline.split('-').map(Number)
  return Date.now() < new Date(y, m - 1, d + 1).getTime()
}

const toMyRsvp = (g: Guest): MyRsvp => ({ id: g.id, name: g.name, rsvp: g.rsvp, party_size: g.party_size, diet: g.diet, note: g.note })

export async function getEventPage(repo: Repo, ctx: Ctx, code: string, editKey?: string | null): Promise<EventPage> {
  const album = await loadAlbum(repo, code)
  const cover_url = album.cover_path ? await repo.fileUrl(album.cover_path) : null
  const base = { name: album.name, event_type: album.event_type, theme: album.theme, cover_url, qr_code: album.qr_code }
  try {
    checkPin(album, ctx)
  } catch (err) {
    if (err instanceof AppError && err.code === 'pin_wrong') throw err
    return { locked: true, album: base }
  }
  const available = access(album).features.planning
  const plan = await repo.readPlan(album.qr_code)
  const mine = editKey ? plan.guests.find((g) => g.edit_key && g.edit_key === editKey) : null
  // Shown only when the organizer turned on "find your table"
  const table = available && album.event.table_finder && mine && mine.rsvp !== 'no' && mine.table_id ? plan.tables.find((t) => t.id === mine.table_id) : undefined
  const myTable = table
    ? {
        id: table.id,
        name: table.name,
        mates: plan.guests.filter((g) => g.table_id === table.id && g.id !== mine?.id && g.rsvp !== 'no').map((g) => g.name).sort()
      }
    : null
  return {
    locked: false,
    album: { ...base, welcome_message: album.welcome_message, event_date: album.event_date, location: album.location, event: album.event },
    available,
    rsvpOpen: available && rsvpOpen(album.event),
    tableFinder: available && album.event.table_finder && plan.guests.some((g) => g.table_id),
    myRsvp: mine ? toMyRsvp(mine) : null,
    myTable,
    layout: myTable ? plan.tables.map(({ id, name, seats, shape, kind, x, y }) => ({ id, name, seats, shape, kind, x: x ?? null, y: y ?? null })) : [],
    isOrganizer: isOrganizer(album, ctx)
  }
}

export type RsvpInput = { name?: string; attending?: boolean; party_size?: number; diet?: string; note?: string; email?: string }

export async function submitRsvp(repo: Repo, ctx: Ctx, code: string, input: RsvpInput, editKey?: string | null) {
  const album = await loadAlbum(repo, code)
  checkPin(album, ctx)
  requireFeature(album, 'planning')
  if (!rsvpOpen(album.event)) throw new AppError('rsvp_closed', 403)
  const name = cleanText(input?.name, 80)
  if (!name) throw new AppError('missing_user_name', 400)
  const partySize = Math.min(Math.max(Math.floor(Number(input.party_size)) || 1, 1), album.event.rsvp_max_party)

  return repo.updatePlan(album.qr_code, (plan) => {
    // 1. The guest's own earlier answer, 2. an invited guest with this name nobody answered for yet, 3. a new guest
    let guest = editKey ? plan.guests.find((g) => g.edit_key && g.edit_key === editKey) : undefined
    guest ??= plan.guests.find((g) => !g.answered_at && normalizeName(g.name) === normalizeName(name))
    if (!guest) {
      if (plan.guests.length >= SECTION_LIMITS.guests) throw new AppError('invalid_input', 400)
      guest = sanitizeItem('guests', { name }, repo.newId()) as Guest
      guest.source = 'rsvp'
      plan.guests.push(guest)
    }
    guest.name = guest.source === 'rsvp' ? name : guest.name
    guest.rsvp = input.attending ? 'yes' : 'no'
    guest.party_size = input.attending ? partySize : guest.party_size
    guest.diet = album.event.rsvp_ask_diet ? cleanText(input.diet, 120) : guest.diet
    guest.note = cleanText(input.note, 300)
    if (input.email) guest.email = cleanText(input.email, 200).toLowerCase()
    guest.responded_at = new Date().toISOString()
    guest.answered_at = guest.responded_at
    guest.edit_key ||= repo.newId()
    return { rsvp: toMyRsvp(guest), editKey: guest.edit_key }
  })
}

export async function findTable(repo: Repo, ctx: Ctx, code: string, query: string) {
  const album = await loadAlbum(repo, code)
  checkPin(album, ctx)
  requireFeature(album, 'planning')
  if (!album.event.table_finder) throw new AppError('forbidden', 403)
  const q = normalizeName(String(query || ''))
  if (q.length < 2) return { results: [], layout: [] }
  const tokens = q.split(' ')
  const plan = await repo.readPlan(album.qr_code)
  const results = plan.guests
    .filter((g) => g.table_id && g.rsvp !== 'no')
    .filter((g) => {
      const words = normalizeName(g.name).split(' ')
      return tokens.every((t) => words.some((w) => w.startsWith(t)))
    })
    .slice(0, 5)
    .map((g) => {
      const table = plan.tables.find((t) => t.id === g.table_id)
      return { name: g.name, table: table?.name || '', tableId: table?.id || '' }
    })
    .filter((r) => r.table)
  // The room plan (names and positions only) so guests can see where their table is
  const layout = results.length
    ? plan.tables.map((t) => ({ id: t.id, name: t.name, seats: t.seats, shape: t.shape, kind: t.kind, x: t.x ?? null, y: t.y ?? null }))
    : []
  return { results, layout }
}
