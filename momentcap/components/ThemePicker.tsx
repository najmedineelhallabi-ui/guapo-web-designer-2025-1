'use client'

import { THEMES, type ThemeId } from '@/lib/albumRules'

export default function ThemePicker({ value, onChange }: { value: ThemeId; onChange: (t: ThemeId) => void }) {
  return (
    <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Album color">
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          role="radio"
          aria-checked={value === t.id}
          onClick={() => onChange(t.id)}
          className={`flex flex-col items-center gap-1.5 rounded-2xl p-2 text-xs font-semibold transition ${value === t.id ? 'ring-2 ring-ink' : 'hover:bg-line/50'}`}
        >
          <span className="h-10 w-10 rounded-full border border-black/10" style={{ background: t.color }} />
          {t.label}
        </button>
      ))}
    </div>
  )
}
