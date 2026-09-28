'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Logo from '@/components/Logo'
import ThemeScope from '@/components/album/ThemeScope'
import PinGate from '@/components/album/PinGate'
import Countdown from '@/components/album/Countdown'
import { UpgradePanel } from '@/components/pricing/Locked'
import { CameraIcon, CheckIcon } from '@/components/Icons'
import { ApiError, findTable, getEventPage, setAlbumPin, submitRsvp, type EventPage, type MyRsvp } from '@/lib/api'
import { eventTypeInfo } from '@/lib/albumRules'
import { formatEventDate } from '@/lib/dates'

type Open = Extract<EventPage, { locked: false }>

const input =
  'w-full rounded-xl border border-line bg-white px-4 py-3 focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand'

function eventStart(date: string, time: string) {
  const [y, m, d] = date.split('-').map(Number)
  if (!y) return null
  const [h, min] = (time || '00:00').split(':').map(Number)
  return new Date(y, m - 1, d, h || 0, min || 0)
}

function downloadIcs(album: Open['album']) {
  const start = eventStart(album.event_date, album.event.start_time)
  if (!start) return
  const allDay = !album.event.start_time
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const day = (d: Date) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const end = new Date(start.getTime() + (allDay ? 864e5 : 5 * 3600e3))
  const esc = (s: string) => s.replace(/[,;\\]/g, (c) => `\\${c}`).replace(/\n/g, '\\n')
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Moment caps//EN',
    'BEGIN:VEVENT',
    `UID:${album.qr_code}@momentcaps`,
    `DTSTAMP:${fmt(new Date())}`,
    allDay ? `DTSTART;VALUE=DATE:${day(start)}` : `DTSTART:${fmt(start)}`,
    allDay ? `DTEND;VALUE=DATE:${day(end)}` : `DTEND:${fmt(end)}`,
    `SUMMARY:${esc(album.name)}`,
    `LOCATION:${esc([album.event.venue_name, album.event.address || album.location].filter(Boolean).join(', '))}`,
    `DESCRIPTION:${esc(`${window.location.origin}/album/${album.qr_code}/event`)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ]
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }))
  a.download = `${album.name.replace(/[^\w-]+/g, '_')}.ics`
  a.click()
}

function RsvpCard({ page, onSaved }: { page: Open; onSaved: (r: MyRsvp) => void }) {
  const ev = page.album.event
  const mine = page.myRsvp
  const [editing, setEditing] = useState(!mine)
  const [name, setName] = useState(mine?.name || '')
  const [attending, setAttending] = useState<boolean | null>(mine ? mine.rsvp === 'yes' : null)
  const [party, setParty] = useState(mine?.party_size || 1)
  const [diet, setDiet] = useState(mine?.diet || '')
  const [note, setNote] = useState(mine?.note || '')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  if (!page.rsvpOpen && !mine) return null

  if (mine && !editing) {
    return (
      <section className="rounded-3xl bg-brand p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wider">Your answer</p>
        <p className="mt-2 text-2xl font-extrabold">
          {mine.rsvp === 'yes' ? `See you there, ${mine.name}! 🎉` : `Sorry you can't make it, ${mine.name}`}
        </p>
        {mine.rsvp === 'yes' && (
          <p className="mt-1">
            {mine.party_size} {mine.party_size > 1 ? 'people' : 'person'}
            {mine.diet ? ` · ${mine.diet}` : ''}
          </p>
        )}
        {page.rsvpOpen && (
          <button onClick={() => setEditing(true)} className="mt-4 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
            Change my answer
          </button>
        )}
      </section>
    )
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (attending === null) return setError('Please tell us if you can come')
    setSending(true)
    setError('')
    try {
      const r = await submitRsvp(page.album.qr_code, { name, attending, party_size: party, diet, note })
      onSaved(r)
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your answer')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="rounded-3xl border border-line bg-white p-6 sm:p-8" aria-labelledby="rsvp-title">
      <h2 id="rsvp-title" className="text-xl font-extrabold">Will you be there?</h2>
      {ev.rsvp_deadline && <p className="mt-1 text-sm text-ink-soft">Please answer before {formatEventDate(ev.rsvp_deadline)}</p>}
      <form onSubmit={submit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="rsvp-name" className="mb-2 block text-sm font-semibold">Your name</label>
          <input id="rsvp-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} placeholder="First and last name" className={input} />
        </div>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Attending">
          {[
            [true, "Yes, I'll be there"],
            [false, "Sorry, I can't"]
          ].map(([value, label]) => (
            <button
              key={String(value)}
              type="button"
              role="radio"
              aria-checked={attending === value}
              onClick={() => setAttending(value as boolean)}
              className={`rounded-2xl border-2 px-4 py-4 font-bold transition ${attending === value ? 'border-ink bg-brand' : 'border-line bg-white hover:border-ink-soft'}`}
            >
              {label as string}
            </button>
          ))}
        </div>
        {attending && (
          <>
            {ev.rsvp_max_party > 1 && (
              <div>
                <label htmlFor="rsvp-party" className="mb-2 block text-sm font-semibold">How many people (including you)?</label>
                <select id="rsvp-party" value={party} onChange={(e) => setParty(Number(e.target.value))} className={input}>
                  {Array.from({ length: ev.rsvp_max_party }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            )}
            {ev.rsvp_ask_diet && (
              <div>
                <label htmlFor="rsvp-diet" className="mb-2 block text-sm font-semibold">
                  Allergies or diet <span className="font-normal text-ink-soft">(optional)</span>
                </label>
                <input id="rsvp-diet" value={diet} onChange={(e) => setDiet(e.target.value)} maxLength={120} placeholder="e.g. vegetarian, no nuts" className={input} />
              </div>
            )}
          </>
        )}
        <div>
          <label htmlFor="rsvp-note" className="mb-2 block text-sm font-semibold">
            A word for the hosts <span className="font-normal text-ink-soft">(optional)</span>
          </label>
          <textarea id="rsvp-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} rows={2} className={input} />
        </div>
        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
        <button type="submit" disabled={sending} className="w-full rounded-full bg-ink py-3.5 font-bold text-white transition hover:bg-black disabled:opacity-50">
          {sending ? 'Sending…' : 'Send my answer'}
        </button>
      </form>
    </section>
  )
}

function TableFinder({ code }: { code: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ name: string; table: string }[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null)
      return
    }
    const id = setTimeout(() => {
      findTable(code, query)
        .then((r) => setResults(r.results))
        .catch((err) => setError(err instanceof Error ? err.message : 'Search failed'))
    }, 250)
    return () => clearTimeout(id)
  }, [code, query])

  return (
    <section className="rounded-3xl border border-line bg-white p-6 sm:p-8" aria-labelledby="table-title">
      <h2 id="table-title" className="text-xl font-extrabold">🪑 Find your table</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type your name"
        aria-label="Your name"
        className={`${input} mt-4 text-lg`}
      />
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      {results && (
        <ul className="mt-3 space-y-2" aria-live="polite">
          {results.length === 0 ? (
            <li className="text-sm text-ink-soft">No match yet — try your first or last name.</li>
          ) : (
            results.map((r, i) => (
              <li key={i} className="flex items-center justify-between rounded-2xl bg-brand-soft px-4 py-3">
                <span className="font-semibold">{r.name}</span>
                <span className="rounded-full bg-ink px-3 py-1 text-sm font-bold text-white">{r.table}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </section>
  )
}

export default function EventPageView() {
  const params = useParams()
  const code = String(params.code || '').toUpperCase()
  const [page, setPage] = useState<EventPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [pinError, setPinError] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setPage(await getEventPage(code))
      setPinError('')
    } catch (err) {
      if (err instanceof ApiError && err.code === 'pin_wrong') {
        setAlbumPin(code, null)
        setPinError('Wrong code, try again.')
        setPage(await getEventPage(code).catch(() => null))
      } else setError(err instanceof Error ? err.message : 'Could not load this event')
    } finally {
      setLoading(false)
    }
  }, [code])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-ink" />
      </div>
    )
  }
  if (page?.locked) {
    return <PinGate album={page.album} error={pinError} onSubmit={(pin) => { setAlbumPin(code, pin); load() }} />
  }
  if (!page) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <Logo />
        <p className="mt-6 text-ink-soft">{error || 'Event not found.'}</p>
      </div>
    )
  }

  const { album } = page
  const ev = album.event

  if (!page.available) {
    return (
      <ThemeScope theme={album.theme} className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <Logo />
        <div className="mt-8 w-full max-w-md">
          {page.isOrganizer ? (
            <UpgradePanel code={album.qr_code} feature="planning" current="free">
              Your online invitation with RSVP, program and “find your table” is part of the Full event pack.
            </UpgradePanel>
          ) : (
            <div className="rounded-3xl border border-line bg-white p-8 text-center">
              <h1 className="text-xl font-extrabold">{album.name}</h1>
              <p className="mt-2 text-ink-soft">The invitation page isn&apos;t available yet.</p>
              <Link href={`/album/${album.qr_code}`} className="mt-5 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-white">
                Open the photo album
              </Link>
            </div>
          )}
        </div>
      </ThemeScope>
    )
  }
  const start = eventStart(album.event_date, ev.start_time)
  const isToday = start ? start.toDateString() === new Date().toDateString() : false
  const upcoming = start && start.getTime() > Date.now()
  const place = [ev.venue_name, ev.address || album.location].filter(Boolean).join(', ')
  const mapUrl = place ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}` : null

  return (
    <ThemeScope theme={album.theme} className="min-h-screen pb-16">
      <header className="bg-white">
        {album.cover_url ? (
          <img src={album.cover_url} alt="" className="h-56 w-full object-cover sm:h-72" />
        ) : (
          <div className="flex h-40 items-center justify-center bg-brand text-6xl" aria-hidden="true">
            {eventTypeInfo(album.event_type).emoji}
          </div>
        )}
        <div className="mx-auto max-w-2xl px-4 py-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ink-soft">You&apos;re invited</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{album.name}</h1>
          <p className="mt-3 text-lg">
            {formatEventDate(album.event_date)}
            {ev.start_time ? ` · ${ev.start_time}` : ''}
          </p>
          {place && (
            <p className="mt-1 text-ink-soft">
              {place}
              {mapUrl && (
                <>
                  {' · '}
                  <a href={mapUrl} target="_blank" rel="noreferrer" className="font-semibold text-ink underline underline-offset-4">
                    Map
                  </a>
                </>
              )}
            </p>
          )}
          {album.welcome_message && <p className="mx-auto mt-5 max-w-lg rounded-2xl bg-brand-soft px-5 py-4">{album.welcome_message}</p>}
          {upcoming && !isToday && start && (
            <div className="mt-6">
              <Countdown target={start.toISOString()} />
            </div>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button onClick={() => downloadIcs(album)} className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-ink">
              📅 Add to my calendar
            </button>
            <Link href={`/album/${album.qr_code}`} className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
              <CameraIcon className="h-4 w-4" /> Photo album
            </Link>
            {page.isOrganizer && (
              <Link href={`/album/${album.qr_code}/plan/event`} className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold">
                Edit this page
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-8">
        {isToday && page.tableFinder && <TableFinder code={album.qr_code} />}

        {ev.program.length > 0 && (
          <section className="rounded-3xl border border-line bg-white p-6 sm:p-8" aria-labelledby="program-title">
            <h2 id="program-title" className="text-xl font-extrabold">Program</h2>
            <ol className="mt-5 space-y-0">
              {ev.program.map((item, i) => (
                <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < ev.program.length - 1 && <span className="absolute left-[2.1rem] top-8 bottom-0 w-0.5 bg-line" aria-hidden="true" />}
                  <span className="w-[4.2rem] shrink-0 rounded-full bg-brand px-2 py-1 text-center text-sm font-bold tabular-nums">{item.time || '—'}</span>
                  <span>
                    <span className="block font-bold">{item.title}</span>
                    {item.details && <span className="block text-sm text-ink-soft">{item.details}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {(ev.dress_code || ev.details) && (
          <section className="rounded-3xl border border-line bg-white p-6 sm:p-8">
            {ev.dress_code && (
              <p>
                <span className="font-bold">Dress code:</span> {ev.dress_code}
              </p>
            )}
            {ev.details && <p className={`whitespace-pre-line ${ev.dress_code ? 'mt-4' : ''}`}>{ev.details}</p>}
          </section>
        )}

        <RsvpCard page={page} onSaved={(r) => setPage({ ...page, myRsvp: r })} />
        {!page.rsvpOpen && !page.myRsvp && ev.rsvp_enabled && (
          <p className="text-center text-sm text-ink-soft">Answers are closed for this event.</p>
        )}

        {!isToday && page.tableFinder && <TableFinder code={album.qr_code} />}

        <section className="rounded-3xl bg-ink p-6 text-center text-white sm:p-8">
          <p className="text-xl font-extrabold">📸 On the day, share your photos!</p>
          <p className="mt-1 text-white/70">Everyone&apos;s photos in one album — no app needed.</p>
          <Link href={`/album/${album.qr_code}`} className="mt-4 inline-block rounded-full bg-brand px-6 py-3 font-bold text-ink">
            Open the photo album
          </Link>
        </section>

        <p className="flex items-center justify-center gap-2 pt-4 text-sm text-ink-soft">
          <CheckIcon className="h-4 w-4" /> Made with <Logo className="h-7" />
        </p>
      </main>
    </ThemeScope>
  )
}
