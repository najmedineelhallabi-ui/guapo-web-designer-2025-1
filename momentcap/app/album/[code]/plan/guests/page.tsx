'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { TrashIcon } from '@/components/Icons'
import { usePlan, useSection } from '@/components/plan/PlanContext'
import { Card, ErrorText, Stat, btnGhost, btnPrimary, inputClass, inputBase } from '@/components/plan/ui'
import { importGuests } from '@/lib/api'
import { guestStats, isSeatingTable, normalizeName, type Guest, type RsvpStatus } from '@/lib/planRules'
import { downloadText, parseCsv, toCsv } from '@/lib/csv'

const RSVP_LABEL: Record<RsvpStatus, string> = { yes: 'Coming', no: "Can't come", pending: 'No answer' }
const RSVP_STYLE: Record<RsvpStatus, string> = { yes: 'bg-green-100 text-green-800', no: 'bg-red-50 text-red-700', pending: 'bg-line text-ink-soft' }

/** Maps a header row to our fields (English and French names accepted). */
function columnMap(header: string[]) {
  const find = (...names: string[]) => header.findIndex((h) => names.includes(normalizeName(h)))
  return {
    name: find('name', 'nom', 'guest', 'invite', 'full name', 'nom complet'),
    group: find('group', 'groupe', 'side', 'famille', 'category'),
    email: find('email', 'e mail', 'mail'),
    phone: find('phone', 'telephone', 'tel', 'gsm', 'mobile'),
    party: find('party size', 'people', 'personnes', 'nombre', 'seats', 'places'),
    table: find('table')
  }
}

export default function GuestsPage() {
  const { plan, setPlan, code, unseenAnswers, markAnswersSeen } = usePlan()
  const { save, remove } = useSection('guests')
  const [filter, setFilter] = useState<'all' | RsvpStatus>('all')
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState({ name: '', group: '', party_size: 1 })
  const [paste, setPaste] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  // New answers stay highlighted while the organizer is on this page, and count as seen
  const [highlight, setHighlight] = useState<Set<string>>(() => new Set())
  if ([...unseenAnswers].some((id) => !highlight.has(id))) setHighlight(new Set([...highlight, ...unseenAnswers]))
  useEffect(() => {
    if (unseenAnswers.size > 0) markAnswersSeen()
  }, [unseenAnswers, markAnswersSeen])
  const isNew = (id: string) => highlight.has(id) || unseenAnswers.has(id)

  const stats = guestStats(plan.guests)
  const groups = useMemo(() => [...new Set(plan.guests.map((g) => g.group).filter(Boolean))].sort(), [plan.guests])
  const tables = plan.tables.filter(isSeatingTable)

  const shown = plan.guests
    .filter((g) => filter === 'all' || g.rsvp === filter)
    .filter((g) => !search || normalizeName(`${g.name} ${g.group}`).includes(normalizeName(search)))
    .sort((a, b) => a.name.localeCompare(b.name))

  const run = async (fn: () => Promise<unknown>) => {
    setError('')
    try {
      await fn()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.name.trim()) return
    run(async () => {
      await save({ ...draft })
      setDraft({ name: '', group: draft.group, party_size: 1 })
    })
  }

  const doImport = (text: string) =>
    run(async () => {
      const rows = parseCsv(text)
      if (rows.length === 0) return
      const cols = columnMap(rows[0])
      const hasHeader = cols.name >= 0
      const body = hasHeader ? rows.slice(1) : rows
      const at = (r: string[], i: number) => (i >= 0 ? r[i] || '' : '')
      const list = body.map((r) =>
        hasHeader
          ? { name: at(r, cols.name), group: at(r, cols.group), email: at(r, cols.email), phone: at(r, cols.phone), party_size: at(r, cols.party) || 1, table: at(r, cols.table) }
          : { name: r[0], group: r[1] || '', table: r[2] || '' }
      )
      const { added } = await importGuests(code, list)
      const { getPlan } = await import('@/lib/api')
      const fresh = await getPlan(code)
      setPlan(() => fresh.plan)
      setNotice(`${added} guest${added === 1 ? '' : 's'} added${list.length - added > 0 ? ` (${list.length - added} skipped: empty or already in the list)` : ''}.`)
      setPaste('')
      setShowImport(false)
    })

  const exportCsv = () => {
    const tableName = (id: string | null) => tables.find((t) => t.id === id)?.name || ''
    const rows = [
      ['Name', 'Group', 'Answer', 'People', 'Table', 'Diet', 'Email', 'Phone', 'Note'],
      ...plan.guests
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((g) => [g.name, g.group, RSVP_LABEL[g.rsvp], g.party_size, tableName(g.table_id), g.diet, g.email, g.phone, g.note])
    ]
    downloadText(toCsv(rows), 'guests.csv')
  }

  const update = (g: Guest, patch: Partial<Guest>) => run(() => save({ ...g, ...patch }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <Stat value={stats.invited} label="Invited" />
        <Stat value={stats.yes} label="Coming" tone="bg-green-50" />
        <Stat value={stats.pending} label="No answer yet" />
        <Stat value={stats.no} label="Can't come" />
        <Stat value={stats.people} label="People confirmed" tone="bg-brand-soft" />
      </div>

      <Card
        title="Add guests"
        action={
          <div className="flex gap-2">
            <button onClick={() => setShowImport((v) => !v)} className={btnGhost}>
              Import a list
            </button>
            {plan.guests.length > 0 && (
              <button onClick={exportCsv} className={btnGhost}>
                Export (Excel)
              </button>
            )}
          </div>
        }
      >
        <form onSubmit={add} className="grid gap-2 sm:grid-cols-[1.5fr_1fr_6rem_auto]">
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Name" aria-label="Name" maxLength={80} className={inputClass} />
          <input value={draft.group} onChange={(e) => setDraft({ ...draft, group: e.target.value })} placeholder="Group (family, friends…)" aria-label="Group" list="groups" maxLength={60} className={inputClass} />
          <input type="number" min={1} max={20} value={draft.party_size} onChange={(e) => setDraft({ ...draft, party_size: Number(e.target.value) })} aria-label="People" title="People (guest + companions)" className={inputClass} />
          <button type="submit" className={btnPrimary}>Add</button>
          <datalist id="groups">
            {groups.map((g) => <option key={g} value={g} />)}
          </datalist>
        </form>
        {showImport && (
          <div className="mt-4 rounded-2xl bg-cream p-4">
            <p className="text-sm">
              Paste one guest per line — <span className="font-mono text-xs">Name; Group; Table</span> — or import a CSV file exported from Excel or Google Sheets (columns like Name, Group, Email, Phone, People, Table).
            </p>
            <textarea value={paste} onChange={(e) => setPaste(e.target.value)} rows={5} placeholder={'Lina Martin; Friends\nAdam Dupont; Family; Table 1'} className={`${inputClass} mt-3 font-mono`} />
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => doImport(paste)} disabled={!paste.trim()} className={btnPrimary}>
                Add these guests
              </button>
              <button onClick={() => fileRef.current?.click()} className={btnGhost}>
                Choose a CSV file
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv,text/plain"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0]
                  if (f) doImport(await f.text())
                  e.target.value = ''
                }}
              />
            </div>
          </div>
        )}
        {notice && <p className="mt-3 rounded-xl bg-brand-soft px-4 py-2 text-sm">{notice}</p>}
        <ErrorText error={error} />
      </Card>

      <Card
        title={`Guest list (${shown.length})`}
        action={<input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" aria-label="Search guests" className={`${inputBase} w-40`} />}
      >
        <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1">
          {(['all', 'yes', 'pending', 'no'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${filter === f ? 'bg-ink text-white' : 'border border-line bg-white'}`}
            >
              {f === 'all' ? 'All' : RSVP_LABEL[f]}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="text-sm text-ink-soft">
            {plan.guests.length === 0 ? 'No guests yet. Add them above, import a list, or let them answer on your invitation.' : 'No guest matches.'}
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {shown.map((g) => (
              <li key={g.id} className="grid gap-2 py-3 sm:grid-cols-[1.6fr_8.5rem_4.5rem_8rem_auto] sm:items-center">
                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {g.name}
                    {isNew(g.id) && <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-xs font-bold text-white">New answer</span>}
                    {g.source === 'rsvp' && <span className="ml-2 rounded-full bg-brand-soft px-2 py-0.5 text-xs font-bold">via invitation</span>}
                  </p>
                  <p className="truncate text-xs text-ink-soft">
                    {[g.group, g.diet && `🍽 ${g.diet}`, g.note && `“${g.note}”`, g.email, g.phone].filter(Boolean).join(' · ') || '—'}
                  </p>
                </div>
                <select value={g.rsvp} onChange={(e) => update(g, { rsvp: e.target.value as RsvpStatus })} aria-label={`Answer for ${g.name}`} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${RSVP_STYLE[g.rsvp]}`}>
                  {(['pending', 'yes', 'no'] as const).map((r) => <option key={r} value={r}>{RSVP_LABEL[r]}</option>)}
                </select>
                <input type="number" min={1} max={20} value={g.party_size} onChange={(e) => update(g, { party_size: Number(e.target.value) })} aria-label={`People for ${g.name}`} className={inputClass} />
                <select value={g.table_id || ''} onChange={(e) => update(g, { table_id: e.target.value || null })} aria-label={`Table for ${g.name}`} className={inputClass}>
                  <option value="">No table</option>
                  {tables.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <button onClick={() => confirm(`Remove ${g.name}?`) && run(() => remove(g.id))} className="justify-self-end rounded-full p-2 text-ink-soft hover:bg-line hover:text-ink" aria-label={`Remove ${g.name}`}>
                  <TrashIcon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
