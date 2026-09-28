// Event preparation model: public event info (stored on the album) and the
// organizer's private plan (guests, seating, checklist, budget, vendors).

import { cleanText, type EventType } from './albumRules'

// ---------------------------------------------------------------------------
// Public event info (invitation page)
// ---------------------------------------------------------------------------

export type ProgramItem = { id: string; time: string; title: string; details: string }

export type EventInfo = {
  venue_name: string
  address: string
  /** "HH:MM" on the event date */
  start_time: string
  dress_code: string
  details: string
  program: ProgramItem[]
  rsvp_enabled: boolean
  /** yyyy-mm-dd */
  rsvp_deadline: string | null
  rsvp_ask_diet: boolean
  /** Max people per answer (the guest + companions) */
  rsvp_max_party: number
  /** Guests can look up their table by name */
  table_finder: boolean
}

export const defaultEventInfo: EventInfo = {
  venue_name: '',
  address: '',
  start_time: '',
  dress_code: '',
  details: '',
  program: [],
  rsvp_enabled: true,
  rsvp_deadline: null,
  rsvp_ask_diet: true,
  rsvp_max_party: 4,
  table_finder: true
}

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function sanitizeEventInfo(input: Partial<EventInfo>, current: EventInfo, newId: () => string): EventInfo {
  const next = { ...current }
  if (typeof input.venue_name === 'string') next.venue_name = cleanText(input.venue_name, 120)
  if (typeof input.address === 'string') next.address = cleanText(input.address, 240)
  if (typeof input.start_time === 'string') next.start_time = TIME_RE.test(input.start_time) ? input.start_time : ''
  if (typeof input.dress_code === 'string') next.dress_code = cleanText(input.dress_code, 120)
  if (typeof input.details === 'string') next.details = cleanText(input.details, 2000)
  if ('rsvp_enabled' in input) next.rsvp_enabled = Boolean(input.rsvp_enabled)
  if ('rsvp_ask_diet' in input) next.rsvp_ask_diet = Boolean(input.rsvp_ask_diet)
  if ('table_finder' in input) next.table_finder = Boolean(input.table_finder)
  if ('rsvp_deadline' in input) next.rsvp_deadline = typeof input.rsvp_deadline === 'string' && DATE_RE.test(input.rsvp_deadline) ? input.rsvp_deadline : null
  if ('rsvp_max_party' in input) {
    const n = Math.floor(Number(input.rsvp_max_party))
    next.rsvp_max_party = Number.isFinite(n) ? Math.min(Math.max(n, 1), 20) : current.rsvp_max_party
  }
  if (Array.isArray(input.program)) {
    next.program = input.program
      .map((p) => ({
        id: typeof p?.id === 'string' && p.id ? p.id : newId(),
        time: typeof p?.time === 'string' && TIME_RE.test(p.time) ? p.time : '',
        title: cleanText(p?.title, 100),
        details: cleanText(p?.details, 300)
      }))
      .filter((p) => p.title)
      .sort((a, b) => (a.time || '99').localeCompare(b.time || '99'))
      .slice(0, 30)
  }
  return next
}

// ---------------------------------------------------------------------------
// Private plan
// ---------------------------------------------------------------------------

export type RsvpStatus = 'pending' | 'yes' | 'no'

export type Guest = {
  id: string
  name: string
  group: string
  email: string
  phone: string
  /** Seats needed (the guest + companions) */
  party_size: number
  rsvp: RsvpStatus
  diet: string
  note: string
  table_id: string | null
  source: 'organizer' | 'rsvp'
  responded_at: string | null
  /** Last time the guest answered the invitation themselves */
  answered_at?: string | null
  /** Lets a guest edit their own RSVP from the same browser */
  edit_key?: string
}

export type Table = { id: string; name: string; seats: number }
export type Task = { id: string; title: string; due: string | null; done: boolean; category: string }
export type BudgetItem = { id: string; category: string; label: string; planned: number; paid: number }
export type Vendor = { id: string; category: string; name: string; contact: string; phone: string; email: string; price: number; deposit: number; notes: string }

export type Plan = {
  guests: Guest[]
  tables: Table[]
  tasks: Task[]
  budget: BudgetItem[]
  vendors: Vendor[]
  budget_total: number | null
  /** Set once the default checklist has been added */
  checklist_seeded: boolean
}

export const emptyPlan = (): Plan => ({
  guests: [],
  tables: [],
  tasks: [],
  budget: [],
  vendors: [],
  budget_total: null,
  checklist_seeded: false
})

export type PlanSection = 'guests' | 'tables' | 'tasks' | 'budget' | 'vendors'
export type PlanItem = Guest | Table | Task | BudgetItem | Vendor

const money = (v: unknown) => {
  const n = Math.round(Number(v) * 100) / 100
  return Number.isFinite(n) && n >= 0 ? Math.min(n, 10_000_000) : 0
}
const dateOrNull = (v: unknown) => (typeof v === 'string' && DATE_RE.test(v) ? v : null)

/** Normalizes an item coming from the organizer's forms. */
export function sanitizeItem(section: PlanSection, raw: Record<string, unknown>, id: string, existing?: PlanItem): PlanItem {
  switch (section) {
    case 'guests': {
      const prev = existing as Guest | undefined
      const rsvp = raw.rsvp === 'yes' || raw.rsvp === 'no' ? raw.rsvp : raw.rsvp === 'pending' ? 'pending' : prev?.rsvp || 'pending'
      return {
        id,
        name: cleanText(raw.name, 80) || prev?.name || 'Guest',
        group: cleanText(raw.group ?? prev?.group, 60),
        email: cleanText(raw.email ?? prev?.email, 200).toLowerCase(),
        phone: cleanText(raw.phone ?? prev?.phone, 40),
        party_size: Math.min(Math.max(Math.floor(Number(raw.party_size ?? prev?.party_size ?? 1)) || 1, 1), 20),
        rsvp,
        diet: cleanText(raw.diet ?? prev?.diet, 120),
        note: cleanText(raw.note ?? prev?.note, 300),
        table_id: raw.table_id === null || raw.table_id === '' ? null : typeof raw.table_id === 'string' ? raw.table_id : prev?.table_id ?? null,
        source: prev?.source || 'organizer',
        responded_at: rsvp !== (prev?.rsvp || 'pending') ? new Date().toISOString() : prev?.responded_at ?? null,
        answered_at: prev?.answered_at ?? null,
        ...(prev?.edit_key ? { edit_key: prev.edit_key } : {})
      }
    }
    case 'tables':
      return {
        id,
        name: cleanText(raw.name, 60) || 'Table',
        seats: Math.min(Math.max(Math.floor(Number(raw.seats)) || 8, 1), 100)
      }
    case 'tasks':
      return {
        id,
        title: cleanText(raw.title, 140) || 'Task',
        due: dateOrNull(raw.due),
        done: Boolean(raw.done),
        category: cleanText(raw.category, 40)
      }
    case 'budget':
      return {
        id,
        category: cleanText(raw.category, 40) || 'Other',
        label: cleanText(raw.label, 100),
        planned: money(raw.planned),
        paid: money(raw.paid)
      }
    case 'vendors':
      return {
        id,
        category: cleanText(raw.category, 40) || 'Other',
        name: cleanText(raw.name, 100) || 'Vendor',
        contact: cleanText(raw.contact, 100),
        phone: cleanText(raw.phone, 40),
        email: cleanText(raw.email, 200),
        price: money(raw.price),
        deposit: money(raw.deposit),
        notes: cleanText(raw.notes, 1000)
      }
  }
}

export const SECTION_LIMITS: Record<PlanSection, number> = { guests: 1000, tables: 150, tasks: 300, budget: 200, vendors: 100 }

// ---------------------------------------------------------------------------
// Suggestions
// ---------------------------------------------------------------------------

export const BUDGET_CATEGORIES = ['Venue', 'Catering', 'Drinks', 'Music & DJ', 'Photo & video', 'Decoration & flowers', 'Outfits', 'Invitations', 'Cake', 'Transport', 'Accommodation', 'Rings', 'Other']
export const VENDOR_CATEGORIES = ['Venue', 'Caterer', 'Photographer', 'Videographer', 'DJ / Band', 'Florist', 'Decorator', 'Cake', 'Hair & makeup', 'Transport', 'Officiant', 'Other']

/** Default checklist: tasks with how many days before the event they're due. */
export const CHECKLIST_TEMPLATES: Record<EventType, { title: string; daysBefore: number; category: string }[]> = {
  wedding: [
    { title: 'Set the budget', daysBefore: 365, category: 'Planning' },
    { title: 'Draw up the guest list', daysBefore: 330, category: 'Guests' },
    { title: 'Book the venue', daysBefore: 300, category: 'Venue' },
    { title: 'Book the caterer', daysBefore: 270, category: 'Food' },
    { title: 'Book the photographer', daysBefore: 270, category: 'Vendors' },
    { title: 'Book the DJ or band', daysBefore: 240, category: 'Vendors' },
    { title: 'Choose the outfits', daysBefore: 210, category: 'Outfits' },
    { title: 'Send save-the-dates', daysBefore: 180, category: 'Guests' },
    { title: 'Order the rings', daysBefore: 120, category: 'Outfits' },
    { title: 'Send the invitations (Moment caps event page)', daysBefore: 90, category: 'Guests' },
    { title: 'Choose the menu and the cake', daysBefore: 75, category: 'Food' },
    { title: 'Plan the decoration and flowers', daysBefore: 60, category: 'Decoration' },
    { title: 'Follow up on missing RSVPs', daysBefore: 30, category: 'Guests' },
    { title: 'Make the seating plan', daysBefore: 21, category: 'Guests' },
    { title: 'Confirm the schedule with every vendor', daysBefore: 14, category: 'Vendors' },
    { title: 'Print the QR cards for the tables', daysBefore: 7, category: 'Moment caps' },
    { title: 'Prepare the final payments', daysBefore: 3, category: 'Budget' },
    { title: 'Set up the live slideshow on the big screen', daysBefore: 0, category: 'Moment caps' }
  ],
  birthday: [
    { title: 'Pick the date and the place', daysBefore: 60, category: 'Planning' },
    { title: 'Make the guest list', daysBefore: 45, category: 'Guests' },
    { title: 'Send the invitations (Moment caps event page)', daysBefore: 30, category: 'Guests' },
    { title: 'Order the cake', daysBefore: 14, category: 'Food' },
    { title: 'Plan food and drinks', daysBefore: 10, category: 'Food' },
    { title: 'Buy the decoration', daysBefore: 7, category: 'Decoration' },
    { title: 'Print the QR cards', daysBefore: 3, category: 'Moment caps' }
  ],
  party: [
    { title: 'Pick the date and the place', daysBefore: 45, category: 'Planning' },
    { title: 'Send the invitations (Moment caps event page)', daysBefore: 21, category: 'Guests' },
    { title: 'Book music or a DJ', daysBefore: 21, category: 'Vendors' },
    { title: 'Plan food and drinks', daysBefore: 7, category: 'Food' },
    { title: 'Print the QR cards', daysBefore: 2, category: 'Moment caps' }
  ],
  baby: [
    { title: 'Pick the date and the place', daysBefore: 90, category: 'Planning' },
    { title: 'Make the guest list', daysBefore: 60, category: 'Guests' },
    { title: 'Send the invitations (Moment caps event page)', daysBefore: 45, category: 'Guests' },
    { title: 'Book the caterer or restaurant', daysBefore: 45, category: 'Food' },
    { title: 'Order the favors and decoration', daysBefore: 21, category: 'Decoration' },
    { title: 'Print the QR cards', daysBefore: 5, category: 'Moment caps' }
  ],
  corporate: [
    { title: 'Define goals and budget', daysBefore: 120, category: 'Planning' },
    { title: 'Book the venue', daysBefore: 90, category: 'Venue' },
    { title: 'Confirm the speakers', daysBefore: 60, category: 'Program' },
    { title: 'Send the invitations (Moment caps event page)', daysBefore: 45, category: 'Guests' },
    { title: 'Book catering', daysBefore: 30, category: 'Food' },
    { title: 'Prepare badges and signage', daysBefore: 10, category: 'Logistics' },
    { title: 'Print the QR cards', daysBefore: 3, category: 'Moment caps' }
  ],
  other: [
    { title: 'Pick the date and the place', daysBefore: 60, category: 'Planning' },
    { title: 'Make the guest list', daysBefore: 45, category: 'Guests' },
    { title: 'Send the invitations (Moment caps event page)', daysBefore: 30, category: 'Guests' },
    { title: 'Print the QR cards', daysBefore: 3, category: 'Moment caps' }
  ]
}

export const DEFAULT_PROGRAM: Record<EventType, { time: string; title: string }[]> = {
  wedding: [
    { time: '14:00', title: 'Ceremony' },
    { time: '16:00', title: 'Cocktail' },
    { time: '19:30', title: 'Dinner' },
    { time: '22:30', title: 'Party' }
  ],
  birthday: [
    { time: '19:00', title: 'Welcome drinks' },
    { time: '21:00', title: 'Cake' }
  ],
  party: [{ time: '20:00', title: 'Doors open' }],
  baby: [
    { time: '11:00', title: 'Ceremony' },
    { time: '13:00', title: 'Lunch' }
  ],
  corporate: [
    { time: '09:00', title: 'Welcome coffee' },
    { time: '09:30', title: 'Talks' },
    { time: '12:30', title: 'Lunch' }
  ],
  other: []
}

/** yyyy-mm-dd, `days` before `date` */
export function daysBefore(date: string, days: number) {
  const [y, m, d] = date.split('-').map(Number)
  if (!y || !m || !d) return null
  const dt = new Date(Date.UTC(y, m - 1, d - days))
  return dt.toISOString().slice(0, 10)
}

// ---------------------------------------------------------------------------
// Summaries
// ---------------------------------------------------------------------------

export function guestStats(guests: Guest[]) {
  const yes = guests.filter((g) => g.rsvp === 'yes')
  return {
    invited: guests.length,
    yes: yes.length,
    no: guests.filter((g) => g.rsvp === 'no').length,
    pending: guests.filter((g) => g.rsvp === 'pending').length,
    people: yes.reduce((n, g) => n + g.party_size, 0),
    seated: yes.filter((g) => g.table_id).reduce((n, g) => n + g.party_size, 0)
  }
}

export function budgetStats(plan: Pick<Plan, 'budget' | 'budget_total'>) {
  const planned = plan.budget.reduce((n, b) => n + b.planned, 0)
  const paid = plan.budget.reduce((n, b) => n + b.paid, 0)
  return { planned, paid, toPay: Math.max(0, planned - paid), remaining: plan.budget_total === null ? null : plan.budget_total - planned }
}

export const normalizeName = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
