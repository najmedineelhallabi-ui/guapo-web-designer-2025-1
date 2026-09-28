'use client'

import { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { CameraIcon, ClockIcon, UploadIcon } from '@/components/Icons'
import { processImage } from '@/lib/photoUtils'
import { videoDuration } from '@/lib/photoUtils'
import { uploadMedia, type AppAlbum, type AppPhoto } from '@/lib/api'
import {
  challengeStatus,
  themeInfo,
  uploadState,
  FRAMES,
  MAX_FILE_MB,
  MAX_VIDEO_MB,
  MAX_VIDEO_SECONDS,
  type FrameId
} from '@/lib/albumRules'
import { formatDateTime } from '@/lib/dates'
import Countdown from './Countdown'

const FRAME_LABELS: Record<FrameId, string> = { none: 'No frame', polaroid: 'Polaroid', event: 'Event frame' }

type Props = {
  album: AppAlbum
  isOrganizer: boolean
  myCount: number
  /** Photos + videos already in the album (for the free pack's limit) */
  totalCount: number
  /** Challenge picked from the challenges card */
  challengeId: string | null
  onChallengeChange: (id: string | null) => void
  onUploaded: (photo: AppPhoto) => void
  onOpenStateChange: () => void
}

export default function UploadBox({ album, isOrganizer, myCount, totalCount, challengeId, onChallengeChange, onUploaded, onOpenStateChange }: Props) {
  const [name, setName] = useState('')
  const [momentId, setMomentId] = useState<string>('')
  const [frame, setFrame] = useState<FrameId>('none')
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [notice, setNotice] = useState('')
  const [showCamera, setShowCamera] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const webcamRef = useRef<Webcam>(null)

  useEffect(() => {
    try {
      setName(localStorage.getItem('mc_guest_name') || '')
    } catch {}
  }, [])

  const s = album.settings
  const state = uploadState(s)
  const uploading = progress !== null
  const max = s.max_photos_per_guest
  const f = album.features
  const albumSpace = f.photoLimit === null ? null : Math.max(0, f.photoLimit - totalCount)
  const guestSpace = max === null || isOrganizer ? null : Math.max(0, max - myCount)
  const remaining = albumSpace === null ? guestSpace : guestSpace === null ? albumSpace : Math.min(albumSpace, guestSpace)
  const allowVideos = (s.allow_videos || isOrganizer) && f.videos
  const moments = f.moments ? album.moments : []

  if (!isOrganizer && !state.open) {
    return (
      <section className="rounded-3xl border border-line bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft">
          <ClockIcon className="h-7 w-7" />
        </div>
        {state.reason === 'not_yet' ? (
          <>
            <h2 className="mt-4 text-xl font-bold">Uploads open soon</h2>
            <p className="mt-1 text-ink-soft">{formatDateTime(state.opensAt)}</p>
            <div className="mt-5">
              <Countdown target={state.opensAt} onDone={onOpenStateChange} />
            </div>
          </>
        ) : (
          <>
            <h2 className="mt-4 text-xl font-bold">Uploads are closed</h2>
            <p className="mt-1 text-ink-soft">The organizer stopped collecting photos for this album.</p>
          </>
        )}
      </section>
    )
  }

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return
    setErrors([])
    setNotice('')
    try {
      localStorage.setItem('mc_guest_name', name.trim())
    } catch {}

    const failures: string[] = []
    let accepted = files
    if (remaining !== null && files.length > remaining) {
      accepted = files.slice(0, remaining)
      failures.push(`You can add ${remaining} more photo${remaining === 1 ? '' : 's'} — the others were skipped.`)
    }

    setProgress({ done: 0, total: accepted.length })
    let pending = 0
    for (const [i, file] of accepted.entries()) {
      try {
        const isVideo = file.type.startsWith('video/')
        if (isVideo) {
          if (!allowVideos) throw new Error("Videos aren't allowed in this album")
          if (file.size > MAX_VIDEO_MB * 1024 * 1024) throw new Error(`over ${MAX_VIDEO_MB} MB`)
          const seconds = await videoDuration(file)
          if (seconds !== null && seconds > MAX_VIDEO_SECONDS + 1) throw new Error(`videos can be up to ${MAX_VIDEO_SECONDS} seconds`)
        } else {
          if (!file.type.startsWith('image/') && file.type) throw new Error('not a photo or video')
          if (file.size > MAX_FILE_MB * 1024 * 1024) throw new Error(`over ${MAX_FILE_MB} MB`)
        }
        const toSend = isVideo
          ? file
          : await processImage(file, {
              frame,
              frameColor: themeInfo(album.theme).color,
              albumName: album.name,
              watermark: !album.is_paid
            })
        const photo = await uploadMedia(album.qr_code, toSend, isVideo ? 'video' : 'image', {
          contributorName: name.trim(),
          momentId: momentId || null,
          challengeId
        })
        if (photo.status === 'pending') pending++
        onUploaded(photo)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'upload failed'
        failures.push(`${file.name || 'Photo'}: ${message}`)
        // Rule errors apply to every remaining file
        if (/closed|open on|up to|name first/i.test(message)) break
      }
      setProgress({ done: i + 1, total: accepted.length })
    }
    setProgress(null)
    setShowCamera(false)
    setErrors(failures)
    if (pending > 0) setNotice(`Thanks! ${pending === 1 ? 'Your photo' : 'Your photos'} will appear once the organizer approves ${pending === 1 ? 'it' : 'them'}.`)
    if (challengeId) onChallengeChange(null)
  }

  const capturePhoto = async () => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (!imageSrc) return
    const blob = await (await fetch(imageSrc)).blob()
    await uploadFiles([new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' })])
  }

  const challenge = album.challenges.find((c) => c.id === challengeId && (isOrganizer || challengeStatus(c) === 'active'))
  const selectClass =
    'w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand'

  return (
    <section id="upload" className="scroll-mt-4 rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold">Add your photos{allowVideos ? ' & videos' : ''}</h2>
      {!isOrganizer && s.uploads_close_at && (
        <p className="mt-1 text-sm text-ink-soft">Open until {formatDateTime(s.uploads_close_at)}</p>
      )}

      {challenge && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-brand-soft px-4 py-3">
          <p className="text-sm">
            <span className="font-bold">🎯 Challenge:</span> {challenge.name}
          </p>
          <button onClick={() => onChallengeChange(null)} className="text-xs font-semibold underline">
            Remove
          </button>
        </div>
      )}

      <div className="mt-5">
        <label htmlFor="contributor" className="mb-2 block text-sm font-semibold">
          Your name {s.require_name && !isOrganizer && <span className="text-red-700">*</span>}
        </label>
        <input
          id="contributor"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            window.dispatchEvent(new CustomEvent('mc-guest-name', { detail: e.target.value }))
          }}
          maxLength={40}
          placeholder="So everyone knows who took it"
          className="w-full rounded-xl border border-line px-4 py-3 focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className={`mt-4 grid gap-3 ${moments.length ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {moments.length > 0 && (
          <div>
            <label htmlFor="moment" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">Moment</label>
            <select id="moment" value={momentId} onChange={(e) => setMomentId(e.target.value)} className={selectClass}>
              <option value="">No moment</option>
              {moments.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor="frame" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">Frame</label>
          <select id="frame" value={frame} onChange={(e) => setFrame(e.target.value as FrameId)} className={selectClass}>
            {FRAMES.map((f) => (
              <option key={f} value={f}>{FRAME_LABELS[f]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowCamera(!showCamera)}
          disabled={uploading || remaining === 0}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-5 font-bold transition hover:bg-brand-strong disabled:opacity-50"
        >
          <CameraIcon className="h-7 w-7" />
          {showCamera ? 'Hide camera' : 'Take a photo'}
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || remaining === 0}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-5 font-bold text-white transition hover:bg-black disabled:opacity-50"
        >
          <UploadIcon className="h-7 w-7" />
          {allowVideos ? 'Photos & videos' : 'Upload photos'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={allowVideos ? 'image/*,video/*' : 'image/*'}
        multiple
        onChange={(e) => {
          uploadFiles(Array.from(e.target.files || []))
          e.target.value = ''
        }}
        className="hidden"
      />

      {progress && (
        <div className="mt-4" aria-live="polite">
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

      {showCamera && (
        <div className="mt-4 overflow-hidden rounded-2xl bg-ink p-3">
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: 'environment' }} className="w-full rounded-xl" />
          <div className="mt-3 flex gap-3">
            <button onClick={capturePhoto} disabled={uploading} className="flex-1 rounded-full bg-brand py-3 font-bold transition hover:bg-brand-strong disabled:opacity-50">
              {uploading ? 'Uploading…' : 'Capture'}
            </button>
            <button onClick={() => setShowCamera(false)} className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
              Close
            </button>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="mt-4 space-y-1 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {errors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      )}
      {notice && <p className="mt-4 rounded-xl bg-brand-soft px-4 py-3 text-sm" role="status">{notice}</p>}

      <div className="mt-4 space-y-1 text-sm text-ink-soft">
        {remaining !== null && (
          <p className="font-semibold text-ink">
            {remaining > 0 ? `You can add ${remaining} more photo${remaining > 1 ? 's' : ''}.` : 'You reached the photo limit for this album.'}
          </p>
        )}
        {s.moderation && !isOrganizer && <p>Photos appear after the organizer approves them.</p>}
        <p>
          {albumSpace !== null && isOrganizer && (
            <span className="block font-semibold text-ink">
              Free album: {totalCount}/{f.photoLimit} photos.{' '}
              {isOrganizer && (
                <a href={`/album/${album.qr_code}/upgrade?pack=photos`} className="underline">
                  Go unlimited
                </a>
              )}
            </span>
          )}
          Max {MAX_FILE_MB} MB per photo{allowVideos ? `, videos up to ${MAX_VIDEO_SECONDS}s` : ''}.
          {!album.is_paid && ' Free albums add a small Moment caps watermark.'}
        </p>
      </div>
    </section>
  )
}
