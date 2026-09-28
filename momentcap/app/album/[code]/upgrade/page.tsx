'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'
import ThemeScope from '@/components/album/ThemeScope'
import { PackCards } from '@/components/pricing/Cards'
import { getAlbum, getConfig, purchasePack, type AppAlbum } from '@/lib/api'
import { atLeast, euroPrice, packInfo, upgradePrice, type Tier } from '@/lib/pricing'

function Checkout() {
  const params = useParams()
  const search = useSearchParams()
  const router = useRouter()
  const code = String(params.code || '').toUpperCase()
  const justCreated = search.get('created') === '1'
  const eventGoal = search.get('goal') === 'event'

  const [album, setAlbum] = useState<AppAlbum | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [demoPayments, setDemoPayments] = useState(false)
  const [selected, setSelected] = useState<Tier>((search.get('pack') as Tier) || 'event')
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-ink" />
      </div>
    )
  }

  const current = album?.effective_tier || 'free'
  const target = atLeast(current, selected) ? (current === 'photos' ? 'event' : selected) : selected
  const price = upgradePrice(current, target)
  const next = eventGoal ? `/album/${code}/plan` : justCreated ? `/album/${code}/share?created=1` : `/album/${code}`

  const pay = async () => {
    setPaying(true)
    setError('')
    try {
      const updated = await purchasePack(code, target)
      setAlbum(updated)
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setPaying(false)
    }
  }

  return (
    <ThemeScope theme={album?.theme || 'sun'} className="flex min-h-screen flex-col">
      <SiteHeader cta={false} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        {!album || !isOwner ? (
          <p className="mt-10 text-center text-ink-soft">{error || 'Only the album owner can choose its pack.'}</p>
        ) : done ? (
          <div className="mx-auto mt-6 max-w-lg rounded-3xl bg-brand p-8 text-center">
            <p className="text-5xl" aria-hidden="true">🎉</p>
            <h1 className="mt-4 text-2xl font-extrabold">{packInfo(album.tier).name} pack unlocked!</h1>
            <p className="mt-2">Everything is ready for {album.name}.</p>
            <button onClick={() => router.push(next)} className="mt-6 rounded-full bg-ink px-6 py-3 font-semibold text-white">
              Continue
            </button>
          </div>
        ) : album.subscription_covered && album.effective_tier === 'event' ? (
          <div className="mx-auto mt-6 max-w-lg rounded-3xl bg-brand-soft p-8 text-center">
            <h1 className="text-2xl font-extrabold">You&apos;re subscribed 🎉</h1>
            <p className="mt-2">Your subscription already unlocks everything on this album.</p>
            <Link href={next} className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-white">
              Back to the album
            </Link>
          </div>
        ) : current === 'event' ? (
          <div className="mx-auto mt-6 max-w-lg rounded-3xl bg-brand-soft p-8 text-center">
            <h1 className="text-2xl font-extrabold">This album has every feature</h1>
            <Link href={next} className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-white">
              Back to the album
            </Link>
          </div>
        ) : (
          <>
            {justCreated && (
              <div className="mb-6 rounded-3xl bg-brand p-5">
                <p className="text-lg font-extrabold">Your {eventGoal ? 'event' : 'album'} is created! 🎉</p>
                <p>Last step: confirm your pack.</p>
              </div>
            )}
            <h1 className="text-3xl font-extrabold tracking-tight">Choose a pack for {album.name}</h1>
            <p className="mt-1 text-ink-soft">
              Current pack: <span className="font-semibold text-ink">{packInfo(current).name}</span>. Pay once, keep it forever.
            </p>

            <div className="mt-8">
              <PackCards current={current} selected={target} onSelect={(t) => t !== 'free' && setSelected(t)} />
            </div>

            <div className="sticky bottom-4 z-10 mx-auto mt-8 flex max-w-xl flex-col items-center gap-2 rounded-3xl border border-line bg-white p-4 shadow-xl sm:flex-row sm:justify-between">
              <p className="font-semibold">
                {packInfo(target).name} · <span className="text-2xl font-extrabold">{euroPrice(price)}</span>
              </p>
              <button onClick={pay} disabled={paying || price === 0} className="w-full rounded-full bg-ink px-8 py-3.5 font-bold text-white disabled:opacity-50 sm:w-auto">
                {paying ? 'Processing…' : `Pay ${euroPrice(price)}`}
              </button>
            </div>
            {error && <p className="mx-auto mt-4 max-w-xl rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700" role="alert">{error}</p>}
            {demoPayments && <p className="mt-3 text-center text-xs text-ink-soft">Demo mode: no real payment is taken.</p>}

            <div className="mt-8 flex flex-col items-center gap-2 text-sm">
              {justCreated && (
                <Link href={eventGoal ? `/album/${code}/plan` : `/album/${code}/share?created=1`} className="font-semibold underline underline-offset-4">
                  Continue with the Free pack
                </Link>
              )}
              <Link href="/pricing#subscriptions" className="text-ink-soft hover:text-ink">
                You organize events often? See Pro subscriptions →
              </Link>
            </div>
          </>
        )}
      </main>
    </ThemeScope>
  )
}

export default function Page() {
  return (
    <Suspense>
      <Checkout />
    </Suspense>
  )
}
