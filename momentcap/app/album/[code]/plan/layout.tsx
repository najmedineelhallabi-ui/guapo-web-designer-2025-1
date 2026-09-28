'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'
import ThemeScope from '@/components/album/ThemeScope'
import { PlanContext } from '@/components/plan/PlanContext'
import { getPlan, type AppAlbum, type Plan } from '@/lib/api'

const TABS = [
  ['', 'Overview'],
  ['event', 'Invitation'],
  ['guests', 'Guests'],
  ['seating', 'Seating'],
  ['checklist', 'Checklist'],
  ['budget', 'Budget'],
  ['vendors', 'Vendors']
] as const

export default function PlanLayout({ children }: { children: ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const code = String(params.code || '').toUpperCase()
  const [album, setAlbum] = useState<AppAlbum | null>(null)
  const [plan, setPlanState] = useState<Plan | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    try {
      const res = await getPlan(code)
      setAlbum(res.album)
      setPlanState(res.plan)
      setIsOwner(res.isOwner)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the plan')
    }
  }, [code])

  useEffect(() => {
    reload()
  }, [reload])

  const setPlan = useCallback((fn: (p: Plan) => Plan) => setPlanState((p) => (p ? fn(p) : p)), [])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader cta={false} />
        <div className="mx-auto mt-16 max-w-sm rounded-3xl border border-line bg-white p-8 text-center">
          <p className="font-bold">{error}</p>
          <Link href={`/login?next=/album/${code}/plan`} className="mt-5 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-white">
            Log in
          </Link>
        </div>
      </div>
    )
  }
  if (!album || !plan) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-ink" />
      </div>
    )
  }

  const base = `/album/${code}/plan`
  const current = pathname.replace(base, '').replace(/^\//, '')

  return (
    <PlanContext.Provider value={{ code, album, setAlbum, plan, setPlan, isOwner, reload }}>
      <ThemeScope theme={album.theme} className="flex min-h-screen flex-col">
        <div className="print:hidden">
          <SiteHeader cta={false} />
        </div>
        <div className="border-b border-line bg-white print:hidden">
          <div className="mx-auto max-w-5xl px-4 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Link href="/dashboard" className="text-sm font-semibold text-ink-soft hover:text-ink">
                  ← My albums
                </Link>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{album.name}</h1>
              </div>
              <div className="flex gap-2">
                <Link href={`/album/${code}/event`} className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-ink">
                  View invitation
                </Link>
                <Link href={`/album/${code}`} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
                  Photo album
                </Link>
              </div>
            </div>
            <nav className="-mx-4 mt-5 flex gap-1 overflow-x-auto px-4" aria-label="Planner sections">
              {TABS.map(([slug, label]) => {
                const active = current === slug
                return (
                  <Link
                    key={slug}
                    href={slug ? `${base}/${slug}` : base}
                    aria-current={active ? 'page' : undefined}
                    className={`shrink-0 border-b-2 px-3 pb-3 text-sm font-semibold transition ${active ? 'border-ink text-ink' : 'border-transparent text-ink-soft hover:text-ink'}`}
                  >
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 print:p-0">{children}</main>
      </ThemeScope>
    </PlanContext.Provider>
  )
}
