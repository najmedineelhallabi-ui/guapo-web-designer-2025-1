'use client'

import { CheckIcon } from '@/components/Icons'
import { PACKS, SUBSCRIPTIONS, euroPrice, planPrice, tierRank, upgradePrice, type Billing, type PlanId, type Tier } from '@/lib/pricing'

/** One-shot packs. With `current`, shows what's already owned and the price difference. */
export function PackCards({
  current,
  selected,
  onSelect,
  cta
}: {
  current?: Tier
  selected?: Tier
  onSelect?: (t: Tier) => void
  cta?: (t: Tier) => React.ReactNode
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {PACKS.map((p) => {
        const owned = current !== undefined && tierRank(p.id) <= tierRank(current)
        const isSelected = selected === p.id
        const popular = p.id === 'event'
        const price = current !== undefined && !owned ? upgradePrice(current, p.id) : p.price
        const Tag = onSelect ? 'button' : 'div'
        return (
          <Tag
            key={p.id}
            {...(onSelect ? { type: 'button' as const, onClick: () => onSelect(p.id), 'aria-pressed': isSelected, disabled: owned && p.id !== current } : {})}
            className={`relative flex flex-col rounded-3xl border-2 p-6 text-left transition ${
              isSelected ? 'border-ink bg-brand-soft' : popular ? 'border-brand bg-white' : 'border-line bg-white'
            } ${onSelect && !owned ? 'hover:border-ink' : ''} ${owned && p.id !== current ? 'opacity-50' : ''}`}
          >
            {popular && <span className="absolute -top-3 right-5 rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">Most complete</span>}
            <p className="text-lg font-extrabold">{p.name}</p>
            <p className="text-sm text-ink-soft">{p.tagline}</p>
            <p className="mt-4 text-4xl font-extrabold">
              {euroPrice(price)}
              {p.price > 0 && <span className="text-sm font-semibold text-ink-soft"> once</span>}
            </p>
            {current !== undefined && !owned && price !== p.price && <p className="text-xs font-semibold text-ink-soft">You only pay the difference</p>}
            {owned && p.id === current && <p className="text-xs font-bold">Your current pack</p>}
            <ul className="mt-5 flex-1 space-y-2 text-sm">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <CheckIcon className="h-5 w-5 shrink-0" /> {h}
                </li>
              ))}
            </ul>
            {cta && <div className="mt-6">{cta(p.id)}</div>}
          </Tag>
        )
      })}
    </div>
  )
}

export function BillingToggle({ billing, onChange }: { billing: Billing; onChange: (b: Billing) => void }) {
  return (
    <div className="inline-flex rounded-full border border-line bg-white p-1" role="radiogroup" aria-label="Billing">
      {(['month', 'year'] as const).map((b) => (
        <button
          key={b}
          type="button"
          role="radio"
          aria-checked={billing === b}
          onClick={() => onChange(b)}
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${billing === b ? 'bg-ink text-white' : 'text-ink-soft hover:text-ink'}`}
        >
          {b === 'month' ? 'Monthly' : 'Yearly · 2 months free'}
        </button>
      ))}
    </div>
  )
}

export function SubscriptionCards({
  billing,
  cta,
  currentPlan
}: {
  billing: Billing
  cta: (id: PlanId) => React.ReactNode
  currentPlan?: PlanId | null
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {SUBSCRIPTIONS.map((s) => {
        const featured = s.id === 'pro'
        const price = planPrice(s, billing)
        return (
          <div key={s.id} className={`relative flex flex-col rounded-3xl p-6 ${featured ? 'bg-ink text-white' : 'border-2 border-line bg-white'}`}>
            {featured && <span className="absolute -top-3 right-5 rounded-full bg-brand px-3 py-1 text-xs font-bold text-ink">Most popular</span>}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-extrabold">{s.name}</p>
                <p className={`text-sm ${featured ? 'text-white/70' : 'text-ink-soft'}`}>{s.audience}</p>
              </div>
              {currentPlan === s.id && <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-ink">Current</span>}
            </div>
            <p className="mt-4 text-4xl font-extrabold">
              {euroPrice(price)}
              <span className={`text-sm font-semibold ${featured ? 'text-white/70' : 'text-ink-soft'}`}> / {billing}</span>
            </p>
            {billing === 'year' && (
              <p className={`text-xs font-semibold ${featured ? 'text-brand' : 'text-ink-soft'}`}>
                ≈ {euroPrice(Math.round((price / 12) * 100) / 100)} / month
              </p>
            )}
            <ul className="mt-5 flex-1 space-y-2 text-sm">
              {s.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <CheckIcon className={`h-5 w-5 shrink-0 ${featured ? 'text-brand' : ''}`} /> {h}
                </li>
              ))}
            </ul>
            <div className="mt-6">{cta(s.id)}</div>
          </div>
        )
      })}
    </div>
  )
}
