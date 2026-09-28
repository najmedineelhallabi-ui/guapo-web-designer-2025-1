'use client'

import { useState } from 'react'
import Toggle from '@/components/Toggle'
import { XIcon } from '@/components/Icons'
import { usePlan } from '@/components/plan/PlanContext'
import ShareInvitation from '@/components/plan/ShareInvitation'
import { Card, ErrorText, Field, btnGhost, btnPrimary, inputClass } from '@/components/plan/ui'
import { programToMoments, updateEvent } from '@/lib/api'
import { DEFAULT_PROGRAM, type EventInfo, type ProgramItem } from '@/lib/planRules'

type Row = Omit<ProgramItem, 'id'> & { id?: string }

export default function EventEditor() {
  const { album, setAlbum, code } = usePlan()
  const [ev, setEv] = useState<EventInfo>(album.event)
  const [program, setProgram] = useState<Row[]>(album.event.program)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [momentsMsg, setMomentsMsg] = useState('')

  const set = <K extends keyof EventInfo>(key: K, value: EventInfo[K]) => setEv((e) => ({ ...e, [key]: value }))
  const setRow = (i: number, patch: Partial<Row>) => setProgram((p) => p.map((r, j) => (j === i ? { ...r, ...patch } : r)))

  const save = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const next = await updateEvent(code, { ...ev, program: program as ProgramItem[] })
      setEv(next)
      setProgram(next.program)
      setAlbum({ ...album, event: next })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  const makeMoments = async () => {
    try {
      await save()
      const { moments } = await programToMoments(code)
      setAlbum({ ...album, moments })
      setMomentsMsg(`Album moments: ${moments.map((m) => m.name).join(', ')}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create moments')
    }
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
    >
      <Card title="Where & when">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Venue" htmlFor="venue">
            <input id="venue" value={ev.venue_name} onChange={(e) => set('venue_name', e.target.value)} maxLength={120} placeholder="e.g. Château de la Hulpe" className={inputClass} />
          </Field>
          <Field label="Start time" htmlFor="start">
            <input id="start" type="time" value={ev.start_time} onChange={(e) => set('start_time', e.target.value)} className={inputClass} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Address" htmlFor="address" hint="Guests get a map link.">
              <input id="address" value={ev.address} onChange={(e) => set('address', e.target.value)} maxLength={240} placeholder="Street, number, city" className={inputClass} />
            </Field>
          </div>
          <Field label="Dress code" htmlFor="dress">
            <input id="dress" value={ev.dress_code} onChange={(e) => set('dress_code', e.target.value)} maxLength={120} placeholder="e.g. Chic, pastel colors" className={inputClass} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Practical info" htmlFor="details" hint="Parking, accommodation, gift list, kids…">
              <textarea id="details" value={ev.details} onChange={(e) => set('details', e.target.value)} maxLength={2000} rows={4} className={inputClass} />
            </Field>
          </div>
        </div>
      </Card>

      <Card
        title="Program of the day"
        action={
          program.length === 0 && DEFAULT_PROGRAM[album.event_type].length > 0 ? (
            <button type="button" onClick={() => setProgram(DEFAULT_PROGRAM[album.event_type].map((p) => ({ ...p, details: '' })))} className={btnGhost}>
              Use a template
            </button>
          ) : null
        }
      >
        <ol className="space-y-3">
          {program.map((row, i) => (
            <li key={row.id || i} className="grid grid-cols-[6.5rem_1fr_auto] gap-2 rounded-2xl bg-cream p-2 sm:grid-cols-[6.5rem_1fr_1.3fr_auto]">
              <input type="time" value={row.time} onChange={(e) => setRow(i, { time: e.target.value })} aria-label="Time" className={inputClass} />
              <input value={row.title} onChange={(e) => setRow(i, { title: e.target.value })} maxLength={100} placeholder="e.g. Ceremony" aria-label="Title" className={inputClass} />
              <input value={row.details} onChange={(e) => setRow(i, { details: e.target.value })} maxLength={300} placeholder="Details (optional)" aria-label="Details" className={`${inputClass} col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto`} />
              <button type="button" onClick={() => setProgram((p) => p.filter((_, j) => j !== i))} className="self-center rounded-full p-2 text-ink-soft hover:bg-line" aria-label="Remove">
                <XIcon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => setProgram((p) => [...p, { time: '', title: '', details: '' }])} className={btnGhost}>
            + Add a step
          </button>
          {program.length > 0 && (
            <button type="button" onClick={makeMoments} className={btnGhost}>
              Use as photo album moments
            </button>
          )}
        </div>
        {momentsMsg && <p className="mt-3 text-sm text-ink-soft">{momentsMsg}</p>}
      </Card>

      <Card title="Answers (RSVP)">
        <div className="divide-y divide-line">
          <Toggle checked={ev.rsvp_enabled} onChange={(v) => set('rsvp_enabled', v)} label="Guests answer on the invitation" hint="Their answers land in your guest list." />
          <Toggle checked={ev.rsvp_ask_diet} onChange={(v) => set('rsvp_ask_diet', v)} label="Ask about allergies and diets" hint="Handy for the caterer." />
          <Toggle checked={ev.table_finder} onChange={(v) => set('table_finder', v)} label="“Find your table”" hint="Guests type their name to see their table — shown first on the day." />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Answer before" htmlFor="deadline">
            <input id="deadline" type="date" value={ev.rsvp_deadline || ''} onChange={(e) => set('rsvp_deadline', e.target.value || null)} className={inputClass} />
          </Field>
          <Field label="Max people per answer" htmlFor="party">
            <input id="party" type="number" min={1} max={20} value={ev.rsvp_max_party} onChange={(e) => set('rsvp_max_party', Number(e.target.value))} className={inputClass} />
          </Field>
        </div>
      </Card>

      <ErrorText error={error} />

      <div className="sticky bottom-4 z-10">
        <button type="submit" disabled={saving} className={`${btnPrimary} w-full py-3.5 shadow-lg`}>
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save invitation'}
        </button>
      </div>

      <ShareInvitation />
    </form>
  )
}
