'use client'

import { useState } from 'react'
import { ClockIcon, XIcon } from './Icons'
import { fromLocalInput, toLocalInput } from '@/lib/dates'
import type { Challenge } from '@/lib/albumRules'

/** Challenge being edited: times are kept as <input type="datetime-local"> values. */
export type ChallengeDraft = { id?: string; name: string; start: string; end: string; scheduled: boolean }

export const toDrafts = (list: Challenge[]): ChallengeDraft[] =>
  list.map((c) => ({
    id: c.id,
    name: c.name,
    start: toLocalInput(c.starts_at),
    end: toLocalInput(c.ends_at),
    scheduled: Boolean(c.starts_at || c.ends_at)
  }))

export const fromDrafts = (list: ChallengeDraft[]) =>
  list
    .filter((d) => d.name.trim())
    .map((d) => ({
      ...(d.id ? { id: d.id } : {}),
      name: d.name.trim(),
      starts_at: d.scheduled ? fromLocalInput(d.start) : null,
      ends_at: d.scheduled ? fromLocalInput(d.end) : null
    }))

const MAX = 20
const input =
  'w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand'

export default function ChallengeEditor({
  items,
  onChange,
  suggestions,
  eventDate
}: {
  items: ChallengeDraft[]
  onChange: (items: ChallengeDraft[]) => void
  suggestions: string[]
  /** yyyy-mm-dd, used to prefill times on the event day */
  eventDate?: string
}) {
  const [draft, setDraft] = useState('')
  const names = items.map((i) => i.name.trim().toLowerCase())
  const unused = suggestions.filter((s) => !names.includes(s.toLowerCase()))

  const add = (name: string) => {
    const n = name.trim().slice(0, 80)
    if (!n || names.includes(n.toLowerCase()) || items.length >= MAX) return
    onChange([...items, { name: n, start: '', end: '', scheduled: false }])
    setDraft('')
  }
  const update = (i: number, patch: Partial<ChallengeDraft>) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)))
  const schedule = (i: number) => update(i, { scheduled: true, start: items[i].start || (eventDate ? `${eventDate}T20:00` : '') })

  return (
    <div>
      {items.length > 0 && (
        <ol className="space-y-3">
          {items.map((item, i) => {
            const endBeforeStart = item.scheduled && item.start && item.end && item.end <= item.start
            return (
              <li key={item.id || i} className="rounded-2xl border border-line bg-cream p-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 shrink-0 text-center text-sm font-bold text-ink-soft">{i + 1}</span>
                  <input
                    value={item.name}
                    onChange={(e) => update(i, { name: e.target.value })}
                    maxLength={80}
                    aria-label={`Challenge ${i + 1}`}
                    className={`${input} font-semibold`}
                  />
                  <button
                    type="button"
                    onClick={() => onChange(items.filter((_, j) => j !== i))}
                    className="shrink-0 rounded-full p-2 text-ink-soft hover:bg-line hover:text-ink"
                    aria-label={`Remove ${item.name}`}
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>

                {item.scheduled ? (
                  <div className="mt-3 grid gap-2 pl-8 sm:grid-cols-2">
                    <label className="text-xs font-semibold text-ink-soft">
                      Starts
                      <input type="datetime-local" value={item.start} onChange={(e) => update(i, { start: e.target.value })} className={`${input} mt-1`} />
                    </label>
                    <label className="text-xs font-semibold text-ink-soft">
                      Ends <span className="font-normal">(optional)</span>
                      <input type="datetime-local" value={item.end} onChange={(e) => update(i, { end: e.target.value })} className={`${input} mt-1`} />
                    </label>
                    {endBeforeStart && <p className="text-xs text-red-700 sm:col-span-2">The end must be after the start.</p>}
                    <button
                      type="button"
                      onClick={() => update(i, { scheduled: false, start: '', end: '' })}
                      className="w-fit text-xs font-semibold text-ink-soft underline sm:col-span-2"
                    >
                      Available all the time instead
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => schedule(i)} className="mt-2 ml-8 flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-ink">
                    <ClockIcon className="h-4 w-4" /> Schedule it (revealed at a set time)
                  </button>
                )}
              </li>
            )
          })}
        </ol>
      )}

      {items.length < MAX && (
        <div className="mt-3 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                add(draft)
              }
            }}
            maxLength={80}
            placeholder="Write your own challenge…"
            aria-label="New challenge"
            className="min-w-0 flex-1 rounded-xl border border-line bg-white px-4 py-2.5 focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <button type="button" onClick={() => add(draft)} className="rounded-full bg-ink px-5 text-sm font-semibold text-white">
            Add
          </button>
        </div>
      )}

      {unused.length > 0 && items.length < MAX && (
        <div className="mt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Ideas</p>
          <div className="flex flex-wrap gap-2">
            {unused.map((s) => (
              <button key={s} type="button" onClick={() => add(s)} className="rounded-full border border-dashed border-ink-soft/50 px-3 py-1 text-sm text-ink-soft transition hover:border-ink hover:text-ink">
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
