'use client'

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { ROOM, ROOM_ELEMENTS, SEAT_MARGIN, roomLayout, tableSize, type Table } from '@/lib/planRules'

type Props = {
  tables: Table[]
  /** Seats taken per table id */
  used?: Map<string, number>
  selectedId?: string | null
  /** Table under a guest being dragged */
  dropTargetId?: string | null
  /** Table to point out (guest's own table on the invitation) */
  highlightId?: string | null
  readOnly?: boolean
  onTap?: (id: string) => void
  onMove?: (id: string, x: number, y: number) => void
}

const pct = (v: number, of: number) => `${(v / of) * 100}%`

/** Seat dots around a table, in room units relative to the table center */
function seatDots(t: Table, w: number, h: number) {
  const n = Math.min(t.seats, 24)
  if (t.shape === 'rect') {
    const top = Math.ceil(n / 2)
    const bottom = n - top
    const row = (count: number, y: number) =>
      Array.from({ length: count }, (_, i) => ({ x: -w / 2 + ((i + 0.5) * w) / count, y }))
    return [...row(top, -h / 2 - 16), ...row(bottom, h / 2 + 16)]
  }
  const r = w / 2 + 16
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    return { x: Math.cos(a) * r, y: Math.sin(a) * r }
  })
}

export default function RoomPlan({ tables, used, selectedId, dropTargetId, highlightId, readOnly, onTap, onMove }: Props) {
  const roomRef = useRef<HTMLDivElement>(null)
  // Position of the table being dragged, before it is saved
  const [dragging, setDragging] = useState<{ id: string; x: number; y: number } | null>(null)
  const drag = useRef<{ id: string; startX: number; startY: number; x: number; y: number; moved: boolean } | null>(null)
  const layout = roomLayout(tables)

  const unitsPerPx = () => ROOM.w / (roomRef.current?.getBoundingClientRect().width || ROOM.w)

  const down = (t: Table, e: ReactPointerEvent<HTMLElement>) => {
    if (readOnly) return
    const pos = layout.get(t.id)!
    drag.current = { id: t.id, startX: e.clientX, startY: e.clientY, x: pos.x, y: pos.y, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const move = (t: Table, e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current
    if (!d || d.id !== t.id) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (!d.moved && Math.hypot(dx, dy) < 5) return
    d.moved = true
    const size = tableSize(t)
    const m = (t.kind || 'table') === 'table' ? SEAT_MARGIN : 0
    const w = size.w / 2 + m
    const h = size.h / 2 + m
    const k = unitsPerPx()
    setDragging({
      id: t.id,
      x: Math.round(Math.min(Math.max(d.x + dx * k, w), ROOM.w - w)),
      y: Math.round(Math.min(Math.max(d.y + dy * k, h), ROOM.h - h))
    })
  }
  const up = (t: Table) => {
    const d = drag.current
    drag.current = null
    if (!d || d.id !== t.id) return
    if (d.moved && dragging?.id === t.id) {
      onMove?.(t.id, dragging.x, dragging.y)
      // Keep showing the new spot until the saved table comes back
      setTimeout(() => setDragging((cur) => (cur?.id === t.id ? null : cur)), 1500)
    } else if (!d.moved) onTap?.(t.id)
  }

  return (
    <div
      ref={roomRef}
      className="relative w-full select-none overflow-hidden rounded-3xl border-2 border-line bg-[radial-gradient(circle,rgba(0,0,0,0.07)_1px,transparent_1px)] bg-white [background-size:24px_24px]"
      style={{ aspectRatio: `${ROOM.w} / ${ROOM.h}` }}
    >
      {tables.map((t) => {
        const pos = dragging?.id === t.id ? dragging : layout.get(t.id)!
        const { w, h } = tableSize(t)
        const kind = t.kind || 'table'
        const box = { left: pct(pos.x - w / 2, ROOM.w), top: pct(pos.y - h / 2, ROOM.h), width: pct(w, ROOM.w), height: pct(h, ROOM.h) }
        const handlers = readOnly
          ? {}
          : { onPointerDown: (e: ReactPointerEvent<HTMLElement>) => down(t, e), onPointerMove: (e: ReactPointerEvent<HTMLElement>) => move(t, e), onPointerUp: () => up(t), onPointerCancel: () => up(t) }

        if (kind !== 'table') {
          const el = ROOM_ELEMENTS[kind]
          return (
            <div
              key={t.id}
              {...handlers}
              role={readOnly ? undefined : 'button'}
              aria-label={t.name}
              className={`absolute flex touch-none flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center ${
                kind === 'dance' ? 'border-purple-300 bg-purple-50' : 'border-line bg-cream'
              } ${selectedId === t.id ? 'ring-4 ring-ink' : ''} ${readOnly ? '' : 'cursor-grab active:cursor-grabbing'}`}
              style={box}
            >
              <span className="text-lg leading-none" aria-hidden="true">{el.emoji}</span>
              <span className="mt-0.5 max-w-full truncate px-1 text-[10px] font-bold text-ink-soft sm:text-xs">{t.name}</span>
            </div>
          )
        }

        const taken = used?.get(t.id) || 0
        const over = taken > t.seats
        const full = taken >= t.seats
        const dots = seatDots(t, w, h)
        const hot = dropTargetId === t.id || highlightId === t.id
        return (
          <div key={t.id} className="absolute" style={box}>
            {!readOnly && dots.map((d, i) => (
              <span
                key={i}
                className={`absolute rounded-full border ${
                  i < taken ? (over ? 'border-red-600 bg-red-500' : 'border-ink bg-ink') : 'border-ink-soft/40 bg-white'
                }`}
                style={{
                  width: pct(20, w),
                  height: pct(20, h),
                  left: `calc(${pct(d.x + w / 2, w)} - ${pct(10, w)})`,
                  top: `calc(${pct(d.y + h / 2, h)} - ${pct(10, h)})`
                }}
                aria-hidden="true"
              />
            ))}
            <div
              {...handlers}
              data-table-id={t.id}
              role={readOnly ? undefined : 'button'}
              aria-label={`${t.name}, ${taken} of ${t.seats} seats taken`}
              className={`absolute inset-0 flex touch-none flex-col items-center justify-center border-2 text-center shadow-sm transition-colors ${
                t.shape === 'rect' ? 'rounded-xl' : 'rounded-full'
              } ${
                hot
                  ? 'border-ink bg-brand ring-4 ring-brand/50'
                  : over
                    ? 'border-red-600 bg-red-50'
                    : full
                      ? 'border-green-700 bg-green-50'
                      : taken > 0
                        ? 'border-ink bg-brand-soft'
                        : 'border-ink-soft/50 bg-white'
              } ${selectedId === t.id ? 'ring-4 ring-ink' : ''} ${readOnly ? '' : 'cursor-grab active:cursor-grabbing'}`}
            >
              <span className="max-w-[88%] truncate text-xs font-extrabold leading-tight sm:text-sm">{t.name}</span>
              <span className={`text-xs font-semibold ${over ? 'text-red-700' : 'text-ink-soft'}`}>
                {highlightId === t.id ? '📍 You' : readOnly ? '' : `${taken}/${t.seats}`}
              </span>
            </div>
          </div>
        )
      })}
      {tables.length === 0 && (
        <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-ink-soft">Add your first table with the buttons above.</p>
      )}
    </div>
  )
}
