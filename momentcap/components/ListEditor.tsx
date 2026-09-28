'use client'

import { useState } from 'react'
import { XIcon } from './Icons'

type Item = { id?: string; name: string }

/** Small editor for a list of short texts (moments, challenges) with one-tap suggestions. */
export default function ListEditor({
  items,
  onChange,
  suggestions,
  placeholder,
  max
}: {
  items: Item[]
  onChange: (items: Item[]) => void
  suggestions: string[]
  placeholder: string
  max: number
}) {
  const [draft, setDraft] = useState('')
  const names = items.map((i) => i.name.toLowerCase())
  const add = (name: string) => {
    const n = name.trim().slice(0, 80)
    if (!n || names.includes(n.toLowerCase()) || items.length >= max) return
    onChange([...items, { name: n }])
    setDraft('')
  }
  const unused = suggestions.filter((s) => !names.includes(s.toLowerCase()))

  return (
    <div>
      {items.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <li key={item.id || item.name} className="flex items-center gap-1 rounded-full bg-brand-soft py-1.5 pl-4 pr-1.5 text-sm font-semibold">
              {item.name}
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="rounded-full p-1 hover:bg-white"
                aria-label={`Remove ${item.name}`}
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {items.length < max && (
        <div className="mt-3 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                add(draft)
              }
            }}
            maxLength={80}
            placeholder={placeholder}
            className="min-w-0 flex-1 rounded-xl border border-line bg-white px-4 py-2.5 focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <button type="button" onClick={() => add(draft)} className="rounded-full bg-ink px-5 text-sm font-semibold text-white">
            Add
          </button>
        </div>
      )}
      {unused.length > 0 && items.length < max && (
        <div className="mt-3 flex flex-wrap gap-2">
          {unused.map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="rounded-full border border-dashed border-ink-soft/50 px-3 py-1 text-sm text-ink-soft transition hover:border-ink hover:text-ink">
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
