'use client'

import { useEffect, useState } from 'react'
import { usePlan, useSection } from '@/components/plan/PlanContext'
import { Card, ErrorText, Stat, btnBrand, btnGhost, inputBase, inputClass } from '@/components/plan/ui'
import { ensureInviteKeys, inviteLink, markInvited } from '@/lib/api'
import { formatEventDate } from '@/lib/dates'
import type { Guest } from '@/lib/planRules'

const DEFAULT_SUBJECT = "You're invited: {event}"
const DEFAULT_MESSAGE = `Hi {name}! 🎉

You're invited to {event} on {date}{place}.

Here is your personal invitation — answer in one click, see the program and, closer to the day, your table:
{link}

See you soon!`

const digits = (phone: string) => phone.replace(/[^\d+]/g, '').replace(/^00/, '+').replace(/^\+/, '')

export default function InvitesPage() {
  const { plan, setPlan, code, album } = usePlan()
  const { save } = useSection('guests')
  const [keys, setKeys] = useState<Record<string, string> | null>(null)
  const storeKey = `mc_invite_msg_${code}`
  // The organizer's own wording is kept in this browser
  const [wording] = useState<{ subject?: string; message?: string }>(() => {
    try {
      return typeof window === 'undefined' ? {} : JSON.parse(localStorage.getItem(storeKey) || '{}') || {}
    } catch {
      return {}
    }
  })
  const [subject, setSubject] = useState(wording.subject || DEFAULT_SUBJECT)
  const [message, setMessage] = useState(wording.message || DEFAULT_MESSAGE)
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState('')

  // Every guest needs a personal key; new guests get theirs here
  const guestCount = plan.guests.length
  useEffect(() => {
    ensureInviteKeys(code)
      .then((r) => setKeys(r.keys))
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not prepare the invitations'))
  }, [code, guestCount])

  const keepWording = (next: { subject?: string; message?: string }) => {
    try {
      localStorage.setItem(storeKey, JSON.stringify({ subject, message, ...next }))
    } catch {}
  }

  const place = album.event.venue_name || album.location
  const fill = (text: string, g: Guest) =>
    text
      .replaceAll('{name}', g.name.split(' ')[0])
      .replaceAll('{event}', album.name)
      .replaceAll('{date}', formatEventDate(album.event_date))
      .replaceAll('{place}', place ? ` at ${place}` : '')
      .replaceAll('{link}', keys?.[g.id] ? inviteLink(code, keys[g.id]) : '')

  const sent = async (g: Guest) => {
    setPlan((p) => ({ ...p, guests: p.guests.map((x) => (x.id === g.id ? { ...x, invited_at: new Date().toISOString() } : x)) }))
    try {
      await markInvited(code, [g.id])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save')
    }
  }

  const mailto = (g: Guest) => `mailto:${encodeURIComponent(g.email)}?subject=${encodeURIComponent(fill(subject, g))}&body=${encodeURIComponent(fill(message, g))}`
  const whatsapp = (g: Guest) => `https://wa.me/${g.phone ? digits(g.phone) : ''}?text=${encodeURIComponent(fill(message, g))}`
  const sms = (g: Guest) => `sms:${g.phone ? digits(g.phone) : ''}?body=${encodeURIComponent(fill(message, g))}`

  const copy = async (g: Guest) => {
    if (!keys?.[g.id]) return
    await navigator.clipboard.writeText(inviteLink(code, keys[g.id])).catch(() => {})
    setCopied(g.id)
    setTimeout(() => setCopied((c) => (c === g.id ? null : c)), 2000)
    sent(g)
  }

  const guests = [...plan.guests].sort((a, b) => Number(Boolean(a.invited_at)) - Number(Boolean(b.invited_at)) || a.name.localeCompare(b.name))
  const invited = plan.guests.filter((g) => g.invited_at).length
  const answered = plan.guests.filter((g) => g.rsvp !== 'pending').length
  // Next guest with an email who hasn't been sent their invitation
  const next = guests.find((g) => !g.invited_at && g.email)

  const updateContact = (g: Guest, field: 'email' | 'phone', value: string) => {
    if (value.trim() === g[field]) return
    save({ ...g, [field]: value.trim() }).catch((err) => setError(err instanceof Error ? err.message : 'Could not save'))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <Stat value={plan.guests.length} label="Guests" />
        <Stat value={invited} label="Invitations sent" tone="bg-brand-soft" />
        <Stat value={answered} label="Answered" tone="bg-green-50" />
      </div>

      <Card title="Personal invitations">
        <p className="text-sm text-ink-soft">
          Each guest gets their own link: it opens the invitation with their name, lets them answer in one click and, once you&apos;ve made the seating
          plan, shows their table and who sits with them. Emails open in your own mailbox, ready to send — so they come from you.
        </p>

        <details className="mt-4 rounded-2xl bg-cream p-4">
          <summary className="cursor-pointer text-sm font-semibold">✏️ Edit the message</summary>
          <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-ink-soft" htmlFor="invite-subject">
            Email subject
          </label>
          <input
            id="invite-subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value)
              keepWording({ subject: e.target.value })
            }}
            className={`${inputClass} mt-1`}
          />
          <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-ink-soft" htmlFor="invite-message">
            Message
          </label>
          <textarea
            id="invite-message"
            value={message}
            rows={8}
            onChange={(e) => {
              setMessage(e.target.value)
              keepWording({ message: e.target.value })
            }}
            className={`${inputClass} mt-1`}
          />
          <p className="mt-1 text-xs text-ink-soft">
            {'{name}'} first name · {'{event}'} · {'{date}'} · {'{place}'} · {'{link}'} their personal link (keep it!)
          </p>
          <button
            onClick={() => {
              setSubject(DEFAULT_SUBJECT)
              setMessage(DEFAULT_MESSAGE)
              keepWording({ subject: DEFAULT_SUBJECT, message: DEFAULT_MESSAGE })
            }}
            className="mt-2 text-xs font-semibold underline"
          >
            Reset
          </button>
        </details>

        {next && keys && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-soft p-4">
            <p className="text-sm">
              <span className="font-bold">{guests.filter((g) => !g.invited_at && g.email).length}</span> guest(s) with an email still to invite
            </p>
            <a href={mailto(next)} onClick={() => sent(next)} className={btnBrand}>
              ✉️ Email {next.name.split(' ')[0]} →
            </a>
          </div>
        )}
        <ErrorText error={error} />
      </Card>

      <Card title={`Guests (${plan.guests.length})`}>
        {plan.guests.length === 0 ? (
          <p className="text-sm text-ink-soft">Add your guests in the Guests tab first.</p>
        ) : !keys ? (
          <p className="text-sm text-ink-soft">Preparing the links…</p>
        ) : (
          <ul className="divide-y divide-line">
            {guests.map((g) => (
              <li key={g.id} className="grid gap-2 py-3 lg:grid-cols-[1fr_13rem_9rem_auto] lg:items-center">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{g.name}</p>
                  <p className="text-xs text-ink-soft">
                    {[
                      g.invited_at ? `✉️ Invited ${new Date(g.invited_at).toLocaleDateString()}` : 'Not invited yet',
                      g.rsvp === 'yes' ? '✅ Coming' : g.rsvp === 'no' ? "❌ Can't come" : ''
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
                <input
                  key={`e-${g.id}-${g.email}`}
                  type="email"
                  defaultValue={g.email}
                  placeholder="Email"
                  onBlur={(e) => updateContact(g, 'email', e.target.value)}
                  aria-label={`Email for ${g.name}`}
                  className={`${inputBase} w-full`}
                />
                <input
                  key={`p-${g.id}-${g.phone}`}
                  type="tel"
                  defaultValue={g.phone}
                  placeholder="Phone"
                  onBlur={(e) => updateContact(g, 'phone', e.target.value)}
                  aria-label={`Phone for ${g.name}`}
                  className={`${inputBase} w-full`}
                />
                <div className="flex flex-wrap gap-1.5">
                  {g.email ? (
                    <a href={mailto(g)} onClick={() => sent(g)} className={btnGhost} aria-label={`Email ${g.name}`}>✉️ Email</a>
                  ) : (
                    <span className={`${btnGhost} opacity-40`} aria-disabled="true" title="Add an email first">✉️ Email</span>
                  )}
                  <a href={whatsapp(g)} target="_blank" rel="noreferrer" onClick={() => sent(g)} className={btnGhost} aria-label={`WhatsApp ${g.name}`}>💬</a>
                  <a href={sms(g)} onClick={() => sent(g)} className={btnGhost} aria-label={`Text ${g.name}`}>SMS</a>
                  <button onClick={() => copy(g)} className={btnGhost} aria-label={`Copy ${g.name}'s link`}>
                    {copied === g.id ? 'Copied ✓' : '🔗 Link'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
