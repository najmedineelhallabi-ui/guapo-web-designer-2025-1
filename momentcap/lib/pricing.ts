// Pricing catalog and feature access. Change names, prices and what each
// pack includes here — the whole app (pricing page, locks, checkout) follows.

export type Tier = 'free' | 'photos' | 'event'

export const TIER_ORDER: Tier[] = ['free', 'photos', 'event']
export const tierRank = (t: Tier) => TIER_ORDER.indexOf(t)
export const atLeast = (t: Tier, min: Tier) => tierRank(t) >= tierRank(min)

// ---------------------------------------------------------------------------
// One-shot packs (paid once, for one event)
// ---------------------------------------------------------------------------

export type Pack = { id: Tier; name: string; price: number; tagline: string; highlights: string[] }

export const PACKS: Pack[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    tagline: 'Try it for a small event',
    highlights: ['Photo album with QR code', 'Up to 100 photos, kept 7 days', 'Guestbook & reactions', 'Checklist']
  },
  {
    id: 'photos',
    name: 'Photos',
    price: 19,
    tagline: 'The complete photo album',
    highlights: ['Unlimited photos & videos, kept forever', 'No watermark', 'Live slideshow, challenges, moments', 'Approval, access code, ZIP & PDF book']
  },
  {
    id: 'event',
    name: 'Full event',
    price: 39,
    tagline: 'Prepare and live the whole event',
    highlights: ['Everything in Photos', 'Online invitation with RSVP', 'Guest list, seating plan, find your table', 'Budget, vendors, co-organizers']
  }
]

export const packInfo = (t: Tier) => PACKS.find((p) => p.id === t) ?? PACKS[0]

/** What an organizer pays to go from `current` to `target` (they only pay the difference). */
export const upgradePrice = (current: Tier, target: Tier) => Math.max(0, packInfo(target).price - packInfo(current).price)

// ---------------------------------------------------------------------------
// Subscriptions: every event of the account gets the plan's pack.
// Each plan is billed monthly or yearly (yearly = 10 months).
// ---------------------------------------------------------------------------

export type PlanId = 'starter' | 'pro' | 'business'
export type Billing = 'month' | 'year'

export type SubscriptionPlan = {
  id: PlanId
  name: string
  monthly: number
  yearly: number
  /** Pack every event of the account gets */
  tier: Tier
  /** Team members who can manage all the account's events */
  teamSize: number
  audience: string
  highlights: string[]
}

export const SUBSCRIPTIONS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 9,
    yearly: 90,
    tier: 'photos',
    teamSize: 0,
    audience: 'Photographers, DJs, entertainers',
    highlights: ['Photos pack on every event', 'Unlimited events', 'No watermark, live slideshow, ZIP & PDF']
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 29,
    yearly: 290,
    tier: 'event',
    teamSize: 0,
    audience: 'Wedding & event planners',
    highlights: ['Full event pack on every event', 'Unlimited events', 'Invitations, RSVP, seating, budget, vendors']
  },
  {
    id: 'business',
    name: 'Business',
    monthly: 59,
    yearly: 590,
    tier: 'event',
    teamSize: 5,
    audience: 'Agencies, venues, caterers',
    highlights: ['Everything in Pro', 'Team of 5: they manage all your events', 'One account for the whole company']
  }
]

export const subscriptionInfo = (id: string) => SUBSCRIPTIONS.find((s) => s.id === id) ?? null
export const planPrice = (plan: SubscriptionPlan, billing: Billing) => (billing === 'year' ? plan.yearly : plan.monthly)

export type Subscription = {
  plan: PlanId
  billing: Billing
  status: 'active' | 'canceled'
  started_at: string
  /** End of the paid period; a canceled subscription keeps working until then */
  current_period_end: string
  /** Emails of team members (Business) */
  team: string[]
}

/** Reads older stored subscriptions ("pro_monthly" / "pro_yearly") too. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeSubscription(raw: Record<string, any> | null): Subscription | null {
  if (!raw || !raw.plan || !raw.current_period_end) return null
  const legacy = raw.plan === 'pro_monthly' || raw.plan === 'pro_yearly'
  const plan = (legacy ? 'pro' : raw.plan) as PlanId
  if (!subscriptionInfo(plan)) return null
  return {
    plan,
    billing: raw.billing || (raw.plan === 'pro_yearly' ? 'year' : 'month'),
    status: raw.status === 'canceled' ? 'canceled' : 'active',
    started_at: raw.started_at || new Date().toISOString(),
    current_period_end: raw.current_period_end,
    team: Array.isArray(raw.team) ? raw.team : []
  }
}

export function subscriptionActive(sub: Subscription | null, now = Date.now()) {
  return Boolean(sub && Date.parse(sub.current_period_end) > now)
}

export function nextPeriodEnd(billing: Billing, from = new Date()) {
  const d = new Date(from)
  if (billing === 'year') d.setFullYear(d.getFullYear() + 1)
  else d.setMonth(d.getMonth() + 1)
  return d.toISOString()
}

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------

export const FREE_PHOTO_LIMIT = 100

export type Features = {
  /** Free albums add the logo on photos */
  watermark: boolean
  /** Max photos + videos in the album (null = unlimited) */
  photoLimit: number | null
  /** Free albums are kept 7 days */
  expires: boolean
  videos: boolean
  challenges: boolean
  moments: boolean
  moderation: boolean
  pin: boolean
  slideshow: boolean
  downloads: boolean
  /** Invitation, RSVP, guests, seating, budget, vendors */
  planning: boolean
  coOrganizers: boolean
}

export function featuresFor(tier: Tier): Features {
  const photos = atLeast(tier, 'photos')
  const event = atLeast(tier, 'event')
  return {
    watermark: !photos,
    photoLimit: photos ? null : FREE_PHOTO_LIMIT,
    expires: !photos,
    videos: photos,
    challenges: photos,
    moments: photos,
    moderation: photos,
    pin: photos,
    slideshow: photos,
    downloads: photos,
    planning: event,
    coOrganizers: event
  }
}

/** Smallest pack that unlocks a feature (for "Unlock with …" buttons). */
export function packFor(feature: keyof Features): Tier {
  return feature === 'planning' || feature === 'coOrganizers' ? 'event' : 'photos'
}

export const FEATURE_LABELS: Record<string, string> = {
  videos: 'Videos',
  challenges: 'Photo challenges',
  moments: 'Moments',
  moderation: 'Photo approval',
  pin: 'Access code',
  slideshow: 'Live slideshow',
  downloads: 'ZIP & PDF downloads',
  planning: 'Event preparation',
  coOrganizers: 'Co-organizers'
}

/** Rows of the comparison table on the pricing page */
export const COMPARISON: { label: string; free: string | boolean; photos: string | boolean; event: string | boolean }[] = [
  { label: 'Photo album with QR code', free: true, photos: true, event: true },
  { label: 'Photos', free: `Up to ${FREE_PHOTO_LIMIT}`, photos: 'Unlimited', event: 'Unlimited' },
  { label: 'Kept', free: '7 days', photos: 'Forever', event: 'Forever' },
  { label: 'Moment caps watermark', free: 'Yes', photos: 'No', event: 'No' },
  { label: 'Guestbook & reactions', free: true, photos: true, event: true },
  { label: 'Videos', free: false, photos: true, event: true },
  { label: 'Photo challenges & moments', free: false, photos: true, event: true },
  { label: 'Live slideshow', free: false, photos: true, event: true },
  { label: 'Photo approval & access code', free: false, photos: true, event: true },
  { label: 'ZIP & PDF photo book', free: false, photos: true, event: true },
  { label: 'Checklist', free: true, photos: true, event: true },
  { label: 'Online invitation & RSVP', free: false, photos: false, event: true },
  { label: 'Guest list & seating plan', free: false, photos: false, event: true },
  { label: 'Find your table', free: false, photos: false, event: true },
  { label: 'Budget & vendors', free: false, photos: false, event: true },
  { label: 'Co-organizers', free: false, photos: false, event: true }
]

export const euroPrice = (n: number) => (n === 0 ? '€0' : `€${n % 1 ? n.toFixed(2) : n}`)
