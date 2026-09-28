'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Webcam from 'react-webcam'
import { QRCodeSVG } from 'qrcode.react'
import { v4 as uuidv4 } from 'uuid'
import { addWatermark, compressImage } from '@/lib/photoUtils'
import { getAlbum, uploadPhoto, type AppAlbum, type AppPhoto } from '@/lib/api'
import { useAuth } from '@/lib/useAuth'
import Logo from '@/components/Logo'
import { CameraIcon, UploadIcon, ImageIcon, DownloadIcon, ChevronIcon, ShareIcon, XIcon } from '@/components/Icons'

const MAX_FILE_MB = 20

export default function AlbumPage() {
  const params = useParams()
  const code = params.code as string
  const { user } = useAuth()

  const [album, setAlbum] = useState<AppAlbum | null>(null)
  const [photos, setPhotos] = useState<AppPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [inviteId] = useState(() => uuidv4())
  const [contributorName, setContributorName] = useState('')
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [zipping, setZipping] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const webcamRef = useRef<Webcam>(null)

  const uploading = progress !== null
  const isOwner = Boolean(user && album && user.id === album.owner_id)
  const albumUrl = typeof window !== 'undefined' ? `${window.location.origin}/album/${code}` : ''

  // Remember the guest's name between visits
  useEffect(() => {
    try {
      setContributorName(localStorage.getItem('mc_guest_name') || '')
    } catch {}
  }, [])

  useEffect(() => {
    if (!code) return
    getAlbum(code)
      .then((result) => {
        if (result) {
          setAlbum(result.album)
          setPhotos(result.photos)
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error loading album'))
      .finally(() => setLoading(false))
  }, [code])

  const processAndUpload = async (file: File) => {
    if (!album) return
    let processed = await compressImage(file)
    if (!album.is_paid) {
      const watermarked = await addWatermark(processed, true)
      processed = new File([watermarked], file.name, { type: 'image/jpeg' })
    }
    const photo = await uploadPhoto(album, processed, contributorName.trim() || 'Guest', inviteId)
    setPhotos((prev) => [...prev, photo])
  }

  const uploadFiles = async (files: File[]) => {
    if (!album || files.length === 0) return
    setError('')
    try {
      localStorage.setItem('mc_guest_name', contributorName.trim())
    } catch {}

    const tooBig = files.filter((f) => f.size > MAX_FILE_MB * 1024 * 1024)
    const valid = files.filter((f) => f.size <= MAX_FILE_MB * 1024 * 1024)
    const failures: string[] = tooBig.map((f) => `${f.name} is over ${MAX_FILE_MB} MB`)

    setProgress({ done: 0, total: valid.length })
    for (const [i, file] of valid.entries()) {
      try {
        await processAndUpload(file)
      } catch (err) {
        failures.push(`${file.name}: ${err instanceof Error ? err.message : 'upload failed'}`)
      }
      setProgress({ done: i + 1, total: valid.length })
    }
    setProgress(null)
    if (failures.length) setError(failures.join(' · '))
  }

  const capturePhoto = async () => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (!imageSrc) return
    const blob = await (await fetch(imageSrc)).blob()
    await uploadFiles([new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' })])
  }

  const downloadZip = async () => {
    if (!album || photos.length === 0) return
    setZipping(true)
    try {
      const { default: JSZip } = await import('jszip')
      const zip = new JSZip()
      await Promise.all(
        photos.map(async (p, i) => {
          const blob = await (await fetch(p.url)).blob()
          const who = p.contributor_name.replace(/[^\w-]+/g, '_') || 'guest'
          zip.file(`${String(i + 1).padStart(3, '0')}-${who}.jpg`, blob)
        })
      )
      const content = await zip.generateAsync({ type: 'blob' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(content)
      a.download = `${album.name.replace(/[^\w-]+/g, '_') || 'album'}.zip`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      setError('Could not create the ZIP file. Please try again.')
    } finally {
      setZipping(false)
    }
  }

  // Lightbox keyboard navigation
  const step = useCallback(
    (delta: number) => setLightbox((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length]
  )
  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, step])

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

  if (!album) {
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

  const isExpired = new Date(album.created_at).getTime() + 7 * 24 * 60 * 60 * 1000 < Date.now()
  const current = lightbox !== null ? photos[lightbox] : null

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            {isOwner && (
              <Link href="/dashboard" className="text-sm font-semibold text-ink-soft hover:text-ink">
                ← My albums
              </Link>
            )}
          </div>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">{album.name}</h1>
          <p className="mt-1 text-ink-soft">
            {photos.length} photo{photos.length !== 1 ? 's' : ''} shared
            {album.location ? ` · ${album.location}` : ''}
          </p>
          {isExpired && (
            <p className="mt-3 inline-block rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
              Album expired — photos will be deleted soon
            </p>
          )}

          {isOwner && (
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => setShowShare((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold transition hover:border-ink"
              >
                <ShareIcon /> {showShare ? 'Hide QR code' : 'Share with guests'}
              </button>
              <button
                onClick={downloadZip}
                disabled={zipping || photos.length === 0}
                className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold transition hover:border-ink disabled:opacity-40"
              >
                <DownloadIcon /> {zipping ? 'Preparing ZIP…' : 'Download all (ZIP)'}
              </button>
            </div>
          )}

          {isOwner && showShare && (
            <div className="mt-4 flex flex-col items-center gap-4 rounded-2xl bg-cream p-4 sm:flex-row">
              <div className="rounded-xl bg-white p-3">
                <QRCodeSVG value={albumUrl} size={140} />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold">Guests scan this to add photos</p>
                <p className="mt-1 font-mono text-lg font-bold tracking-[0.2em]">{album.qr_code}</p>
                <p className="mt-1 break-all text-sm text-ink-soft">{albumUrl}</p>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Upload Section */}
        <section className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">Add your photos</h2>

          <div className="mt-5">
            <label htmlFor="contributor" className="mb-2 block text-sm font-semibold">Your name</label>
            <input
              id="contributor"
              type="text"
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              placeholder="So everyone knows who took it"
              className="w-full rounded-xl border border-line px-4 py-3 focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowCamera(!showCamera)}
              disabled={uploading}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-5 font-bold transition hover:bg-brand-strong disabled:opacity-50"
            >
              <CameraIcon className="h-7 w-7" />
              {showCamera ? 'Hide camera' : 'Take a photo'}
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-5 font-bold text-white transition hover:bg-black disabled:opacity-50"
            >
              <UploadIcon className="h-7 w-7" />
              Upload photos
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              uploadFiles(Array.from(e.target.files || []))
              e.target.value = ''
            }}
            className="hidden"
          />

          {progress && (
            <div className="mt-4">
              <div className="flex justify-between text-sm font-semibold">
                <span>Uploading…</span>
                <span>{progress.done} / {progress.total}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-brand transition-all"
                  style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}

          {/* Camera Section */}
          {showCamera && (
            <div className="mt-4 overflow-hidden rounded-2xl bg-ink p-3">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: 'environment' }}
                className="w-full rounded-xl"
              />
              <div className="mt-3 flex gap-3">
                <button
                  onClick={capturePhoto}
                  disabled={uploading}
                  className="flex-1 rounded-full bg-brand py-3 font-bold transition hover:bg-brand-strong disabled:opacity-50"
                >
                  {uploading ? 'Uploading…' : 'Capture'}
                </button>
                <button
                  onClick={() => setShowCamera(false)}
                  className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {!album.is_paid && (
            <p className="mt-4 text-sm text-ink-soft">
              Photos in free albums get a small MomentCap watermark. Max {MAX_FILE_MB} MB per photo.
            </p>
          )}
        </section>

        {/* Photos Gallery */}
        <section className="mt-10">
          <h2 className="text-xl font-bold">Photos <span className="text-ink-soft">({photos.length})</span></h2>

          {photos.length === 0 ? (
            <div className="mt-4 rounded-3xl border-2 border-dashed border-line bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft">
                <ImageIcon className="h-7 w-7" />
              </div>
              <p className="mt-4 font-semibold">No photos yet</p>
              <p className="mt-1 text-ink-soft">Be the first to add one!</p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {photos.map((photo, i) => (
                <button
                  key={photo.id}
                  onClick={() => setLightbox(i)}
                  className="group relative overflow-hidden rounded-2xl bg-line text-left focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <img
                    src={photo.url}
                    alt={`Photo by ${photo.contributor_name}`}
                    className="aspect-square w-full object-cover transition group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                    <span className="block truncate text-sm font-semibold">{photo.contributor_name}</span>
                    <span className="block text-xs text-white/80">
                      {new Date(photo.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <p className="mt-12 text-center text-sm text-ink-soft">
          This album is kept for 7 days unless the organizer upgrades it.
        </p>
      </main>

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <div className="flex items-center justify-between p-4" onClick={(e) => e.stopPropagation()}>
            <div>
              <p className="font-semibold">{current.contributor_name}</p>
              <p className="text-sm text-white/60">{(lightbox ?? 0) + 1} / {photos.length}</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={current.url}
                download={`momentcap-${current.id}.jpg`}
                className="rounded-full p-2 transition hover:bg-white/10"
                aria-label="Download photo"
              >
                <DownloadIcon className="h-6 w-6" />
              </a>
              <button onClick={() => setLightbox(null)} className="rounded-full p-2 transition hover:bg-white/10" aria-label="Close">
                <XIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-6">
            <img
              src={current.url}
              alt={`Photo by ${current.contributor_name}`}
              className="max-h-full max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {photos.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); step(-1) }}
                  className="absolute left-2 rounded-full bg-black/50 p-2 transition hover:bg-black/80"
                  aria-label="Previous photo"
                >
                  <ChevronIcon dir="left" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); step(1) }}
                  className="absolute right-2 rounded-full bg-black/50 p-2 transition hover:bg-black/80"
                  aria-label="Next photo"
                >
                  <ChevronIcon dir="right" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
