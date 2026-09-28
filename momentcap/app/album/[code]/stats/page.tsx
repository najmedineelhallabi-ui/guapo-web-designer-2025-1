'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'
import ThemeScope from '@/components/album/ThemeScope'
import { getAlbum, type AlbumView } from '@/lib/api'
import { REACTIONS } from '@/lib/albumRules'

type OpenView = Extract<AlbumView, { locked: false }>

function Bars({ rows, empty }: { rows: { label: string; value: number }[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  if (rows.length === 0) return <p className="text-sm text-ink-soft">{empty}</p>
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.label} className="grid grid-cols-[minmax(0,8rem)_1fr_2.5rem] items-center gap-3 text-sm">
          <span className="truncate font-semibold">{r.label}</span>
          <span className="h-3 overflow-hidden rounded-full bg-line">
            <span className="block h-full rounded-full bg-brand" style={{ width: `${(r.value / max) * 100}%` }} />
          </span>
          <span className="text-right tabular-nums text-ink-soft">{r.value}</span>
        </li>
      ))}
    </ul>
  )
}

export default function StatsPage() {
  const params = useParams()
  const code = String(params.code || '').toUpperCase()
  const [view, setView] = useState<OpenView | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAlbum(code)
      .then((v) => {
        if (!v.locked && v.isOrganizer) setView(v)
        else setError('Only the organizers can see the stats.')
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load the album'))
      .finally(() => setLoading(false))
  }, [code])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-ink" />
      </div>
    )
  }
  if (!view) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader cta={false} />
        <p className="p-10 text-center text-ink-soft">{error}</p>
      </div>
    )
  }

  const { album, photos, guestbook } = view
  const guests = new Set(photos.map((p) => p.guest_id)).size
  const reactionsTotal = photos.reduce((n, p) => n + REACTIONS.reduce((m, r) => m + (p.reactions[r.id] || 0), 0), 0)

  const byName = new Map<string, number>()
  photos.forEach((p) => byName.set(p.contributor_name, (byName.get(p.contributor_name) || 0) + 1))
  const contributors = [...byName.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 8)

  const byHour = new Map<string, number>()
  photos.forEach((p) => {
    const d = new Date(p.created_at)
    const key = `${d.toLocaleDateString([], { day: 'numeric', month: 'short' })} ${String(d.getHours()).padStart(2, '0')}h`
    byHour.set(key, (byHour.get(key) || 0) + 1)
  })
  const hours = [...byHour.entries()].map(([label, value]) => ({ label, value }))

  const moments = album.moments.map((m) => ({ label: m.name, value: photos.filter((p) => p.moment_id === m.id).length }))
  const challenges = album.challenges.map((c) => ({ label: c.name, value: photos.filter((p) => p.challenge_id === c.id).length }))

  const score = (p: (typeof photos)[number]) => REACTIONS.reduce((m, r) => m + (p.reactions[r.id] || 0), 0)
  const loved = [...photos].filter((p) => score(p) > 0).sort((a, b) => score(b) - score(a)).slice(0, 3)

  const tiles = [
    { label: 'Photos', value: photos.filter((p) => p.kind === 'image').length },
    { label: 'Videos', value: photos.filter((p) => p.kind === 'video').length },
    { label: 'Guests who shared', value: guests },
    { label: 'Messages', value: guestbook.length },
    { label: 'Reactions', value: reactionsTotal },
    { label: 'To review', value: photos.filter((p) => p.status === 'pending').length }
  ]
  const card = 'rounded-3xl border border-line bg-white p-6'

  return (
    <ThemeScope theme={album.theme} className="flex min-h-screen flex-col">
      <SiteHeader cta={false} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
        <Link href={`/album/${album.qr_code}`} className="text-sm font-semibold text-ink-soft hover:text-ink">
          ← Back to album
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Stats</h1>
        <p className="mt-1 text-ink-soft">{album.name}</p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-3xl border border-line bg-white p-5">
              <p className="text-3xl font-extrabold tabular-nums">{t.value}</p>
              <p className="mt-1 text-sm text-ink-soft">{t.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className={card}>
            <h2 className="mb-4 font-bold">Top contributors</h2>
            <Bars rows={contributors} empty="No photos yet." />
          </section>
          <section className={card}>
            <h2 className="mb-4 font-bold">When photos were shared</h2>
            <Bars rows={hours} empty="No photos yet." />
          </section>
          {moments.length > 0 && (
            <section className={card}>
              <h2 className="mb-4 font-bold">Moments</h2>
              <Bars rows={moments} empty="" />
            </section>
          )}
          {challenges.length > 0 && (
            <section className={card}>
              <h2 className="mb-4 font-bold">🎯 Challenges</h2>
              <Bars rows={challenges} empty="" />
            </section>
          )}
        </div>

        {loved.length > 0 && (
          <section className={`${card} mt-6`}>
            <h2 className="mb-4 font-bold">Most loved</h2>
            <div className="grid grid-cols-3 gap-3">
              {loved.map((p) => (
                <figure key={p.id}>
                  {p.kind === 'video' ? (
                    <video src={p.url} muted playsInline className="aspect-square w-full rounded-2xl object-cover" />
                  ) : (
                    <img src={p.url} alt={`Photo by ${p.contributor_name}`} className="aspect-square w-full rounded-2xl object-cover" />
                  )}
                  <figcaption className="mt-1 text-sm">
                    <span className="font-semibold">{p.contributor_name}</span> · {score(p)} ❤️
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
      </main>
    </ThemeScope>
  )
}
