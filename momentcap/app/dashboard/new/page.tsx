'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'
import Toggle from '@/components/Toggle'
import ThemePicker from '@/components/ThemePicker'
import { PackCards } from '@/components/pricing/Cards'
import { getAccount } from '@/lib/api'
import { atLeast, packInfo, subscriptionInfo, type Tier } from '@/lib/pricing'
import ChallengeEditor, { fromDrafts, type ChallengeDraft } from '@/components/ChallengeEditor'
import { useRequireAuth } from '@/lib/useAuth'
import { createAlbum } from '@/lib/api'
import { DEFAULT_CHALLENGES, DEFAULT_MOMENTS, EVENT_TYPES, eventTypeInfo, type EventType, type ThemeId } from '@/lib/albumRules'
import { eventDayWindow, formatDateTime, fromLocalInput } from '@/lib/dates'

const inputClass =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand'

const welcomeExamples: Record<EventType, string> = {
  wedding: 'Thank you for celebrating with us! Share your favourite moments of our day 💛',
  birthday: 'Thanks for coming! Add your photos of the party 🎉',
  party: 'Drop your best shots from tonight!',
  baby: 'Thank you for being part of this special day. Share your photos with us!',
  corporate: 'Share your photos from the event with the whole team.',
  other: 'Share your photos with everyone!'
}

type Timing = 'anytime' | 'event_day' | 'custom'

const STEPS = ['Occasion', 'Details', 'Challenges', 'Guest rules', 'Pack'] as const

export default function NewAlbumPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useRequireAuth('/dashboard/new')

  const [step, setStep] = useState(0)
  const [eventType, setEventType] = useState<EventType | null>(null)
  const [name, setName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [location, setLocation] = useState('')
  const [welcome, setWelcome] = useState('')
  const [timing, setTiming] = useState<Timing>('anytime')
  const [openAt, setOpenAt] = useState('')
  const [closeAt, setCloseAt] = useState('')
  const [guestsCanView, setGuestsCanView] = useState(true)
  const [requireName, setRequireName] = useState(false)
  const [maxPerGuest, setMaxPerGuest] = useState('')
  const [theme, setTheme] = useState<ThemeId>('sun')
  const [moderation, setModeration] = useState(false)
  const [useMoments, setUseMoments] = useState(true)
  const [challenges, setChallenges] = useState<ChallengeDraft[] | null>(null)
  const [creating, setCreating] = useState(false)
  const [pack, setPack] = useState<Tier>('free')
  // Pack every event already gets from the user's subscription
  const [subTier, setSubTier] = useState<Tier>('free')
  const isPro = subTier === 'event'

  // Pro subscribers don't need to pick a pack
  useEffect(() => {
    getAccount()
      .then((a) => setSubTier(a.active && a.subscription ? subscriptionInfo(a.subscription.plan)?.tier || 'free' : 'free'))
      .catch(() => {})
  }, [])
  const [error, setError] = useState('')

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-ink" />
      </div>
    )
  }

  const type = eventTypeInfo(eventType || 'other')
  const window_ = timing === 'event_day' && eventDate ? eventDayWindow(eventDate) : null

  const pickType = (id: EventType) => {
    setEventType(id)
    setStep(1)
  }

  const handleCreate = async () => {
    setCreating(true)
    setError('')
    try {
      const uploads =
        timing === 'event_day' && window_
          ? { uploads_open_at: window_.open, uploads_close_at: window_.close }
          : timing === 'custom'
            ? { uploads_open_at: fromLocalInput(openAt), uploads_close_at: fromLocalInput(closeAt) }
            : { uploads_open_at: null, uploads_close_at: null }

      const { album } = await createAlbum({
        name,
        event_type: type.id,
        welcome_message: welcome,
        event_date: eventDate,
        location,
        theme,
        moments: useMoments ? [...DEFAULT_MOMENTS[type.id]] : [],
        challenges: fromDrafts(challenges || []),
        settings: {
          ...uploads,
          moderation,
          guests_can_view: guestsCanView,
          require_name: requireName,
          max_photos_per_guest: maxPerGuest ? Number(maxPerGuest) : null
        }
      })
      router.push(
        atLeast(subTier, pack) ? `/album/${album.qr_code}/share?created=1` : `/album/${album.qr_code}/upgrade?pack=${pack}&created=1`
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the album')
      setCreating(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader cta={false} />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <Link href="/dashboard" className="text-sm font-semibold text-ink-soft hover:text-ink">
          ← My albums
        </Link>

        {/* Progress */}
        <ol className="mt-5 flex gap-2" aria-label="Steps">
          {STEPS.map((label, i) => (
            <li key={label} className="flex-1">
              <div className={`h-1.5 rounded-full ${i <= step ? 'bg-ink' : 'bg-line'}`} />
              <p className={`mt-2 text-xs font-semibold ${i === step ? 'text-ink' : 'text-ink-soft'}`}>{label}</p>
            </li>
          ))}
        </ol>

        {/* Step 1: occasion */}
        {step === 0 && (
          <section className="mt-8">
            <h1 className="text-3xl font-extrabold tracking-tight">What&apos;s the occasion?</h1>
            <p className="mt-1 text-ink-soft">We&apos;ll suggest the right wording for your guests.</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {EVENT_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => pickType(t.id)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 bg-white px-3 py-6 font-semibold transition hover:border-ink ${
                    eventType === t.id ? 'border-ink' : 'border-line'
                  }`}
                >
                  <span className="text-4xl" aria-hidden="true">{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Step 2: details */}
        {step === 1 && (
          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault()
              // First visit: start from a few ideas for this occasion
              if (challenges === null) {
                setChallenges(DEFAULT_CHALLENGES[type.id].slice(0, 3).map((name) => ({ name, start: '', end: '', scheduled: false })))
              }
              setStep(2)
            }}
          >
            <h1 className="text-3xl font-extrabold tracking-tight">
              <span aria-hidden="true">{type.emoji} </span>About your {type.label.toLowerCase()}
            </h1>
            <div className="mt-6 space-y-5 rounded-3xl border border-line bg-white p-6 sm:p-8">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold">Album name</label>
                <input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120}
                  placeholder={`e.g. ${type.example}`} className={inputClass} autoFocus />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="date" className="mb-2 block text-sm font-semibold">Event date</label>
                  <input id="date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="location" className="mb-2 block text-sm font-semibold">
                    Location <span className="font-normal text-ink-soft">(optional)</span>
                  </label>
                  <input id="location" value={location} onChange={(e) => setLocation(e.target.value)} maxLength={120}
                    placeholder="e.g. Brussels" className={inputClass} />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <label htmlFor="welcome" className="text-sm font-semibold">
                    Message for your guests <span className="font-normal text-ink-soft">(optional)</span>
                  </label>
                  {!welcome && (
                    <button type="button" onClick={() => setWelcome(welcomeExamples[type.id])} className="text-xs font-semibold underline underline-offset-2">
                      Use a suggestion
                    </button>
                  )}
                </div>
                <textarea id="welcome" value={welcome} onChange={(e) => setWelcome(e.target.value)} maxLength={280} rows={3}
                  placeholder={welcomeExamples[type.id]} className={inputClass} />
                <p className="mt-1 text-right text-xs text-ink-soft">{welcome.length}/280</p>
              </div>
              <div>
                <p className="mb-3 text-sm font-semibold">Album color</p>
                <ThemePicker value={theme} onChange={setTheme} />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setStep(0)} className="rounded-full border border-line bg-white px-6 py-3.5 font-semibold transition hover:border-ink">
                Back
              </button>
              <button type="submit" className="flex-1 rounded-full bg-ink py-3.5 font-semibold text-white transition hover:bg-black">
                Next
              </button>
            </div>
          </form>
        )}

        {/* Step 3: challenges */}
        {step === 2 && (
          <section className="mt-8">
            <h1 className="text-3xl font-extrabold tracking-tight">🎯 Photo challenges</h1>
            <p className="mt-1 text-ink-soft">
              Fun missions for your guests. Write your own or pick ideas, and schedule them to reveal a surprise challenge at the right moment.
            </p>
            <div className="mt-6 rounded-3xl border border-line bg-white p-5 sm:p-6">
              <ChallengeEditor items={challenges || []} onChange={setChallenges} suggestions={DEFAULT_CHALLENGES[type.id]} eventDate={eventDate} />
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setStep(1)} className="rounded-full border border-line bg-white px-6 py-3.5 font-semibold transition hover:border-ink">
                Back
              </button>
              <button onClick={() => setStep(3)} className="flex-1 rounded-full bg-ink py-3.5 font-semibold text-white transition hover:bg-black">
                {challenges && challenges.length > 0 ? 'Next' : 'Skip challenges'}
              </button>
            </div>
          </section>
        )}

        {/* Step 4: rules */}
        {step === 3 && (
          <section className="mt-8">
            <h1 className="text-3xl font-extrabold tracking-tight">Guest rules</h1>
            <p className="mt-1 text-ink-soft">You can change all of this later in the album settings.</p>

            <div className="mt-6 rounded-3xl border border-line bg-white p-6 sm:p-8">
              <h2 className="font-bold">When can guests add photos?</h2>
              <div className="mt-4 space-y-2">
                {([
                  ['anytime', 'Anytime', 'Open from now on, no end time.'],
                  ['event_day', 'On the event day', window_ ? `${formatDateTime(window_.open)} → ${formatDateTime(window_.close)}` : 'From midnight until 6am the next morning.'],
                  ['custom', 'Custom times', 'Pick exactly when uploads open and close.']
                ] as const).map(([id, label, hint]) => (
                  <label
                    key={id}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition ${timing === id ? 'border-ink' : 'border-line hover:border-ink-soft'}`}
                  >
                    <input type="radio" name="timing" checked={timing === id} onChange={() => setTiming(id)} className="mt-1 accent-ink" />
                    <span>
                      <span className="block font-semibold">{label}</span>
                      <span className="block text-sm text-ink-soft">{hint}</span>
                    </span>
                  </label>
                ))}
              </div>
              {timing === 'custom' && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="open" className="mb-2 block text-sm font-semibold">Opens at</label>
                    <input id="open" type="datetime-local" value={openAt} onChange={(e) => setOpenAt(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="close" className="mb-2 block text-sm font-semibold">Closes at</label>
                    <input id="close" type="datetime-local" value={closeAt} onChange={(e) => setCloseAt(e.target.value)} className={inputClass} />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-3xl border border-line bg-white px-6 pt-2 pb-2 sm:px-8">
              <div className="divide-y divide-line">
                <Toggle checked={guestsCanView} onChange={setGuestsCanView} label="Guests can see all photos"
                  hint="Turn off to keep the gallery private: guests only see what they added." />
                <Toggle checked={requireName} onChange={setRequireName} label="Guests must enter their name"
                  hint="So you always know who took each photo." />
                <Toggle checked={moderation} onChange={setModeration} label="Approve photos before they appear"
                  hint="Nothing shows up until you say so." />
                {DEFAULT_MOMENTS[type.id].length > 0 && (
                  <Toggle checked={useMoments} onChange={setUseMoments} label="Split the album into moments"
                    hint={DEFAULT_MOMENTS[type.id].join(' · ')} />
                )}
                <div className="flex items-start justify-between gap-4 py-4">
                  <label htmlFor="max">
                    <span className="block font-semibold">Photo limit per guest</span>
                    <span className="block text-sm text-ink-soft">Empty = unlimited.</span>
                  </label>
                  <input id="max" type="number" min={1} max={1000} inputMode="numeric" value={maxPerGuest}
                    onChange={(e) => setMaxPerGuest(e.target.value)} placeholder="∞"
                    className="w-24 rounded-xl border border-line px-3 py-2 text-center focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand" />
                </div>
              </div>
            </div>

            {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <div className="mt-6 flex gap-3">
              <button onClick={() => setStep(2)} className="rounded-full border border-line bg-white px-6 py-3.5 font-semibold transition hover:border-ink">
                Back
              </button>
              <button onClick={() => setStep(4)} className="flex-1 rounded-full bg-ink py-3.5 font-semibold text-white transition hover:bg-black">
                Next
              </button>
            </div>
          </section>
        )}

        {/* Step 5: pack */}
        {step === 4 && (
          <section className="mt-8">
            <h1 className="text-3xl font-extrabold tracking-tight">Choose your pack</h1>
            {isPro ? (
              <p className="mt-3 rounded-2xl bg-brand p-5 font-semibold">You&apos;re Pro 🎉 — this event gets every feature, nothing to pay.</p>
            ) : (
              <>
                <p className="mt-1 text-ink-soft">
                  {subTier === 'photos'
                    ? 'Your Starter subscription includes the Photos pack. Add the Full event pack to this event if you need it.'
                    : 'Pay once for this event. You can start free and upgrade anytime — you only pay the difference.'}
                </p>
                <div className="mt-6">
                  <PackCards current={subTier === 'free' ? undefined : subTier} selected={pack} onSelect={setPack} />
                </div>
              </>
            )}

            {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <div className="mt-6 flex gap-3">
              <button onClick={() => setStep(3)} className="rounded-full border border-line bg-white px-6 py-3.5 font-semibold transition hover:border-ink">
                Back
              </button>
              <button onClick={handleCreate} disabled={creating}
                className="flex-1 rounded-full bg-brand py-3.5 font-bold transition hover:bg-brand-strong disabled:opacity-50">
                {creating ? 'Creating…' : isPro || atLeast(subTier, pack) ? 'Create album' : `Create & pay — ${packInfo(pack).name}`}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
