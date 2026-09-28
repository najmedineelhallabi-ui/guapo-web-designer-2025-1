import type { ReactNode } from 'react'

/** Field style without a width, for inputs that set their own */
export const inputBase =
  'rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand'
export const inputClass = `w-full ${inputBase}`

export const btnPrimary = 'rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50'
export const btnBrand = 'rounded-full bg-brand px-5 py-2.5 text-sm font-bold transition hover:bg-brand-strong disabled:opacity-50'
export const btnGhost = 'rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold transition hover:border-ink disabled:opacity-50'

export function Card({ title, action, children, className = '' }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl border border-line bg-white p-5 sm:p-6 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-lg font-bold">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  )
}

export function Stat({ value, label, tone = '' }: { value: ReactNode; label: string; tone?: string }) {
  return (
    <div className={`rounded-2xl p-4 ${tone || 'bg-cream'}`}>
      <p className="text-2xl font-extrabold tabular-nums">{value}</p>
      <p className="text-xs font-semibold text-ink-soft">{label}</p>
    </div>
  )
}

export function Progress({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
    </div>
  )
}

export const euro = (n: number) => n.toLocaleString(undefined, { style: 'currency', currency: 'EUR', maximumFractionDigits: n % 1 ? 2 : 0 })

export function ErrorText({ error }: { error: string }) {
  return error ? <p className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700" role="alert">{error}</p> : null
}
