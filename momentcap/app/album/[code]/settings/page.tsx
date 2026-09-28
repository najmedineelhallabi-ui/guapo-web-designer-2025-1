'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'
import Toggle from '@/components/Toggle'
import ListEditor from '@/components/ListEditor'
import ChallengeEditor, { fromDrafts, toDrafts, type ChallengeDraft } from '@/components/ChallengeEditor'
import ThemePicker from '@/components/ThemePicker'
import ThemeScope from '@/components/album/ThemeScope'
import { ImageIcon, XIcon } from '@/components/Icons'
import {
  addCoOrganizer,
  deleteAlbum,
  getAlbum,
  removeCoOrganizer,
  setCover,
  updateAlbum,
  type AppAlbum
} from '@/lib/api'
import {
  DEFAULT_CHALLENGES,
  DEFAULT_MOMENTS,
  EVENT_TYPES,
  uploadState,
  type AlbumSettings,
  type EventType,
  type ThemeId
} from '@/lib/albumRules'
import { fromLocalInput, toLocalInput } from '@/lib/dates'
import { processImage } from '@/lib/photoUtils'

const inputClass =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand'
const card = 'rounded-3xl border border-line bg-white p-6 sm:p-8'

type Item = { id?: string; name: string }

export default function AlbumSettingsPage() {
  const params = useParams()
  const code = String(params.code || '').toUpperCase()
  const router = useRouter()
  const coverInput = useRef<HTMLInputElement>(null)

  const [album, setAlbum] = useState<AppAlbum | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [allowed, setAllowed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState('')

  const [name, setName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [location, setLocation] = useState('')
  const [eventType, setEventType] = useState<EventType>('other')
  const [welcome, setWelcome] = useState('')
  const [theme, setTheme] = useState<ThemeId>('sun')
  const [openAt, setOpenAt] = useState('')
  const [closeAt, setCloseAt] = useState('')
  const [maxPerGuest, setMaxPerGuest] = useState('')
  const [flags, setFlags] = useState<Pick<AlbumSettings, 'guests_can_view' | 'require_name' | 'moderation' | 'allow_videos' | 'guestbook' | 'reactions'>>({
    guests_can_view: true,
    require_name: false,
    moderation: false,
    allow_videos: true,
    guestbook: true,
    reactions: true
  })
  const [moments, setMoments] = useState<Item[]>([])
  const [challenges, setChallenges] = useState<ChallengeDraft[]>([])
  const [pin, setPin] = useState('')
  const [coEmail, setCoEmail] = useState('')

  const fill = (a: AppAlbum) => {
    setAlbum(a)
    setName(a.name)
    setEventDate(a.event_date)
    setLocation(a.location)
    setEventType(a.event_type)
    setWelcome(a.welcome_message)
    setTheme(a.theme)
    setOpenAt(toLocalInput(a.settings.uploads_open_at))
    setCloseAt(toLocalInput(a.settings.uploads_close_at))
    setMaxPerGuest(a.settings.max_photos_per_guest ? String(a.settings.max_photos_per_guest) : '')
    const { guests_can_view, require_name, moderation, allow_videos, guestbook, reactions } = a.settings
    setFlags({ guests_can_view, require_name, moderation, allow_videos, guestbook, reactions })
    setMoments(a.moments)
    setChallenges(toDrafts(a.challenges))
    setPin(a.pin || '')
  }

  useEffect(() => {
    getAlbum(code)
      .then((v) => {
        if (!v.locked) {
          fill(v.album)
          setAllowed(v.isOrganizer)
          setIsOwner(v.isOwner)
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load the album'))
      .finally(() => setLoading(false))
  }, [code])

  const save = async (overrides: Partial<AlbumSettings> = {}) => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const updated = await updateAlbum(code, {
        name,
        event_date: eventDate,
        location,
        event_type: eventType,
        welcome_message: welcome,
        theme,
        moments,
        challenges: fromDrafts(challenges),
        ...(isOwner ? { pin: pin || null } : {}),
        settings: {
          uploads_open_at: fromLocalInput(openAt),
          uploads_close_at: fromLocalInput(closeAt),
          max_photos_per_guest: maxPerGuest ? Number(maxPerGuest) : null,
          ...flags,
          ...overrides
        }
      })
      fill(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  const changeCover = async (file: File | null) => {
    setBusy('cover')
    setError('')
    try {
      const processed = file ? await processImage(file, { frame: 'none', frameColor: '', albumName: '', watermark: false }) : null
      const { cover_url } = await setCover(code, processed)
      setAlbum((a) => (a ? { ...a, cover_url } : a))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the cover')
    } finally {
      setBusy('')
    }
  }

  const addCo = async () => {
    setBusy('co')
    setError('')
    try {
      const { co_organizers } = await addCoOrganizer(code, coEmail)
      setAlbum((a) => (a ? { ...a, co_organizers } : a))
      setCoEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add this person')
    } finally {
      setBusy('')
    }
  }

  const removeCo = async (email: string) => {
    try {
      const { co_organizers } = await removeCoOrganizer(code, email)
      setAlbum((a) => (a ? { ...a, co_organizers } : a))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove this person')
    }
  }

  const removeAlbum = async () => {
    if (!album) return
    const typed = prompt(`This deletes the album and all its photos for everyone.\n\nType the album code ${album.qr_code} to confirm.`)
    if (typed?.trim().toUpperCase() !== album.qr_code) return
    setBusy('delete')
    try {
      await deleteAlbum(code)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete the album')
      setBusy('')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-ink" />
      </div>
    )
  }

  if (!album || !allowed) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader cta={false} />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-sm rounded-3xl border border-line bg-white p-8 text-center">
            <h1 className="text-xl font-bold">{album ? 'Only the organizers can change settings' : 'Album not found'}</h1>
            <p className="mt-2 text-ink-soft">Log in with the account that manages this album.</p>
            <Link href={`/login?next=/album/${code}/settings`} className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-white">
              Log in
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const state = uploadState(album.settings)
  const flag = (key: keyof typeof flags) => ({ checked: flags[key], onChange: (v: boolean) => setFlags((f) => ({ ...f, [key]: v })) })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader cta={false} />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <Link href={`/album/${album.qr_code}`} className="text-sm font-semibold text-ink-soft hover:text-ink">
          ← Back to album
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Album settings</h1>
        <p className="mt-1 text-ink-soft">
          {album.name}
          {album.is_paid ? ' · ⭐ Premium' : ''}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            save()
          }}
          className="mt-8 space-y-6"
        >
          {/* Details */}
          <section className={card}>
            <h2 className="text-lg font-bold">Details</h2>
            <div className="mt-5 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold">Album name</label>
                <input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} className={inputClass} />
              </div>
              <div>
                <label htmlFor="type" className="mb-2 block text-sm font-semibold">Occasion</label>
                <select id="type" value={eventType} onChange={(e) => setEventType(e.target.value as EventType)} className={inputClass}>
                  {EVENT_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="date" className="mb-2 block text-sm font-semibold">Event date</label>
                  <input id="date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="location" className="mb-2 block text-sm font-semibold">Location</label>
                  <input id="location" value={location} onChange={(e) => setLocation(e.target.value)} maxLength={120} className={inputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="welcome" className="mb-2 block text-sm font-semibold">Message for your guests</label>
                <textarea id="welcome" value={welcome} onChange={(e) => setWelcome(e.target.value)} maxLength={280} rows={3} placeholder="Shown at the top of the album" className={inputClass} />
              </div>
            </div>
          </section>

          {/* Look */}
          <section className={card}>
            <h2 className="text-lg font-bold">Look</h2>
            <p className="mt-1 text-sm text-ink-soft">Cover photo and color shown to your guests.</p>
            <ThemeScope theme={theme} className="mt-5">
              <div className="relative overflow-hidden rounded-2xl border border-line">
                {album.cover_url ? (
                  <img src={album.cover_url} alt="Cover" className="h-40 w-full object-cover" />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-brand-soft text-ink-soft">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
                <div className="h-2 bg-brand" />
              </div>
            </ThemeScope>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => coverInput.current?.click()} disabled={busy === 'cover'} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                {busy === 'cover' ? 'Uploading…' : album.cover_url ? 'Change cover' : 'Add a cover photo'}
              </button>
              {album.cover_url && (
                <button type="button" onClick={() => changeCover(null)} disabled={busy === 'cover'} className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold">
                  Remove
                </button>
              )}
              <input
                ref={coverInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) changeCover(f)
                  e.target.value = ''
                }}
              />
            </div>
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold">Color</p>
              <ThemePicker value={theme} onChange={setTheme} />
            </div>
          </section>

          {/* Timing */}
          <section className={card}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">When guests can upload</h2>
                <p className="mt-1 text-sm text-ink-soft">Leave empty for no limit. Guests see a countdown before it opens.</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${state.open ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-700'}`}>
                {state.open ? 'Open now' : state.reason === 'not_yet' ? 'Not open yet' : 'Closed'}
              </span>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="open" className="mb-2 block text-sm font-semibold">Opens at</label>
                <input id="open" type="datetime-local" value={openAt} onChange={(e) => setOpenAt(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="close" className="mb-2 block text-sm font-semibold">Closes at</label>
                <input id="close" type="datetime-local" value={closeAt} onChange={(e) => setCloseAt(e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {state.open ? (
                <button type="button" disabled={saving} onClick={() => save({ uploads_open_at: null, uploads_close_at: new Date().toISOString() })} className="rounded-full border border-line px-4 py-2 text-sm font-semibold transition hover:border-ink">
                  Close uploads now
                </button>
              ) : (
                <button type="button" disabled={saving} onClick={() => save({ uploads_open_at: null, uploads_close_at: null })} className="rounded-full border border-line px-4 py-2 text-sm font-semibold transition hover:border-ink">
                  Open uploads now
                </button>
              )}
              {(openAt || closeAt) && (
                <button type="button" onClick={() => { setOpenAt(''); setCloseAt('') }} className="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition hover:text-ink">
                  Clear times
                </button>
              )}
            </div>
          </section>

          {/* Guest rules */}
          <section className="rounded-3xl border border-line bg-white px-6 pb-2 pt-4 sm:px-8">
            <h2 className="pt-2 text-lg font-bold">Guest rules</h2>
            <div className="divide-y divide-line">
              <Toggle {...flag('guests_can_view')} label="Guests can see all photos" hint="Turn off to keep the gallery private: guests only see what they added." />
              <Toggle {...flag('moderation')} label="Approve photos before they appear" hint="New photos and messages wait for you in “To review”." />
              <Toggle {...flag('allow_videos')} label="Allow short videos" hint="Up to 60 seconds." />
              <Toggle {...flag('guestbook')} label="Guestbook" hint="Guests can leave you a message." />
              <Toggle {...flag('reactions')} label="Reactions" hint="Guests can react ❤️ 😂 😮 to photos." />
              <Toggle {...flag('require_name')} label="Guests must enter their name" hint="So you always know who took each photo." />
              <div className="flex items-start justify-between gap-4 py-4">
                <label htmlFor="max">
                  <span className="block font-semibold">Photo limit per guest</span>
                  <span className="block text-sm text-ink-soft">Empty = unlimited.</span>
                </label>
                <input id="max" type="number" min={1} max={1000} inputMode="numeric" value={maxPerGuest} onChange={(e) => setMaxPerGuest(e.target.value)} placeholder="∞" className="w-24 rounded-xl border border-line px-3 py-2 text-center focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand" />
              </div>
            </div>
          </section>

          {/* Moments */}
          <section className={card}>
            <h2 className="text-lg font-bold">Moments</h2>
            <p className="mt-1 mb-4 text-sm text-ink-soft">Split the album into parts of the day. Guests pick one when they upload.</p>
            <ListEditor items={moments} onChange={setMoments} suggestions={DEFAULT_MOMENTS[eventType]} placeholder="e.g. Ceremony" max={12} />
          </section>

          {/* Challenges */}
          <section className={card}>
            <h2 className="text-lg font-bold">🎯 Photo challenges</h2>
            <p className="mt-1 mb-4 text-sm text-ink-soft">Fun missions that get guests taking photos. Scheduled ones stay hidden from guests until they start.</p>
            <ChallengeEditor items={challenges} onChange={setChallenges} suggestions={DEFAULT_CHALLENGES[eventType]} eventDate={eventDate} />
          </section>

          {/* Access code */}
          {isOwner && (
            <section className={card}>
              <h2 className="text-lg font-bold">Access code</h2>
              <p className="mt-1 text-sm text-ink-soft">Guests must type this code to open the album. Leave empty for no code.</p>
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                maxLength={8}
                placeholder="e.g. 2026"
                aria-label="Access code"
                className="mt-4 w-40 rounded-xl border border-line px-4 py-3 text-center font-mono text-lg tracking-[0.2em] focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <p className="mt-2 text-xs text-ink-soft">4 to 8 letters or numbers. Print it on your QR card.</p>
            </section>
          )}

          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}

          <div className="sticky bottom-4 z-10">
            <button type="submit" disabled={saving} className="w-full rounded-full bg-ink py-3.5 font-semibold text-white shadow-lg transition hover:bg-black disabled:opacity-50">
              {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
            </button>
          </div>
        </form>

        {/* Co-organizers */}
        {isOwner && (
          <section className={`${card} mt-10`}>
            <h2 className="text-lg font-bold">Co-organizers</h2>
            <p className="mt-1 text-sm text-ink-soft">
              They can manage photos and settings with you. They sign up or log in with this email.
            </p>
            {album.co_organizers.length > 0 && (
              <ul className="mt-4 space-y-2">
                {album.co_organizers.map((email) => (
                  <li key={email} className="flex items-center justify-between rounded-xl bg-cream px-4 py-2.5 text-sm">
                    <span className="truncate">{email}</span>
                    <button onClick={() => removeCo(email)} className="rounded-full p-1 hover:bg-line" aria-label={`Remove ${email}`}>
                      <XIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                addCo()
              }}
            >
              <input type="email" value={coEmail} onChange={(e) => setCoEmail(e.target.value)} required placeholder="partner@example.com" aria-label="Email" className="min-w-0 flex-1 rounded-xl border border-line px-4 py-2.5 focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand" />
              <button type="submit" disabled={busy === 'co'} className="rounded-full bg-ink px-5 text-sm font-semibold text-white disabled:opacity-50">
                Invite
              </button>
            </form>
          </section>
        )}

        {/* Premium */}
        {isOwner && !album.is_paid && (
          <section className="mt-6 flex flex-col items-start gap-3 rounded-3xl bg-brand p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h2 className="text-lg font-bold">Keep this album forever</h2>
              <p className="text-sm">No watermark, no expiry, unlimited photos.</p>
            </div>
            <Link href={`/album/${album.qr_code}/upgrade`} className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
              Go Premium — €5
            </Link>
          </section>
        )}

        {isOwner && (
          <section className="mt-6 rounded-3xl border border-red-200 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-bold text-red-700">Delete album</h2>
            <p className="mt-1 text-sm text-ink-soft">Removes the album and every photo in it. This can&apos;t be undone.</p>
            <button onClick={removeAlbum} disabled={busy === 'delete'} className="mt-4 rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50">
              {busy === 'delete' ? 'Deleting…' : 'Delete this album'}
            </button>
          </section>
        )}
      </main>
    </div>
  )
}
