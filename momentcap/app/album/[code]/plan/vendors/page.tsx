'use client'

import { useState } from 'react'
import { TrashIcon } from '@/components/Icons'
import { usePlan, useSection } from '@/components/plan/PlanContext'
import { Card, ErrorText, Field, btnGhost, btnPrimary, euro, inputClass } from '@/components/plan/ui'
import { VENDOR_CATEGORIES, type Vendor } from '@/lib/planRules'

type Draft = Omit<Vendor, 'id' | 'price' | 'deposit'> & { id?: string; price: string; deposit: string }

const empty: Draft = { category: VENDOR_CATEGORIES[0], name: '', contact: '', phone: '', email: '', price: '', deposit: '', notes: '' }

export default function VendorsPage() {
  const { plan } = usePlan()
  const { save, remove } = useSection('vendors')
  const [draft, setDraft] = useState<Draft | null>(null)
  const [error, setError] = useState('')

  const run = async (fn: () => Promise<unknown>) => {
    setError('')
    try {
      await fn()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const totalPrice = plan.vendors.reduce((n, v) => n + v.price, 0)
  const totalDeposit = plan.vendors.reduce((n, v) => n + v.deposit, 0)
  const set = (patch: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...patch } : d))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft?.name.trim()) return
    run(async () => {
      await save({ ...draft, price: Number(draft.price || 0), deposit: Number(draft.deposit || 0) })
      setDraft(null)
    })
  }

  return (
    <div className="space-y-6">
      <Card
        title={`Vendors (${plan.vendors.length})`}
        action={!draft && <button onClick={() => setDraft({ ...empty })} className={btnPrimary}>+ Add a vendor</button>}
      >
        {plan.vendors.length > 0 && (
          <p className="text-sm text-ink-soft">
            Total {euro(totalPrice)} · deposits paid {euro(totalDeposit)} · <span className="font-semibold text-ink">left to pay {euro(Math.max(0, totalPrice - totalDeposit))}</span>
          </p>
        )}

        {draft && (
          <form onSubmit={submit} className="mt-4 grid gap-3 rounded-2xl bg-cream p-4 sm:grid-cols-2">
            <Field label="Category" htmlFor="v-cat">
              <select id="v-cat" value={draft.category} onChange={(e) => set({ category: e.target.value })} className={inputClass}>
                {VENDOR_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Name" htmlFor="v-name">
              <input id="v-name" value={draft.name} onChange={(e) => set({ name: e.target.value })} required maxLength={100} placeholder="Company or person" className={inputClass} />
            </Field>
            <Field label="Contact person" htmlFor="v-contact">
              <input id="v-contact" value={draft.contact} onChange={(e) => set({ contact: e.target.value })} maxLength={100} className={inputClass} />
            </Field>
            <Field label="Phone" htmlFor="v-phone">
              <input id="v-phone" type="tel" value={draft.phone} onChange={(e) => set({ phone: e.target.value })} maxLength={40} className={inputClass} />
            </Field>
            <Field label="Email" htmlFor="v-email">
              <input id="v-email" type="email" value={draft.email} onChange={(e) => set({ email: e.target.value })} maxLength={200} className={inputClass} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price €" htmlFor="v-price">
                <input id="v-price" type="number" min={0} step="0.01" value={draft.price} onChange={(e) => set({ price: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Deposit paid €" htmlFor="v-dep">
                <input id="v-dep" type="number" min={0} step="0.01" value={draft.deposit} onChange={(e) => set({ deposit: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Notes" htmlFor="v-notes">
                <textarea id="v-notes" value={draft.notes} onChange={(e) => set({ notes: e.target.value })} maxLength={1000} rows={3} placeholder="Arrival time, what's included, contract…" className={inputClass} />
              </Field>
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <button type="submit" className={btnPrimary}>{draft.id ? 'Save' : 'Add vendor'}</button>
              <button type="button" onClick={() => setDraft(null)} className={btnGhost}>Cancel</button>
            </div>
          </form>
        )}
        <ErrorText error={error} />
      </Card>

      {plan.vendors.length === 0 && !draft ? (
        <p className="text-center text-sm text-ink-soft">No vendors yet — add your caterer, photographer, DJ…</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {plan.vendors.map((v) => (
            <li key={v.id} className="rounded-3xl border border-line bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">{v.category}</p>
                  <p className="truncate text-lg font-bold">{v.name}</p>
                  {v.contact && <p className="text-sm">{v.contact}</p>}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => setDraft({ ...v, price: v.price ? String(v.price) : '', deposit: v.deposit ? String(v.deposit) : '' })} className="rounded-full px-3 py-1 text-sm font-semibold underline">
                    Edit
                  </button>
                  <button onClick={() => confirm(`Delete ${v.name}?`) && run(() => remove(v.id))} className="rounded-full p-1.5 text-ink-soft hover:bg-line" aria-label={`Delete ${v.name}`}>
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {v.phone && <a href={`tel:${v.phone}`} className="rounded-full bg-cream px-3 py-1 font-semibold">📞 {v.phone}</a>}
                {v.email && <a href={`mailto:${v.email}`} className="rounded-full bg-cream px-3 py-1 font-semibold">✉️ Email</a>}
              </div>
              {(v.price > 0 || v.deposit > 0) && (
                <p className="mt-3 text-sm">
                  {euro(v.price)} · deposit {euro(v.deposit)} · <span className="font-semibold">left {euro(Math.max(0, v.price - v.deposit))}</span>
                </p>
              )}
              {v.notes && <p className="mt-2 whitespace-pre-line text-sm text-ink-soft">{v.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
