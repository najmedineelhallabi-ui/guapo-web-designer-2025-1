'use client'

import { useEffect, useState } from 'react'

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 }
}

/** Live countdown to `target`; calls onDone once it's reached. */
export default function Countdown({ target, onDone, dark = false }: { target: string; onDone?: () => void; dark?: boolean }) {
  const [now, setNow] = useState(() => Date.now())
  const end = Date.parse(target)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (now >= end) onDone?.()
  }, [now, end, onDone])

  const p = parts(end - now)
  const cells = [
    ...(p.days > 0 ? [[p.days, 'days'] as const] : []),
    [p.hours, 'hours'] as const,
    [p.minutes, 'min'] as const,
    [p.seconds, 'sec'] as const
  ]
  return (
    <div className="flex justify-center gap-2" role="timer" aria-live="off">
      {cells.map(([value, label]) => (
        <div key={label} className={`min-w-16 rounded-2xl px-3 py-2 text-center ${dark ? 'bg-white/10' : 'bg-brand-soft'}`}>
          <div className="text-2xl font-extrabold tabular-nums">{String(value).padStart(2, '0')}</div>
          <div className={`text-xs font-semibold uppercase ${dark ? 'text-white/60' : 'text-ink-soft'}`}>{label}</div>
        </div>
      ))}
    </div>
  )
}
