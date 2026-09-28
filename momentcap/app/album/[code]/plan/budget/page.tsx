'use client'

import { useState } from 'react'
import { TrashIcon } from '@/components/Icons'
import { usePlan, useSection } from '@/components/plan/PlanContext'
import { Card, ErrorText, Progress, Stat, btnPrimary, euro, inputClass, inputBase } from '@/components/plan/ui'
import { setBudgetTotal } from '@/lib/api'
import { BUDGET_CATEGORIES, budgetStats, type BudgetItem } from '@/lib/planRules'

export default function BudgetPage() {
  const { plan, setPlan, code } = usePlan()
  const { save, remove } = useSection('budget')
  const [draft, setDraft] = useState({ category: BUDGET_CATEGORIES[0], label: '', planned: '', paid: '' })
  const [total, setTotal] = useState(plan.budget_total === null ? '' : String(plan.budget_total))
  const [error, setError] = useState('')

  const run = async (fn: () => Promise<unknown>) => {
    setError('')
    try {
      await fn()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const s = budgetStats(plan)
  const byCategory = [...new Set(plan.budget.map((b) => b.category))]
    .map((c) => ({ c, planned: plan.budget.filter((b) => b.category === c).reduce((n, b) => n + b.planned, 0) }))
    .sort((a, b) => b.planned - a.planned)
  const maxCat = Math.max(1, ...byCategory.map((x) => x.planned))

  const saveTotal = () =>
    run(async () => {
      const { budget_total } = await setBudgetTotal(code, total ? Number(total) : null)
      setPlan((p) => ({ ...p, budget_total }))
    })

  const field = (b: BudgetItem, key: 'planned' | 'paid') => (
    <input
      type="number"
      min={0}
      step="0.01"
      defaultValue={b[key] || ''}
      onBlur={(e) => Number(e.target.value || 0) !== b[key] && run(() => save({ ...b, [key]: Number(e.target.value || 0) }))}
      aria-label={`${key === 'planned' ? 'Planned' : 'Paid'} for ${b.label || b.category}`}
      className={`${inputClass} text-right tabular-nums`}
    />
  )

  return (
    <div className="space-y-6">
      <Card>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat value={plan.budget_total === null ? '—' : euro(plan.budget_total)} label="Total budget" tone="bg-brand-soft" />
          <Stat value={euro(s.planned)} label="Planned" />
          <Stat value={euro(s.paid)} label="Paid" tone="bg-green-50" />
          <Stat value={euro(s.toPay)} label="Left to pay" />
        </div>
        {plan.budget_total !== null && (
          <div className="mt-4">
            <Progress value={s.planned} max={plan.budget_total} />
            <p className={`mt-2 text-sm font-semibold ${s.remaining! < 0 ? 'text-red-700' : ''}`}>
              {s.remaining! < 0 ? `${euro(-s.remaining!)} over budget` : `${euro(s.remaining!)} still available`}
            </p>
          </div>
        )}
        <div className="mt-4 flex items-center gap-2">
          <label htmlFor="total" className="text-sm font-semibold">Total budget (€)</label>
          <input id="total" type="number" min={0} value={total} onChange={(e) => setTotal(e.target.value)} onBlur={saveTotal} placeholder="e.g. 15000" className={`${inputBase} w-36`} />
        </div>
      </Card>

      <Card title="Expenses">
        <form
          className="grid gap-2 sm:grid-cols-[10rem_1fr_7rem_7rem_auto]"
          onSubmit={(e) => {
            e.preventDefault()
            run(async () => {
              await save({ category: draft.category, label: draft.label, planned: Number(draft.planned || 0), paid: Number(draft.paid || 0) })
              setDraft({ ...draft, label: '', planned: '', paid: '' })
            })
          }}
        >
          <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} aria-label="Category" className={inputClass}>
            {BUDGET_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="What (e.g. Venue rental)" aria-label="Description" maxLength={100} className={inputClass} />
          <input type="number" min={0} step="0.01" value={draft.planned} onChange={(e) => setDraft({ ...draft, planned: e.target.value })} placeholder="Planned €" aria-label="Planned amount" className={inputClass} />
          <input type="number" min={0} step="0.01" value={draft.paid} onChange={(e) => setDraft({ ...draft, paid: e.target.value })} placeholder="Paid €" aria-label="Paid amount" className={inputClass} />
          <button type="submit" className={btnPrimary}>Add</button>
        </form>
        <ErrorText error={error} />

        {plan.budget.length > 0 && (
          <ul className="mt-5 divide-y divide-line">
            <li className="hidden grid-cols-[10rem_1fr_7rem_7rem_2.5rem] gap-2 pb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft sm:grid">
              <span>Category</span>
              <span>What</span>
              <span className="text-right">Planned</span>
              <span className="text-right">Paid</span>
              <span />
            </li>
            {plan.budget.map((b) => (
              <li key={b.id} className="grid grid-cols-2 gap-2 py-2.5 sm:grid-cols-[10rem_1fr_7rem_7rem_2.5rem] sm:items-center">
                <span className="text-sm font-semibold">{b.category}</span>
                <span className="truncate text-sm">{b.label || '—'}</span>
                {field(b, 'planned')}
                {field(b, 'paid')}
                <button onClick={() => run(() => remove(b.id))} className="justify-self-end rounded-full p-1.5 text-ink-soft hover:bg-line" aria-label={`Delete ${b.label || b.category}`}>
                  <TrashIcon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {byCategory.length > 0 && (
        <Card title="By category">
          <ul className="space-y-2">
            {byCategory.map(({ c, planned }) => (
              <li key={c} className="grid grid-cols-[8rem_1fr_6rem] items-center gap-3 text-sm">
                <span className="truncate font-semibold">{c}</span>
                <span className="h-3 overflow-hidden rounded-full bg-line">
                  <span className="block h-full rounded-full bg-brand" style={{ width: `${(planned / maxCat) * 100}%` }} />
                </span>
                <span className="text-right tabular-nums">{euro(planned)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
