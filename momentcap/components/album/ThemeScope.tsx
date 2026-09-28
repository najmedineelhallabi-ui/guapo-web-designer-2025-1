import type { CSSProperties, ReactNode } from 'react'
import { themeInfo } from '@/lib/albumRules'

/** Applies an album's color theme to everything inside it. */
export default function ThemeScope({ theme, children, className = '' }: { theme: string; children: ReactNode; className?: string }) {
  const t = themeInfo(theme)
  const style = {
    '--color-brand': t.color,
    '--color-brand-strong': t.strong,
    '--color-brand-soft': t.soft
  } as CSSProperties
  return (
    <div style={style} className={className}>
      {children}
    </div>
  )
}
