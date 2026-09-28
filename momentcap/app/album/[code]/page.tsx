'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Logo from '@/components/Logo'
import ThemeScope from '@/components/album/ThemeScope'
import PinGate from '@/components/album/PinGate'
import UploadBox from '@/components/album/UploadBox'
import Gallery, { applyFilter, type GalleryFilter } from '@/components/album/Gallery'
import Lightbox from '@/components/album/Lightbox'
import Guestbook from '@/components/album/Guestbook'
import Challenges from '@/components/album/Challenges'
import OrganizerBar from '@/components/album/OrganizerBar'
import {
  deletePhoto,
  getAlbum,
  moderatePhoto,
  react,
  setAlbumPin,
  toggleFavorite,
  ApiError,
  type AlbumView,
  type AppPhoto,
  type AppGuestbookEntry
} from '@/lib/api'
import { eventTypeInfo, uploadState, FREE_DAYS, type ReactionId } from '@/lib/albumRules'
import { formatEventDate } from '@/lib/dates'

type OpenView = Extract<AlbumView, { locked: false }>

export default function AlbumPage() {
  const params = useParams()
  const code = String(params.code || '').toUpperCase()

  const [view, setView] = useState<AlbumView | null>(null)
  const [photos, setPhotos] = useState<AppPhoto[]>([])
  const [guestbook, setGuestbook] = useState<AppGuestbookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [pinError, setPinError] = useState('')
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<GalleryFilter>('all')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [challengeId, setChallengeId] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const v = await getAlbum(code)
      setView(v)
      if (!v.locked) {
        setPhotos(v.photos)
        setGuestbook(v.guestbook)
      }
      setPinError('')
    } catch (err) {
      if (err instanceof ApiError && err.code === 'pin_wrong') {
        setAlbumPin(code, null)
        setPinError('Wrong code, try again.')
        const v = await getAlbum(code).catch(() => null)
        if (v) setView(v)
      } else if (err instanceof ApiError && err.status === 404) {
        setNotFound(true)
      } else {
        setError(err instanceof Error ? err.message : 'Could not load the album')
      }
    } finally {
      setLoading(false)
    }
  }, [code])

  useEffect(() => {
    load()
  }, [load])

  // Reveal scheduled challenges (and close ended ones) right on time
  const nextChange = (() => {
    if (!view || view.locked) return null
    const now = Date.now()
    const times = [
      view.album.next_challenge_at,
      ...view.album.challenges.flatMap((c) => [c.starts_at, c.ends_at])
    ]
      .filter((t): t is string => Boolean(t))
      .map((t) => Date.parse(t))
      .filter((t) => t > now)
    return times.length ? Math.min(...times) : null
  })()
  useEffect(() => {
    if (!nextChange) return
    const delay = nextChange - Date.now() + 1000
    if (delay > 24 * 3600 * 1000) return
    const id = setTimeout(load, delay)
    return () => clearTimeout(id)
  }, [nextChange, load])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-ink-soft">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-ink" />
          Loading album…
        </div>
      </div>
    )
  }

  if (view?.locked) {
    return (
      <PinGate
        album={view.album}
        error={pinError}
        onSubmit={(pin) => {
          setAlbumPin(code, pin)
          load()
        }}
      />
    )
  }

  if (!view || notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <Logo />
        <div className="mt-8 w-full max-w-sm rounded-3xl border border-line bg-white p-8">
          <h1 className="text-xl font-bold">Album not found</h1>
          <p className="mt-2 text-ink-soft">
            Check the code <span className="font-mono font-semibold text-ink">{code}</span> or scan the QR code again.
          </p>
          {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        </div>
      </div>
    )
  }

  const { album, isOrganizer } = view as OpenView
  const type = eventTypeInfo(album.event_type)
  const expired = !album.is_paid && Date.parse(album.created_at) + FREE_DAYS * 864e5 < Date.now()
  const canUpload = isOrganizer || uploadState(album.settings).open
  const shown = applyFilter(photos, filter)

  const updatePhoto = (id: string, patch: Partial<AppPhoto>) => setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))

  const handle = async (fn: () => Promise<void>) => {
    try {
      await fn()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const onReact = (photo: AppPhoto, reaction: ReactionId) =>
    handle(async () => updatePhoto(photo.id, await react(code, photo.id, reaction)))
  const onFavorite = (photo: AppPhoto) => handle(async () => updatePhoto(photo.id, await toggleFavorite(code, photo.id)))
  const onApprove = (photo: AppPhoto) =>
    handle(async () => {
      await moderatePhoto(code, photo.id, true)
      updatePhoto(photo.id, { status: 'approved' })
      // In "To review" the approved photo leaves the list: show the next one, or close when done
      if (filter === 'pending') setLightbox((i) => (i === null || shown.length <= 1 ? null : Math.min(i, shown.length - 2)))
    })
  const onDelete = (photo: AppPhoto) =>
    handle(async () => {
      if (!confirm(photo.status === 'pending' && isOrganizer ? 'Reject this photo?' : 'Delete this photo for everyone?')) return
      await deletePhoto(code, photo.id)
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
      setLightbox((i) => (i === null || shown.length <= 1 ? null : Math.min(i, shown.length - 2)))
    })

  return (
    <ThemeScope theme={album.theme} className="min-h-screen pb-16">
      {/* Header */}
      <header className="border-b border-line bg-white">
        {album.cover_url ? (
          <div className="relative h-48 sm:h-64">
            <img src={album.cover_url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        ) : (
          <div className="h-3 bg-brand" />
        )}
        <div className="mx-auto max-w-4xl px-4 py-5">
          <div className="flex items-center justify-between">
            <Logo />
            {isOrganizer && (
              <Link href="/dashboard" className="text-sm font-semibold text-ink-soft hover:text-ink">
                ← My albums
              </Link>
            )}
          </div>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
            <span aria-hidden="true">{type.emoji} </span>
            {album.name}
          </h1>
          <p className="mt-1 text-ink-soft">
            {[formatEventDate(album.event_date), album.location, `${photos.filter((p) => p.status === 'approved').length} photos`]
              .filter(Boolean)
              .join(' · ')}
          </p>
          {album.welcome_message && <p className="mt-4 rounded-2xl bg-brand-soft px-4 py-3">{album.welcome_message}</p>}
          {expired && (
            <p className="mt-3 inline-block rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
              Free album expired — {isOrganizer ? 'upgrade to keep your photos' : 'photos will be deleted soon'}
            </p>
          )}
          {isOrganizer && (
            <OrganizerBar
              album={album}
              photos={photos}
              onReview={() => {
                setFilter('pending')
                document.getElementById('gallery-title')?.scrollIntoView({ behavior: 'smooth' })
              }}
            />
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {error && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <UploadBox
          album={album}
          isOrganizer={isOrganizer}
          myCount={photos.filter((p) => p.mine).length}
          challengeId={challengeId}
          onChallengeChange={setChallengeId}
          onUploaded={(photo) => setPhotos((prev) => [...prev, photo])}
          onOpenStateChange={load}
        />

        <Challenges album={album} photos={photos} canUpload={canUpload} isOrganizer={isOrganizer} onPick={setChallengeId} />

        <Gallery album={album} photos={photos} isOrganizer={isOrganizer} filter={filter} onFilter={setFilter} onOpen={setLightbox} />

        <Guestbook album={album} entries={guestbook} isOrganizer={isOrganizer} onChange={setGuestbook} />

        {!album.is_paid && (
          <p className="mt-12 text-center text-sm text-ink-soft">
            This free album is kept for {FREE_DAYS} days.{' '}
            {isOrganizer && (
              <Link href={`/album/${album.qr_code}/upgrade`} className="font-semibold text-ink underline underline-offset-4">
                Keep it forever
              </Link>
            )}
          </p>
        )}
      </main>

      {lightbox !== null && shown[lightbox] && (
        <Lightbox
          album={album}
          photos={shown}
          index={lightbox}
          isOrganizer={isOrganizer}
          onIndex={setLightbox}
          onReact={onReact}
          onFavorite={onFavorite}
          onApprove={onApprove}
          onDelete={onDelete}
        />
      )}
    </ThemeScope>
  )
}
