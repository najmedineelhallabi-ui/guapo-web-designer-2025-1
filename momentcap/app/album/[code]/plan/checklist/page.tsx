'use client'

import { useState } from 'react'
import { TrashIcon } from '@/components/Icons'
import { usePlan, useSection } from '@/components/plan/PlanContext'
import { Card, ErrorText, Progress, btnBrand, btnPrimary, inputClass } from '@/components/plan/ui'
import { seedChecklist } from '@/lib/api'
import { formatEventDate } from '@/lib/dates'
import type { Task } from '@/lib/planRules'

export default function ChecklistPage() {
  const { plan, setPlan, code, album } = usePlan()
  const { save, remove } = useSection('tasks')
  const [draft, setDraft] = useState({ title: '', due: '' })
  const [error, setError] = useState('')
  const [showDone, setShowDone] = useState(false)

  const run = async (fn: () => Promise<unknown>) => {
    setError('')
    try {
      await fn()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  // Tick instantly, roll back if saving fails
  const toggle = (t: Task) => {
    setPlan((p) => ({ ...p, tasks: p.tasks.map((x) => (x.id === t.id ? { ...x, done: !t.done } : x)) }))
    save({ ...t, done: !t.done }).catch((err) => {
      setPlan((p) => ({ ...p, tasks: p.tasks.map((x) => (x.id === t.id ? { ...x, done: t.done } : x)) }))
      setError(err instanceof Error ? err.message : 'Could not save')
    })
  }

  const today = new Date().toISOString().slice(0, 10)
  const open = plan.tasks.filter((t) => !t.done).sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'))
  const done = plan.tasks.filter((t) => t.done)
  const overdue = open.filter((t) => t.due && t.due < today)
  const upcoming = open.filter((t) => !t.due || t.due >= today)

  const row = (t: Task) => (
    <li key={t.id} className="flex items-center gap-3 py-2.5">
      <input type="checkbox" checked={t.done} onChange={() => toggle(t)} aria-label={`Done: ${t.title}`} className="h-5 w-5 shrink-0 accent-ink" />
      <div className="min-w-0 flex-1">
        <p className={`truncate ${t.done ? 'text-ink-soft line-through' : 'font-semibold'}`}>{t.title}</p>
        <p className="text-xs text-ink-soft">{t.category}</p>
      </div>
      <input
        type="date"
        value={t.due || ''}
        onChange={(e) => run(() => save({ ...t, due: e.target.value || null }))}
        aria-label={`Due date for ${t.title}`}
        className={`w-36 shrink-0 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm hover:border-line focus:border-ink focus:outline-none ${
          !t.done && t.due && t.due < today ? 'font-bold text-red-700' : 'text-ink-soft'
        }`}
      />
      <button onClick={() => run(() => remove(t.id))} className="shrink-0 rounded-full p-1.5 text-ink-soft hover:bg-line" aria-label={`Delete ${t.title}`}>
        <TrashIcon className="h-4 w-4" />
      </button>
    </li>
  )

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm">
            <span className="text-2xl font-extrabold">{done.length}</span> / {plan.tasks.length} tasks done
            {overdue.length > 0 && <span className="ml-2 font-semibold text-red-700">· {overdue.length} late</span>}
          </p>
          <button
            onClick={() =>
              run(async () => {
                const { tasks } = await seedChecklist(code)
                setPlan((p) => ({ ...p, tasks, checklist_seeded: true }))
              })
            }
            className={btnBrand}
          >
            {plan.checklist_seeded ? 'Add missing suggestions' : 'Add the suggested checklist'}
          </button>
        </div>
        <div className="mt-3">
          <Progress value={done.length} max={plan.tasks.length} />
        </div>
        {!album.event_date && <p className="mt-3 text-xs text-ink-soft">Set the event date to get due dates.</p>}
        <form
          className="mt-5 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault()
            if (draft.title.trim()) run(async () => {
              await save({ title: draft.title, due: draft.due || null, category: 'Mine' })
              setDraft({ title: '', due: '' })
            })
          }}
        >
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="New task, e.g. Book the hairdresser" aria-label="New task" maxLength={140} className={inputClass} />
          <input type="date" value={draft.due} onChange={(e) => setDraft({ ...draft, due: e.target.value })} aria-label="Due date" className={`${inputClass} sm:w-44`} />
          <button type="submit" className={btnPrimary}>Add</button>
        </form>
        <ErrorText error={error} />
      </Card>

      {overdue.length > 0 && (
        <Card title={<span className="text-red-700">Late ({overdue.length})</span>}>
          <ul className="divide-y divide-line">{overdue.map(row)}</ul>
        </Card>
      )}

      <Card title={`To do (${upcoming.length})`}>
        {upcoming.length === 0 ? <p className="text-sm text-ink-soft">Nothing left to do 🎉</p> : <ul className="divide-y divide-line">{upcoming.map(row)}</ul>}
      </Card>

      {done.length > 0 && (
        <Card title={`Done (${done.length})`} action={<button onClick={() => setShowDone((v) => !v)} className="text-sm font-semibold underline">{showDone ? 'Hide' : 'Show'}</button>}>
          {showDone && <ul className="divide-y divide-line">{done.map(row)}</ul>}
          {!showDone && <p className="text-sm text-ink-soft">Last done: {done[done.length - 1].title}{done[done.length - 1].due ? ` (${formatEventDate(done[done.length - 1].due!)})` : ''}</p>}
        </Card>
      )}
    </div>
  )
}
