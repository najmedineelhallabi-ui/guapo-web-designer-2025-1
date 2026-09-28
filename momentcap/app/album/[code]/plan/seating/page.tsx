'use client'

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { TrashIcon } from '@/components/Icons'
import { usePlan, useSection } from '@/components/plan/PlanContext'
import RoomPlan from '@/components/plan/RoomPlan'
import { Card, ErrorText, Progress, btnBrand, btnGhost, btnPrimary, inputClass, inputBase } from '@/components/plan/ui'
import { ROOM_ELEMENTS, freeSpot, guestStats, isSeatingTable, roomLayout, tableSize, type Guest, type Table, type TableKind } from '@/lib/planRules'

const seatsUsed = (guests: Guest[], tableId: string) => guests.filter((g) => g.table_id === tableId && g.rsvp !== 'no').reduce((n, g) => n + g.party_size, 0)

export default function SeatingPage() {
  const { plan, album, setPlan } = usePlan()
  const tables = useSection('tables')
  const guests = useSection('guests')
  const [newTable, setNewTable] = useState({ name: '', seats: 8 })
  const [bulk, setBulk] = useState(5)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [view, setView] = useState<'room' | 'list'>('room')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  // Guest picked by a tap, waiting for a tap on a table
  const [pickedId, setPickedId] = useState<string | null>(null)
  // Guest being dragged with the finger or the mouse
  const [dragGuest, setDragGuest] = useState<{ guest: Guest; x: number; y: number; target: string | null; unseat: boolean } | null>(null)
  const dragStart = useRef<{ guest: Guest; x: number; y: number } | null>(null)
  const seatingTables = plan.tables.filter(isSeatingTable)
  const used = new Map(seatingTables.map((t) => [t.id, seatsUsed(plan.guests, t.id)]))
  const selected = plan.tables.find((t) => t.id === selectedId) || null
  const panelRef = useRef<HTMLElement>(null)
  // On phones the table panel sits under the room: bring it into view
  useEffect(() => {
    if (selectedId && window.innerWidth < 1024) panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedId])

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
      const start = seatingTables.length
      for (let i = 1; i <= count; i++) await tables.save({ name: `Table ${start + i}`, seats: newTable.seats })
    })

  // Fills tables group by group, keeping families/friends together when they fit
  const autoAssign = () =>
    run(async () => {
      const free = new Map(seatingTables.map((t) => [t.id, t.seats - seatsUsed(plan.guests, t.id)]))
      const byGroup = new Map<string, Guest[]>()
      for (const g of unseated.filter((g) => g.rsvp === 'yes')) byGroup.set(g.group || '', [...(byGroup.get(g.group || '') || []), g])
      const moves: [Guest, string][] = []
      for (const members of [...byGroup.values()].sort((a, b) => b.length - a.length)) {
        for (const g of members) {
          // Prefer the table where this group already sits
          const groupTable = moves.find(([m]) => m.group === g.group && g.group)?.[1]
          const candidates = [groupTable, ...seatingTables.map((t) => t.id)].filter((id): id is string => Boolean(id))
          const target = candidates.find((id) => (free.get(id) || 0) >= g.party_size)
          if (!target) continue
          free.set(target, (free.get(target) || 0) - g.party_size)
          moves.push([g, target])
        }
      }
      for (const [g, tableId] of moves) await guests.save({ ...g, table_id: tableId })
      if (moves.length === 0) setError('No confirmed guest could be placed — add tables or seats.')
    })

  const seat = (g: Guest, tableId: string | null) => {
    if (g.table_id === tableId) return
    // Optimistic: the guest moves right away, the save follows
    setPlan((p) => ({ ...p, guests: p.guests.map((x) => (x.id === g.id ? { ...x, table_id: tableId } : x)) }))
    run(() => guests.save({ ...g, table_id: tableId })).then(() => undefined)
  }

  // --- Drag a guest onto a table (mouse and touch) ---------------------------
  const dropInfo = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y)
    return {
      target: el?.closest<HTMLElement>('[data-table-id]')?.dataset.tableId || null,
      unseat: Boolean(el?.closest('[data-unseat-zone]'))
    }
  }
  const guestDown = (g: Guest, e: ReactPointerEvent<HTMLElement>) => {
    if (e.button !== 0) return
    dragStart.current = { guest: g, x: e.clientX, y: e.clientY }
  }
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const start = dragStart.current
      if (!start) return
      if (!dragGuest && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 6) return
      e.preventDefault()
      setDragGuest({ guest: start.guest, x: e.clientX, y: e.clientY, ...dropInfo(e.clientX, e.clientY) })
    }
    const onUp = (e: PointerEvent) => {
      const start = dragStart.current
      dragStart.current = null
      if (!start) return
      if (!dragGuest) {
        // A tap: pick the guest, then tap a table
        setPickedId((id) => (id === start.guest.id ? null : start.guest.id))
        return
      }
      const { target, unseat } = dropInfo(e.clientX, e.clientY)
      setDragGuest(null)
      if (target) seat(start.guest, target)
      else if (unseat) seat(start.guest, null)
    }
    // The browser took over (e.g. the list scrolled): forget the gesture
    const onCancel = () => {
      dragStart.current = null
      setDragGuest(null)
    }
    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onCancel)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onCancel)
    }
  })

  const tapTable = (id: string) => {
    const table = plan.tables.find((t) => t.id === id)
    const picked = plan.guests.find((g) => g.id === pickedId)
    if (picked && table && isSeatingTable(table)) {
      seat(picked, id)
      setPickedId(null)
    } else setSelectedId((cur) => (cur === id ? null : id))
  }

  const addElement = (kind: TableKind, shape: 'round' | 'rect' = 'round') =>
    run(async () => {
      const fields = {
        kind,
        shape,
        name: kind === 'table' ? `Table ${seatingTables.length + 1}` : ROOM_ELEMENTS[kind].label,
        seats: kind === 'table' ? (shape === 'rect' ? 10 : 8) : 0
      }
      const saved = await tables.save({ ...fields, ...freeSpot(plan.tables, tableSize({ id: '', ...fields })) })
      setSelectedId(saved.id)
    })

  const arrange = () =>
    run(async () => {
      const layout = roomLayout(plan.tables, true)
      for (const t of plan.tables) {
        const pos = layout.get(t.id)!
        await tables.save({ ...t, ...pos })
      }
    })

  // In long scrolling lists a vertical swipe scrolls; drag sideways or tap-then-tap instead
  const guestChip = (g: Guest, extra?: React.ReactNode, scroll?: 'x' | 'y') => (
    <li
      key={g.id}
      onPointerDown={(e) => guestDown(g, e)}
      className={`flex shrink-0 ${scroll === 'x' ? 'touch-pan-x' : scroll === 'y' ? 'touch-pan-y' : 'touch-none'} cursor-grab items-center gap-2 rounded-full border px-3 py-1.5 text-sm active:cursor-grabbing ${
        pickedId === g.id ? 'border-ink bg-brand font-semibold' : 'border-line bg-white hover:border-ink'
      } ${dragGuest?.guest.id === g.id ? 'opacity-40' : ''}`}
    >
      <span className="min-w-0 flex-1 truncate">
        <span className="font-semibold">{g.name}</span>
        {g.party_size > 1 && <span className="text-ink-soft"> +{g.party_size - 1}</span>}
        {g.rsvp === 'pending' && <span className="text-ink-soft"> ?</span>}
      </span>
      {extra}
    </li>
  )

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
              {seatingTables.reduce((n, t) => n + t.seats, 0)} seats on {seatingTables.length} tables
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-full border border-line bg-cream p-1 text-sm font-semibold" role="tablist" aria-label="View">
              {(['room', 'list'] as const).map((v) => (
                <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className={`rounded-full px-3 py-1.5 ${view === v ? 'bg-ink text-white' : ''}`}>
                  {v === 'room' ? '🗺 Room plan' : '☰ List'}
                </button>
              ))}
            </div>
            <button onClick={autoAssign} disabled={busy || unseated.length === 0 || seatingTables.length === 0} className={btnBrand}>
              Seat everyone automatically
            </button>
            <button onClick={() => window.print()} disabled={seatingTables.length === 0} className={btnGhost}>
              Print
            </button>
          </div>
        </div>
        {view === 'list' && <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
        </div>}
        {view === 'room' && (
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => addElement('table', 'round')} disabled={busy} className={btnPrimary}>+ Round table</button>
            <button onClick={() => addElement('table', 'rect')} disabled={busy} className={btnPrimary}>+ Long table</button>
            {(Object.keys(ROOM_ELEMENTS) as (keyof typeof ROOM_ELEMENTS)[]).map((k) => (
              <button key={k} onClick={() => addElement(k)} disabled={busy} className={btnGhost}>
                + {ROOM_ELEMENTS[k].emoji} {ROOM_ELEMENTS[k].label}
              </button>
            ))}
            <button onClick={arrange} disabled={busy || plan.tables.length === 0} className={btnGhost}>Tidy up</button>
          </div>
        )}
        <ErrorText error={error} />
      </Card>

      {view === 'room' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
          <div className="min-w-0">
            {/* Phones: guests in a sideways strip right above the room, to drag down onto a table */}
            {unseated.length > 0 && (
              <div className="mb-3 lg:hidden print:hidden">
                {pickedId ? (
                  <p className="mb-1.5 text-sm font-semibold">Now tap a table to seat {plan.guests.find((g) => g.id === pickedId)?.name}.</p>
                ) : (
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    Not seated ({unseated.length}) · drag onto a table, or tap then tap a table
                  </p>
                )}
                <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">{unseated.map((g) => guestChip(g, null, 'x'))}</ul>
              </div>
            )}
            <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
              <div className="min-w-[640px]">
                <RoomPlan
                  tables={plan.tables}
                  used={used}
                  selectedId={selectedId}
                  dropTargetId={dragGuest?.target}
                  onTap={tapTable}
                  onMove={(id, x, y) => {
                    const t = plan.tables.find((x) => x.id === id)
                    if (t) run(() => tables.save({ ...t, x, y }))
                  }}
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-ink-soft print:hidden">
              Drag tables to arrange the room. Drag a guest onto a table — or tap a guest, then tap a table.
            </p>
          </div>

          <div className="space-y-4 print:hidden">
            {selected && (
              <Card
                ref={panelRef}
                title={isSeatingTable(selected) ? 'Table' : ROOM_ELEMENTS[selected.kind as keyof typeof ROOM_ELEMENTS].label}
                action={<button onClick={() => setSelectedId(null)} className="text-sm font-semibold text-ink-soft underline">Close</button>}
              >
                <div className="flex gap-2" key={selected.id}>
                  <input
                    defaultValue={selected.name}
                    onBlur={(e) => e.target.value.trim() && e.target.value !== selected.name && run(() => tables.save({ ...selected, name: e.target.value }))}
                    aria-label="Name"
                    maxLength={60}
                    className={inputClass}
                  />
                  {isSeatingTable(selected) && (
                    <input
                      type="number"
                      min={1}
                      max={100}
                      defaultValue={selected.seats}
                      onBlur={(e) => Number(e.target.value) !== selected.seats && run(() => tables.save({ ...selected, seats: Number(e.target.value) }))}
                      aria-label="Seats"
                      className={`${inputBase} w-20`}
                    />
                  )}
                </div>
                {isSeatingTable(selected) && (
                  <>
                    <div className="mt-3 flex gap-2 text-sm">
                      {(['round', 'rect'] as const).map((shape) => (
                        <button
                          key={shape}
                          onClick={() => run(() => tables.save({ ...selected, shape }))}
                          aria-pressed={(selected.shape || 'round') === shape}
                          className={`flex-1 rounded-full border px-3 py-1.5 font-semibold ${(selected.shape || 'round') === shape ? 'border-ink bg-ink text-white' : 'border-line'}`}
                        >
                          {shape === 'round' ? '⚪ Round' : '▭ Long'}
                        </button>
                      ))}
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                      Seated · {used.get(selected.id) || 0}/{selected.seats}
                    </p>
                    <ul className="mt-2 flex flex-col gap-1.5" data-table-id={selected.id}>
                      {plan.guests
                        .filter((g) => g.table_id === selected.id && g.rsvp !== 'no')
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((g) =>
                          guestChip(
                            g,
                            <button
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={() => seat(g, null)}
                              className="shrink-0 rounded-full px-1.5 text-ink-soft hover:bg-line hover:text-ink"
                              aria-label={`Remove ${g.name} from the table`}
                            >
                              ✕
                            </button>
                          )
                        )}
                    </ul>
                    {unseated.length > 0 && (
                      <select
                        value=""
                        onChange={(e) => {
                          const g = plan.guests.find((x) => x.id === e.target.value)
                          if (g) seat(g, selected.id)
                        }}
                        aria-label={`Add a guest to ${selected.name}`}
                        className={`${inputClass} mt-3`}
                      >
                        <option value="">+ Add a guest…</option>
                        {unseated.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                            {g.party_size > 1 ? ` +${g.party_size - 1}` : ''}
                          </option>
                        ))}
                      </select>
                    )}
                  </>
                )}
                <button
                  onClick={() => confirm(`Delete ${selected.name}?`) && run(async () => { await tables.remove(selected.id); setSelectedId(null) })}
                  className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-red-700"
                >
                  <TrashIcon className="h-4 w-4" /> Delete
                </button>
              </Card>
            )}

            <div data-unseat-zone className={`${unseated.length > 0 ? 'hidden lg:block' : ''} rounded-3xl border bg-white p-5 transition ${dragGuest?.unseat ? 'border-ink bg-brand-soft' : 'border-line'}`}>
              <h2 className="text-lg font-bold">Not seated ({unseated.length})</h2>
              {pickedId && <p className="mt-1 text-sm font-semibold">Now tap a table to seat {plan.guests.find((g) => g.id === pickedId)?.name}.</p>}
              {unseated.length === 0 ? (
                <p className="mt-2 text-sm text-ink-soft">{plan.guests.length === 0 ? 'Add guests in the Guests tab first.' : 'Everyone has a seat 🎉 Drag a guest here to unseat them.'}</p>
              ) : (
                <ul className="mt-3 flex max-h-[28rem] flex-col gap-1.5 overflow-y-auto">{unseated.map((g) => guestChip(g, null, 'y'))}</ul>
              )}
            </div>
          </div>
        </div>
      )}

      {dragGuest && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-[130%] rounded-full bg-ink px-3 py-1.5 text-sm font-semibold text-white shadow-xl"
          style={{ left: dragGuest.x, top: dragGuest.y }}
        >
          {dragGuest.guest.name}
          {dragGuest.guest.party_size > 1 && ` +${dragGuest.guest.party_size - 1}`}
        </div>
      )}

      {view === 'list' && unseated.length > 0 && (
        <Card title={`Not seated yet (${unseated.length})`} className="print:hidden">
          {seatingTables.length === 0 ? (
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
                    {seatingTables.map((t) => {
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

      {view === 'list' &&
        (seatingTables.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3">{seatingTables.map(tableCard)}</ul>
        ) : (
          <p className="text-center text-sm text-ink-soft print:hidden">No tables yet.</p>
        ))}
    </div>
  )
}
