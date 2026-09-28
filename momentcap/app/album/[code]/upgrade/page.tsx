'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'
import ThemeScope from '@/components/album/ThemeScope'
import { CheckIcon } from '@/components/Icons'
import { getAlbum, getConfig, upgradeAlbum, type AppAlbum } from '@/lib/api'
import { FREE_DAYS } from '@/lib/albumRules'

const PERKS = ['Keep your album forever', 'No MomentCap watermark on new photos', 'Unlimited photos and videos', 'ZIP and PDF photo book downloads', 'Priority support']

export default function UpgradePage() {
  const params = useParams()
  const code = String(params.code || '').toUpperCase()
  const [album, setAlbum] = useState<AppAlbum | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [demoPayments, setDemoPayments] = useState(false)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    Promise.all([getAlbum(code), getConfig()])
      .then(([v, config]) => {
        setDemoPayments(config.demoPayments)
        if (!v.locked) {
          setAlbum(v.album)
          setIsOwner(v.isOwner)
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load the album'))
      .finally(() => setLoading(false))
  }, [code])

  const pay = async () => {
    setPaying(true)
    setError('')
    try {
      await upgradeAlbum(code)
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-ink" />
      </div>
    )
  }

  return (
    <ThemeScope theme={album?.theme || 'sun'} className="flex min-h-screen flex-col">
      <SiteHeader cta={false} />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-10">
        {album && (
          <Link href={`/album/${album.qr_code}`} className="text-sm font-semibold text-ink-soft hover:text-ink">
            ← Back to album
          </Link>
        )}

        {!album || !isOwner ? (
          <p className="mt-10 text-center text-ink-soft">{error || 'Only the album owner can upgrade it.'}</p>
        ) : album.is_paid || done ? (
          <div className="mt-8 rounded-3xl bg-brand p-8 text-center">
            <p className="text-5xl" aria-hidden="true">🎉</p>
            <h1 className="mt-4 text-2xl font-extrabold">{album.name} is Premium!</h1>
            <p className="mt-2">Your album is kept forever, and new photos have no watermark.</p>
            <Link href={`/album/${album.qr_code}`} className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-white">
              Back to the album
            </Link>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-white shadow-xl">
            <div className="bg-brand p-8">
              <p className="text-sm font-bold uppercase tracking-wider">Premium</p>
              <h1 className="mt-1 text-2xl font-extrabold">{album.name}</h1>
              <p className="mt-4 text-5xl font-extrabold">
                €5<span className="text-base font-semibold"> one-time</span>
              </p>
            </div>
            <div className="p-8">
              <ul className="space-y-3">
                {PERKS.map((p) => (
                  <li key={p} className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5 shrink-0" /> {p}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-ink-soft">Free albums are kept for {FREE_DAYS} days.</p>
              {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
              <button onClick={pay} disabled={paying} className="mt-6 w-full rounded-full bg-ink py-4 font-bold text-white transition hover:bg-black disabled:opacity-50">
                {paying ? 'Processing…' : 'Upgrade for €5'}
              </button>
              {demoPayments && (
                <p className="mt-3 text-center text-xs text-ink-soft">Demo mode: no real payment is taken.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </ThemeScope>
  )
}
