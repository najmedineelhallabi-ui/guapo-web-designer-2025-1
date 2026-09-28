'use client'

import { useEffect, useState } from 'react'
import { CheckIcon, MessageIcon, TrashIcon } from '@/components/Icons'
import { addGuestbookEntry, moderateGuestbookEntry, type AppAlbum, type AppGuestbookEntry } from '@/lib/api'
import { uploadState } from '@/lib/albumRules'

type Props = {
  album: AppAlbum
  entries: AppGuestbookEntry[]
  isOrganizer: boolean
  onChange: (entries: AppGuestbookEntry[]) => void
}

export default function Guestbook({ album, entries, isOrganizer, onChange }: Props) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    try {
      setName(localStorage.getItem('mc_guest_name') || '')
    } catch {}
    // Follow the name typed in the upload box
    const onName = (e: Event) => setName((e as CustomEvent<string>).detail)
    window.addEventListener('mc-guest-name', onName)
    return () => window.removeEventListener('mc-guest-name', onName)
  }, [])

  if (!album.settings.guestbook && !isOrganizer) return null
  const canWrite = album.settings.guestbook && (isOrganizer || uploadState(album.settings).open)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')
    setNotice('')
    try {
      const entry = await addGuestbookEntry(album.qr_code, { name, message })
      onChange([entry, ...entries])
      setMessage('')
      if (entry.status === 'pending') setNotice('Thank you! Your message will appear once the organizer approves it.')
      try {
        localStorage.setItem('mc_guest_name', name.trim())
      } catch {}
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your message')
    } finally {
      setSending(false)
    }
  }

  const moderate = async (entry: AppGuestbookEntry, approve: boolean) => {
    if (!approve && !confirm('Delete this message?')) return
    try {
      await moderateGuestbookEntry(album.qr_code, entry.id, approve)
      onChange(approve ? entries.map((e) => (e.id === entry.id ? { ...e, status: 'approved' } : e)) : entries.filter((e) => e.id !== entry.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <section className="mt-12" aria-labelledby="guestbook-title">
      <h2 id="guestbook-title" className="flex items-center gap-2 text-xl font-bold">
        <MessageIcon /> Guestbook <span className="text-ink-soft">({entries.length})</span>
      </h2>
      {!album.settings.guestbook && <p className="mt-1 text-sm text-ink-soft">Turned off — guests can&apos;t see or write messages.</p>}

      {canWrite && (
        <form onSubmit={submit} className="mt-4 rounded-3xl border border-line bg-white p-5 sm:p-6">
          <label htmlFor="gb-message" className="text-sm font-semibold">Leave a message</label>
          <textarea
            id="gb-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={3}
            required
            placeholder="Congratulations! What a beautiful day…"
            className="mt-2 w-full rounded-xl border border-line px-4 py-3 focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={40}
              aria-label="Your name"
              placeholder="Your name"
              className="flex-1 rounded-xl border border-line px-4 py-3 focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button type="submit" disabled={sending} className="rounded-full bg-ink px-6 py-3 font-semibold text-white transition hover:bg-black disabled:opacity-50">
              {sending ? 'Sending…' : 'Sign the guestbook'}
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
          {notice && <p className="mt-3 rounded-xl bg-brand-soft px-4 py-2 text-sm" role="status">{notice}</p>}
        </form>
      )}

      {entries.length > 0 && (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-2xl border border-line bg-white p-5">
              <p className="whitespace-pre-line">{entry.message}</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-sm">
                  <span className="font-semibold">— {entry.name}</span>{' '}
                  <span className="text-ink-soft">{new Date(entry.created_at).toLocaleDateString()}</span>
                </p>
                <div className="flex items-center gap-1">
                  {entry.status === 'pending' && (
                    isOrganizer ? (
                      <button onClick={() => moderate(entry, true)} className="flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-xs font-bold">
                        <CheckIcon className="h-4 w-4" /> Approve
                      </button>
                    ) : (
                      <span className="rounded-full bg-line px-2 py-0.5 text-xs font-semibold">Pending</span>
                    )
                  )}
                  {(isOrganizer || entry.mine) && (
                    <button onClick={() => moderate(entry, false)} className="rounded-full p-1.5 text-ink-soft transition hover:bg-line hover:text-ink" aria-label="Delete message">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
