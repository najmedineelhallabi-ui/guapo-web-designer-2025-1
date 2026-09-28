'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import StatusBadge from '@/components/StatusBadge'
import ThemeScope from '@/components/album/ThemeScope'
import { ImageIcon, SettingsIcon, ShareIcon } from '@/components/Icons'
import { useRequireAuth } from '@/lib/useAuth'
import { listAlbums, type AppAlbum } from '@/lib/api'
import { eventTypeInfo } from '@/lib/albumRules'
import { formatEventDate } from '@/lib/dates'
import { packInfo } from '@/lib/pricing'

export default function Dashboard() {
  const { user, loading: authLoading } = useRequireAuth('/dashboard')
  const [albums, setAlbums] = useState<AppAlbum[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const userId = user?.id
  useEffect(() => {
    if (!userId) return
    listAlbums()
      .then(setAlbums)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load your albums'))
      .finally(() => setLoading(false))
  }, [userId])

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-ink" />
      </div>
    )
  }

  const firstName = user.name.split(' ')[0]
  const totalPhotos = albums.reduce((n, a) => n + (a.photo_count || 0), 0)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader cta={false} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {firstName ? `Hi ${firstName}` : 'Your albums'}
            </h1>
            <p className="mt-1 text-ink-soft">
              {albums.length > 0
                ? `${albums.length} album${albums.length > 1 ? 's' : ''} · ${totalPhotos} photo${totalPhotos !== 1 ? 's' : ''} collected`
                : 'Create an album, share the QR code, collect every photo.'}
            </p>
          </div>
          <Link
            href="/dashboard/new"
            className="rounded-full bg-brand px-6 py-3 text-center font-bold transition hover:bg-brand-strong"
          >
            + New album
          </Link>
        </div>

        {error && (
          <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-3xl bg-white" />
            ))}
          </div>
        ) : albums.length === 0 ? (
          <div className="mt-8 rounded-3xl border-2 border-dashed border-line bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft">
              <ImageIcon className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-xl font-bold">No albums yet</h2>
            <p className="mt-1 text-ink-soft">Create your first one — it takes under a minute.</p>
            <Link
              href="/dashboard/new"
              className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-bold transition hover:bg-brand-strong"
            >
              Create an album
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((a) => {
              const type = eventTypeInfo(a.event_type)
              return (
                <ThemeScope key={a.id} theme={a.theme} className="flex flex-col overflow-hidden rounded-3xl border border-line bg-white transition hover:border-ink">
                  {a.cover_url ? <img src={a.cover_url} alt="" className="h-28 w-full object-cover" /> : <div className="h-2 bg-brand" />}
                  <div className="flex flex-1 flex-col p-5">
                  <Link href={`/album/${a.qr_code}`} className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-2xl" aria-hidden="true">
                        {type.emoji}
                      </span>
                      <span className="flex flex-col items-end gap-1">
                        <StatusBadge settings={a.settings} />
                        {a.role === 'co_organizer' && <span className="text-xs font-semibold text-ink-soft">Shared with you</span>}
                        <span className="text-xs font-semibold">
                          {a.subscription_covered ? '⭐ Pro' : a.effective_tier === 'free' ? 'Free' : `⭐ ${packInfo(a.effective_tier).name}`}
                        </span>
                      </span>
                    </div>
                    <h2 className="mt-4 text-lg font-bold leading-tight">{a.name}</h2>
                    <p className="mt-1 text-sm text-ink-soft">
                      {formatEventDate(a.event_date)}
                      {a.location ? ` · ${a.location}` : ''}
                    </p>
                    <p className="mt-3 text-sm font-semibold">
                      {a.photo_count || 0} photo{a.photo_count === 1 ? '' : 's'}
                    </p>
                  </Link>
                  <div className="mt-4 flex gap-2 border-t border-line pt-4">
                    <Link
                      href={`/album/${a.qr_code}/plan`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand py-2 text-sm font-bold transition hover:bg-brand-strong"
                    >
                      Plan
                    </Link>
                    <Link
                      href={`/album/${a.qr_code}/share`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink py-2 text-sm font-semibold text-white transition hover:bg-black"
                    >
                      <ShareIcon className="h-4 w-4" /> Share
                    </Link>
                    <Link
                      href={`/album/${a.qr_code}/settings`}
                      aria-label="Settings"
                      className="flex w-11 items-center justify-center gap-1.5 rounded-full border border-line py-2 text-sm font-semibold transition hover:border-ink"
                    >
                      <SettingsIcon className="h-4 w-4" />
                      <span className="sr-only">Settings</span>
                    </Link>
                  </div>
                  </div>
                </ThemeScope>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
