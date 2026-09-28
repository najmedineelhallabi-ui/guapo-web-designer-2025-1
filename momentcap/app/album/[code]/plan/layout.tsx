'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'
import ThemeScope from '@/components/album/ThemeScope'
import { PlanContext } from '@/components/plan/PlanContext'
import { getPlan, type AppAlbum, type Plan } from '@/lib/api'
import { UpgradePanel } from '@/components/pricing/Locked'
import { LockIcon } from '@/components/Icons'
import type { Guest } from '@/lib/planRules'

/** How often the planner checks for new invitation answers */
const POLL_MS = 8000

const answerText = (g: Guest) => (g.rsvp === 'yes' ? `coming${g.party_size > 1 ? ` (${g.party_size} people)` : ''}` : "can't come")

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
  const seenKey = `mc_rsvp_seen_${code}`
  // When the organizer last looked at the guest list (per browser)
  const [seenAt, setSeenAt] = useState(() => {
    try {
      return typeof window === 'undefined' ? '' : localStorage.getItem(seenKey) || ''
    } catch {
      return ''
    }
  })
  const [toasts, setToasts] = useState<Guest[]>([])
  const known = useRef<Map<string, string> | null>(null)

  const markAnswersSeen = useCallback(() => {
    const now = new Date().toISOString()
    setSeenAt(now)
    try {
      localStorage.setItem(seenKey, now)
    } catch {}
  }, [seenKey])

  // Pops a notice for every answer that arrived since the last check
  const trackAnswers = useCallback((guests: Guest[]) => {
    const next = new Map(guests.filter((g) => g.answered_at).map((g) => [g.id, g.answered_at as string]))
    if (known.current) {
      const fresh = guests.filter((g) => g.answered_at && known.current?.get(g.id) !== g.answered_at)
      if (fresh.length) setToasts((t) => [...t, ...fresh].slice(-4))
    }
    known.current = next
  }, [])

  const reload = useCallback(async () => {
    try {
      const res = await getPlan(code)
      setAlbum(res.album)
      setPlanState(res.plan)
      setIsOwner(res.isOwner)
      trackAnswers(res.plan.guests)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the plan')
    }
  }, [code, trackAnswers])

  useEffect(() => {
    reload()
  }, [reload])

  // Live guest list: new invitation answers show up without reloading the page
  useEffect(() => {
    let busy = false
    const refresh = async () => {
      if (busy || document.visibilityState !== 'visible') return
      // Don't swap the list under someone who is typing in it
      const el = document.activeElement
      if (el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return
      busy = true
      try {
        const res = await getPlan(code)
        trackAnswers(res.plan.guests)
        setPlanState((p) => (p && JSON.stringify(p.guests) !== JSON.stringify(res.plan.guests) ? { ...p, guests: res.plan.guests } : p))
      } catch {
        // Offline or signed out: try again on the next tick
      } finally {
        busy = false
      }
    }
    const timer = window.setInterval(refresh, POLL_MS)
    const onStorage = (e: StorageEvent) => e.key?.includes(code) && refresh()
    document.addEventListener('visibilitychange', refresh)
    window.addEventListener('focus', refresh)
    window.addEventListener('storage', onStorage)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', refresh)
      window.removeEventListener('focus', refresh)
      window.removeEventListener('storage', onStorage)
    }
  }, [code, trackAnswers])

  useEffect(() => {
    if (!toasts.length) return
    const t = window.setTimeout(() => setToasts((list) => list.slice(1)), 7000)
    return () => window.clearTimeout(t)
  }, [toasts])

  const unseenAnswers = useMemo(
    () => new Set(!plan ? [] : plan.guests.filter((g) => g.answered_at && g.answered_at > seenAt).map((g) => g.id)),
    [plan, seenAt]
  )

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
  // Overview and checklist are free; the other tabs need the Full event pack
  const gated = (slug: string) => slug !== '' && slug !== 'checklist' && !album.features.planning

  return (
    <PlanContext.Provider value={{ code, album, setAlbum, plan, setPlan, isOwner, reload, unseenAnswers, markAnswersSeen }}>
      <ThemeScope theme={album.theme} className="flex min-h-screen flex-col">
        <div className="print:hidden">
          <SiteHeader cta={false} />
        </div>
        <div className="border-b border-line bg-white print:hidden">
          <div className="mx-auto max-w-5xl px-4 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Link href="/dashboard" className="text-sm font-semibold text-ink-soft hover:text-ink">
                  ← My events
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
                    {gated(slug) && <LockIcon className="mr-1 inline h-3.5 w-3.5" />}
                    {label}
                    {slug === 'guests' && unseenAnswers.size > 0 && (
                      <span className="ml-1.5 rounded-full bg-brand px-1.5 py-0.5 text-xs font-bold text-ink" aria-label={`${unseenAnswers.size} new answers`}>
                        {unseenAnswers.size}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 print:p-0">
          {gated(current) ? (
            <UpgradePanel code={code} feature="planning" current={album.effective_tier} isOwner={isOwner}>
              Online invitation with RSVP, guest list, seating plan with “find your table”, budget and vendors.
            </UpgradePanel>
          ) : (
            children
          )}
        </main>
        {toasts.length > 0 && (
          <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm flex-col gap-2 print:hidden" role="status" aria-live="polite">
            {toasts.map((g, i) => (
              <Link
                key={`${g.id}-${g.answered_at}-${i}`}
                href={`${base}/guests`}
                onClick={() => setToasts((t) => t.filter((x) => x !== g))}
                className="rounded-2xl bg-ink px-4 py-3 text-sm text-white shadow-xl"
              >
                <span aria-hidden="true">{g.rsvp === 'yes' ? '🎉 ' : '✉️ '}</span>
                <span className="font-bold">{g.name}</span> answered: {answerText(g)}
              </Link>
            ))}
          </div>
        )}
      </ThemeScope>
    </PlanContext.Provider>
  )
}
