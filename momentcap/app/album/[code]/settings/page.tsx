'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'
import Toggle from '@/components/Toggle'
import { deleteAlbum, getAlbum, updateAlbum, type AppAlbum } from '@/lib/api'
import { EVENT_TYPES, uploadState, type AlbumSettings, type EventType } from '@/lib/albumRules'
import { fromLocalInput, toLocalInput } from '@/lib/dates'

const inputClass =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand'

export default function AlbumSettingsPage() {
  const params = useParams()
  const code = params.code as string
  const router = useRouter()

  const [album, setAlbum] = useState<AppAlbum | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const [name, setName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [location, setLocation] = useState('')
  const [eventType, setEventType] = useState<EventType>('other')
  const [welcome, setWelcome] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [openAt, setOpenAt] = useState('')
  const [closeAt, setCloseAt] = useState('')
  const [guestsCanView, setGuestsCanView] = useState(true)
  const [requireName, setRequireName] = useState(false)
  const [maxPerGuest, setMaxPerGuest] = useState('')

  const load = (a: AppAlbum) => {
    setAlbum(a)
    setName(a.name)
    setEventDate(a.event_date)
    setLocation(a.location)
    setEventType(a.event_type)
    setWelcome(a.welcome_message)
    setOpenAt(toLocalInput(a.settings.uploads_open_at))
    setCloseAt(toLocalInput(a.settings.uploads_close_at))
    setGuestsCanView(a.settings.guests_can_view)
    setRequireName(a.settings.require_name)
    setMaxPerGuest(a.settings.max_photos_per_guest ? String(a.settings.max_photos_per_guest) : '')
  }

  useEffect(() => {
    getAlbum(code)
      .then((res) => {
        if (res) {
          load(res.album)
          setIsOwner(res.isOwner)
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
        settings: {
          uploads_open_at: fromLocalInput(openAt),
          uploads_close_at: fromLocalInput(closeAt),
          guests_can_view: guestsCanView,
          require_name: requireName,
          max_photos_per_guest: maxPerGuest ? Number(maxPerGuest) : null,
          ...overrides
        }
      })
      load(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  const removeAlbum = async () => {
    if (!album) return
    const typed = prompt(`This deletes the album and all its photos for everyone.\n\nType the album code ${album.qr_code} to confirm.`)
    if (typed?.trim().toUpperCase() !== album.qr_code) return
    setDeleting(true)
    try {
      await deleteAlbum(album)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete the album')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-ink" />
      </div>
    )
  }

  if (!album || !isOwner) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader cta={false} />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-sm rounded-3xl border border-line bg-white p-8 text-center">
            <h1 className="text-xl font-bold">{album ? 'Only the organizer can change settings' : 'Album not found'}</h1>
            <p className="mt-2 text-ink-soft">Log in with the account that created this album.</p>
            <Link href={`/login?next=/album/${code}/settings`} className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-white">
              Log in
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const state = uploadState(album.settings)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader cta={false} />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <Link href={`/album/${album.qr_code}`} className="text-sm font-semibold text-ink-soft hover:text-ink">
          ← Back to album
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Album settings</h1>
        <p className="mt-1 text-ink-soft">{album.name}</p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            save()
          }}
          className="mt-8 space-y-6"
        >
          {/* Details */}
          <section className="rounded-3xl border border-line bg-white p-6 sm:p-8">
            <h2 className="text-lg font-bold">Details</h2>
            <div className="mt-5 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold">Album name</label>
                <input id="name" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
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
                  <input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="welcome" className="mb-2 block text-sm font-semibold">Message for your guests</label>
                <textarea id="welcome" value={welcome} onChange={(e) => setWelcome(e.target.value)} maxLength={280} rows={3}
                  placeholder="Shown at the top of the album" className={inputClass} />
              </div>
            </div>
          </section>

          {/* Timing */}
          <section className="rounded-3xl border border-line bg-white p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">When guests can upload</h2>
                <p className="mt-1 text-sm text-ink-soft">Leave empty for no limit. You can always add photos yourself.</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${state.open ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-700'}`}
              >
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
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => save({ uploads_open_at: null, uploads_close_at: new Date().toISOString() })}
                  className="rounded-full border border-line px-4 py-2 text-sm font-semibold transition hover:border-ink"
                >
                  Close uploads now
                </button>
              ) : (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => save({ uploads_open_at: null, uploads_close_at: null })}
                  className="rounded-full border border-line px-4 py-2 text-sm font-semibold transition hover:border-ink"
                >
                  Open uploads now
                </button>
              )}
              {(openAt || closeAt) && (
                <button
                  type="button"
                  onClick={() => {
                    setOpenAt('')
                    setCloseAt('')
                  }}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition hover:text-ink"
                >
                  Clear times
                </button>
              )}
            </div>
          </section>

          {/* Guest rules */}
          <section className="rounded-3xl border border-line bg-white px-6 pt-4 pb-2 sm:px-8">
            <h2 className="pt-2 text-lg font-bold">Guest rules</h2>
            <div className="divide-y divide-line">
              <Toggle
                checked={guestsCanView}
                onChange={setGuestsCanView}
                label="Guests can see all photos"
                hint="Turn off to keep the gallery private: guests only see what they added."
              />
              <Toggle
                checked={requireName}
                onChange={setRequireName}
                label="Guests must enter their name"
                hint="So you always know who took each photo."
              />
              <div className="flex items-start justify-between gap-4 py-4">
                <label htmlFor="max">
                  <span className="block font-semibold">Photo limit per guest</span>
                  <span className="block text-sm text-ink-soft">Empty = unlimited.</span>
                </label>
                <input
                  id="max"
                  type="number"
                  min={1}
                  max={1000}
                  inputMode="numeric"
                  value={maxPerGuest}
                  onChange={(e) => setMaxPerGuest(e.target.value)}
                  placeholder="∞"
                  className="w-24 rounded-xl border border-line px-3 py-2 text-center focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>
          </section>

          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <div className="sticky bottom-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-ink py-3.5 font-semibold text-white shadow-lg transition hover:bg-black disabled:opacity-50"
            >
              {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
            </button>
          </div>
        </form>

        <section className="mt-10 rounded-3xl border border-red-200 bg-white p-6 sm:p-8">
          <h2 className="text-lg font-bold text-red-700">Delete album</h2>
          <p className="mt-1 text-sm text-ink-soft">Removes the album and every photo in it. This can&apos;t be undone.</p>
          <button
            onClick={removeAlbum}
            disabled={deleting}
            className="mt-4 rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? 'Deleting…' : 'Delete this album'}
          </button>
        </section>
      </main>
    </div>
  )
}
