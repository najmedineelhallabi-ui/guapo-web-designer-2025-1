'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { Wordmark } from '@/components/Logo'
import Countdown from '@/components/album/Countdown'
import { UpgradePanel } from '@/components/pricing/Locked'
import ThemeScope from '@/components/album/ThemeScope'
import { getAlbum, type AppAlbum, type AppPhoto } from '@/lib/api'
import { challengeStatus, uploadState } from '@/lib/albumRules'

const SLIDE_MS = 6000
const POLL_MS = 8000

export default function LiveSlideshow() {
  const params = useParams()
  const code = String(params.code || '').toUpperCase()

  const [album, setAlbum] = useState<AppAlbum | null>(null)
  const [photos, setPhotos] = useState<AppPhoto[]>([])
  const [index, setIndex] = useState(0)
  const [fresh, setFresh] = useState<Set<string>>(new Set())
  const [error, setError] = useState('')
  const [url, setUrl] = useState('')
  const [showUi, setShowUi] = useState(true)
  const known = useRef<Set<string>>(new Set())
  const photosRef = useRef<AppPhoto[]>([])
  const queue = useRef<string[]>([])
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = useCallback(async () => {
    try {
      const v = await getAlbum(code)
      if (v.locked) return setError('This album is protected by a code. Open it once on this screen first.')
      setAlbum(v.album)
      const approved = v.photos.filter((p) => p.status === 'approved')
      // New photos jump the queue so guests see theirs quickly
      const added = approved.filter((p) => !known.current.has(p.id))
      if (known.current.size > 0 && added.length) {
        queue.current.push(...added.map((p) => p.id))
        setFresh((prev) => new Set([...prev, ...added.map((p) => p.id)]))
      }
      approved.forEach((p) => known.current.add(p.id))
      photosRef.current = approved
      setPhotos(approved)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the album')
    }
  }, [code])

  useEffect(() => {
    setUrl(`${window.location.origin}/album/${code}`)
    load()
    const id = setInterval(load, POLL_MS)
    return () => clearInterval(id)
  }, [code, load])

  const current = photos[index % Math.max(photos.length, 1)]

  const next = useCallback(() => {
    const list = photosRef.current
    const queued = queue.current.shift()
    const qi = queued ? list.findIndex((p) => p.id === queued) : -1
    setIndex((i) => (qi >= 0 ? qi : list.length ? (i + 1) % list.length : 0))
  }, [])

  // Images advance on a timer; videos advance when they end
  useEffect(() => {
    if (!current || current.kind === 'video') return
    const id = setTimeout(next, SLIDE_MS)
    return () => clearTimeout(id)
  }, [current, next])

  const poke = () => {
    setShowUi(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setShowUi(false), 3000)
  }

  useEffect(() => {
    poke()
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  if (error) {
    return <div className="flex min-h-screen items-center justify-center bg-black p-8 text-center text-white">{error}</div>
  }
  if (!album) {
    return <div className="flex min-h-screen items-center justify-center bg-black text-white/60">Loading…</div>
  }

  if (!album.features.slideshow) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream p-6">
        <div className="w-full max-w-md">
          <UpgradePanel code={code} feature="slideshow" current={album.effective_tier}>
            Show every guest&apos;s photo on the big screen, live, with the QR code to join.
          </UpgradePanel>
        </div>
      </div>
    )
  }

  const state = uploadState(album.settings)
  // Most recently started challenge that's still running
  const liveChallenge = album.challenges
    .filter((c) => c.starts_at && challengeStatus(c) === 'active')
    .sort((a, b) => (b.starts_at || '').localeCompare(a.starts_at || ''))[0]

  return (
    <ThemeScope theme={album.theme} className={`fixed inset-0 overflow-hidden bg-black text-white ${showUi ? '' : 'cursor-none'}`}>
      <div className="absolute inset-0" onMouseMove={poke} onClick={poke}>
        {current ? (
          current.kind === 'video' ? (
            <video key={current.id} src={current.url} autoPlay muted playsInline onEnded={next} onError={next} className="h-full w-full object-contain" />
          ) : (
            <>
              <img key={`bg-${current.id}`} src={current.url} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-2xl" />
              <img key={current.id} src={current.url} alt={`Photo by ${current.contributor_name}`} className="animate-[fadein_0.8s_ease] relative h-full w-full object-contain" />
            </>
          )
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
            <p className="text-5xl font-extrabold">{album.name}</p>
            {!state.open && state.reason === 'not_yet' ? (
              <>
                <p className="text-xl text-white/70">Photo sharing opens in</p>
                <Countdown target={state.opensAt} onDone={load} dark />
              </>
            ) : (
              <p className="text-2xl text-white/70">Scan the code and share the first photo! 📸</p>
            )}
          </div>
        )}
      </div>

      {liveChallenge && (
        <div className="pointer-events-none absolute left-1/2 top-6 max-w-[70%] -translate-x-1/2 rounded-full bg-brand px-6 py-3 text-center text-lg font-extrabold text-ink shadow-2xl">
          🎯 New challenge: {liveChallenge.name}
        </div>
      )}

      {current && (
        <div className="pointer-events-none absolute bottom-6 left-6 rounded-2xl bg-black/50 px-5 py-3 backdrop-blur">
          {fresh.has(current.id) && <p className="text-xs font-bold uppercase tracking-wider text-brand">Just added</p>}
          <p className="text-2xl font-bold">{current.contributor_name}</p>
        </div>
      )}

      <div className="absolute bottom-6 right-6 flex items-center gap-4 rounded-3xl bg-white p-4 text-ink shadow-2xl">
        <div className="text-right">
          <Wordmark className="ml-auto h-7" />
          <p className="mt-1 max-w-48 text-lg font-extrabold leading-tight">Add your photos!</p>
          <p className="text-sm text-ink-soft">{photos.length} shared</p>
        </div>
        <div className="rounded-xl bg-brand p-2">
          <div className="rounded-lg bg-white p-1.5">
            <QRCodeSVG value={url || ' '} size={112} />
          </div>
        </div>
      </div>

      <div className={`absolute left-4 top-4 flex gap-2 transition ${showUi ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        <Link href={`/album/${code}`} className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/25">
          ← Exit
        </Link>
        <button
          onClick={() => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {})}
          className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/25"
        >
          Full screen
        </button>
        {photos.length > 1 && (
          <button onClick={next} className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/25">
            Next →
          </button>
        )}
      </div>
    </ThemeScope>
  )
}
