'use client'

import { useState } from 'react'
import { TrashIcon } from '@/components/Icons'
import { usePlan, useSection } from '@/components/plan/PlanContext'
import { Card, ErrorText, Progress, btnBrand, btnGhost, btnPrimary, inputClass, inputBase } from '@/components/plan/ui'
import { guestStats, type Guest, type Table } from '@/lib/planRules'

const seatsUsed = (guests: Guest[], tableId: string) => guests.filter((g) => g.table_id === tableId && g.rsvp !== 'no').reduce((n, g) => n + g.party_size, 0)

export default function SeatingPage() {
  const { plan, album } = usePlan()
  const tables = useSection('tables')
  const guests = useSection('guests')
  const [newTable, setNewTable] = useState({ name: '', seats: 8 })
  const [bulk, setBulk] = useState(5)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const run = async (fn: () => Promise<unknown>) => {
    setError('')
    setBusy(true)
    try {
      await fn()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  // Guests who still need a seat: confirmed first, then those who haven't answered
  const unseated = plan.guests
    .filter((g) => !g.table_id && g.rsvp !== 'no')
    .sort((a, b) => (a.rsvp === b.rsvp ? a.group.localeCompare(b.group) || a.name.localeCompare(b.name) : a.rsvp === 'yes' ? -1 : 1))
  const stats = guestStats(plan.guests)

  const addTables = (count: number) =>
    run(async () => {
      const start = plan.tables.length
      for (let i = 1; i <= count; i++) await tables.save({ name: `Table ${start + i}`, seats: newTable.seats })
    })

  // Fills tables group by group, keeping families/friends together when they fit
  const autoAssign = () =>
    run(async () => {
      const free = new Map(plan.tables.map((t) => [t.id, t.seats - seatsUsed(plan.guests, t.id)]))
      const byGroup = new Map<string, Guest[]>()
      for (const g of unseated.filter((g) => g.rsvp === 'yes')) byGroup.set(g.group || '', [...(byGroup.get(g.group || '') || []), g])
      const moves: [Guest, string][] = []
      for (const members of [...byGroup.values()].sort((a, b) => b.length - a.length)) {
        for (const g of members) {
          // Prefer the table where this group already sits
          const groupTable = moves.find(([m]) => m.group === g.group && g.group)?.[1]
          const candidates = [groupTable, ...plan.tables.map((t) => t.id)].filter((id): id is string => Boolean(id))
          const target = candidates.find((id) => (free.get(id) || 0) >= g.party_size)
          if (!target) continue
          free.set(target, (free.get(target) || 0) - g.party_size)
          moves.push([g, target])
        }
      }
      for (const [g, tableId] of moves) await guests.save({ ...g, table_id: tableId })
      if (moves.length === 0) setError('No confirmed guest could be placed — add tables or seats.')
    })

  const tableCard = (t: Table) => {
    const seated = plan.guests.filter((g) => g.table_id === t.id && g.rsvp !== 'no').sort((a, b) => a.name.localeCompare(b.name))
    const used = seatsUsed(plan.guests, t.id)
    const over = used > t.seats
    return (
      <li key={t.id} className="break-inside-avoid rounded-3xl border border-line bg-white p-4 print:rounded-none print:border-ink">
        <div className="flex items-center gap-2">
          <input
            defaultValue={t.name}
            onBlur={(e) => e.target.value !== t.name && run(() => tables.save({ ...t, name: e.target.value }))}
            aria-label="Table name"
            className="min-w-0 flex-1 rounded-lg bg-transparent px-1 font-bold focus:bg-cream focus:outline-none print:hidden"
          />
          <span className="hidden font-bold print:inline">{t.name}</span>
          <span className={`shrink-0 text-sm font-bold ${over ? 'text-red-700' : 'text-ink-soft'}`}>
            {used}/
            <input
              type="number"
              min={1}
              max={100}
              defaultValue={t.seats}
              onBlur={(e) => Number(e.target.value) !== t.seats && run(() => tables.save({ ...t, seats: Number(e.target.value) }))}
              aria-label="Seats"
              className="w-10 rounded bg-transparent text-center focus:bg-cream focus:outline-none print:hidden"
            />
            <span className="hidden print:inline">{t.seats}</span>
          </span>
          <button onClick={() => confirm(`Delete ${t.name}? Its guests become unseated.`) && run(() => tables.remove(t.id))} className="rounded-full p-1.5 text-ink-soft hover:bg-line print:hidden" aria-label={`Delete ${t.name}`}>
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 print:hidden">
          <Progress value={used} max={t.seats} />
        </div>
        <ul className="mt-3 space-y-1 text-sm">
          {seated.map((g) => (
            <li key={g.id} className="flex items-center justify-between gap-2">
              <span className="truncate">
                {g.name}
                {g.party_size > 1 && <span className="text-ink-soft"> +{g.party_size - 1}</span>}
                {g.rsvp === 'pending' && <span className="text-ink-soft print:hidden"> (?)</span>}
              </span>
              <button onClick={() => run(() => guests.save({ ...g, table_id: null }))} className="shrink-0 text-xs font-semibold text-ink-soft underline print:hidden">
                Remove
              </button>
            </li>
          ))}
          {seated.length === 0 && <li className="text-ink-soft print:hidden">Empty</li>}
        </ul>
      </li>
    )
  }

  return (
    <div className="space-y-6">
      <div className="hidden print:block">
        <h1 className="text-2xl font-extrabold">{album.name} — Seating plan</h1>
      </div>

      <Card className="print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm">
              <span className="text-2xl font-extrabold">{stats.seated}</span> / {stats.people} confirmed people seated ·{' '}
              {plan.tables.reduce((n, t) => n + t.seats, 0)} seats on {plan.tables.length} tables
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={autoAssign} disabled={busy || unseated.length === 0 || plan.tables.length === 0} className={btnBrand}>
              Seat everyone automatically
            </button>
            <button onClick={() => window.print()} disabled={plan.tables.length === 0} className={btnGhost}>
              Print
            </button>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (newTable.name.trim()) run(async () => {
                await tables.save(newTable)
                setNewTable({ ...newTable, name: '' })
              })
            }}
          >
            <input value={newTable.name} onChange={(e) => setNewTable({ ...newTable, name: e.target.value })} placeholder="Table name (e.g. Honor table)" aria-label="Table name" maxLength={60} className={inputClass} />
            <input type="number" min={1} max={100} value={newTable.seats} onChange={(e) => setNewTable({ ...newTable, seats: Number(e.target.value) })} aria-label="Seats" className={`${inputBase} w-20`} />
            <button type="submit" className={btnPrimary}>Add</button>
          </form>
          <div className="flex items-center gap-2 text-sm">
            <span>or add</span>
            <input type="number" min={1} max={50} value={bulk} onChange={(e) => setBulk(Number(e.target.value))} aria-label="Number of tables" className={`${inputBase} w-16`} />
            <span>tables of {newTable.seats}</span>
            <button onClick={() => addTables(Math.min(Math.max(bulk, 1), 50))} disabled={busy} className={btnGhost}>
              Add
            </button>
          </div>
        </div>
        <ErrorText error={error} />
      </Card>

      {unseated.length > 0 && (
        <Card title={`Not seated yet (${unseated.length})`} className="print:hidden">
          {plan.tables.length === 0 ? (
            <p className="text-sm text-ink-soft">Add tables first.</p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {unseated.map((g) => (
                <li key={g.id} className="flex items-center gap-2 rounded-2xl bg-cream px-3 py-2">
                  <span className="min-w-0 flex-1 truncate text-sm">
                    <span className="font-semibold">{g.name}</span>
                    {g.party_size > 1 && ` +${g.party_size - 1}`}
                    <span className="text-ink-soft">
                      {g.group ? ` · ${g.group}` : ''}
                      {g.rsvp === 'pending' ? ' · no answer' : ''}
                    </span>
                  </span>
                  <select value="" onChange={(e) => e.target.value && run(() => guests.save({ ...g, table_id: e.target.value }))} aria-label={`Seat ${g.name}`} className={`${inputBase} w-36 shrink-0`}>
                    <option value="">Seat at…</option>
                    {plan.tables.map((t) => {
                      const free = t.seats - seatsUsed(plan.guests, t.id)
                      return (
                        <option key={t.id} value={t.id}>
                          {t.name} ({free} free)
                        </option>
                      )
                    })}
                  </select>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {plan.tables.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3">{plan.tables.map(tableCard)}</ul>
      ) : (
        <p className="text-center text-sm text-ink-soft print:hidden">No tables yet.</p>
      )}
    </div>
  )
}
