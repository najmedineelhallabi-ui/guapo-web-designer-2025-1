'use client'

import { createContext, useCallback, useContext } from 'react'
import { deletePlanItem, savePlanItem, type AppAlbum, type Plan, type PlanSection } from '@/lib/api'
import type { BudgetItem, Guest, Table, Task, Vendor } from '@/lib/planRules'

type Ctx = {
  code: string
  album: AppAlbum
  setAlbum: (a: AppAlbum) => void
  plan: Plan
  setPlan: (fn: (p: Plan) => Plan) => void
  isOwner: boolean
  reload: () => Promise<void>
  /** Guests whose invitation answer the organizer hasn't looked at yet */
  unseenAnswers: Set<string>
  markAnswersSeen: () => void
}

export const PlanContext = createContext<Ctx | null>(null)

export function usePlan() {
  const ctx = useContext(PlanContext)
  if (!ctx) throw new Error('usePlan outside the planner')
  return ctx
}

type ItemOf = { guests: Guest; tables: Table; tasks: Task; budget: BudgetItem; vendors: Vendor }

/** Save/delete helpers for one plan section that keep the local state in sync. */
export function useSection<S extends PlanSection>(section: S) {
  const { code, setPlan } = usePlan()
  const save = useCallback(
    async (item: Partial<ItemOf[S]> & { id?: string }) => {
      const saved = await savePlanItem<ItemOf[S]>(code, section, item)
      setPlan((p) => {
        const list = p[section] as ItemOf[S][]
        const exists = list.some((x) => x.id === saved.id)
        return { ...p, [section]: exists ? list.map((x) => (x.id === saved.id ? saved : x)) : [...list, saved] }
      })
      return saved
    },
    [code, section, setPlan]
  )
  const remove = useCallback(
    async (id: string) => {
      await deletePlanItem(code, section, id)
      setPlan((p) => {
        const next = { ...p, [section]: (p[section] as { id: string }[]).filter((x) => x.id !== id) }
        if (section === 'tables') next.guests = p.guests.map((g) => (g.table_id === id ? { ...g, table_id: null } : g))
        return next
      })
    },
    [code, section, setPlan]
  )
  return { save, remove }
}
