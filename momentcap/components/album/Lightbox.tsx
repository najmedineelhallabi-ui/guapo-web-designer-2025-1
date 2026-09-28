'use client'

import { useEffect } from 'react'
import { ChevronIcon, DownloadIcon, StarIcon, TrashIcon, XIcon, CheckIcon } from '@/components/Icons'
import { REACTIONS, type AppAlbum, type AppPhoto, type ReactionId } from '@/lib/albumRules'

type Props = {
  album: AppAlbum
  photos: AppPhoto[]
  index: number
  isOrganizer: boolean
  onIndex: (i: number | null) => void
  onReact: (photo: AppPhoto, reaction: ReactionId) => void
  onFavorite: (photo: AppPhoto) => void
  onApprove: (photo: AppPhoto) => void
  onDelete: (photo: AppPhoto) => void
}

export default function Lightbox({ album, photos, index, isOrganizer, onIndex, onReact, onFavorite, onApprove, onDelete }: Props) {
  const photo = photos[index]
  const count = photos.length
  const step = (d: number) => onIndex((index + d + count) % count)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onIndex(null)
      if (e.key === 'ArrowRight') onIndex((index + 1) % count)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + count) % count)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [index, count, onIndex])

  if (!photo) return null
  const moment = album.moments.find((m) => m.id === photo.moment_id)
  const challenge = album.challenges.find((c) => c.id === photo.challenge_id)
  const canReact = album.settings.reactions && photo.status === 'approved'
  const iconBtn = 'rounded-full p-2 transition hover:bg-white/10'

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => onIndex(null)}>
      <div className="flex items-start justify-between gap-3 p-4" onClick={(e) => e.stopPropagation()}>
        <div className="min-w-0">
          <p className="truncate font-semibold">{photo.contributor_name}</p>
          <p className="truncate text-sm text-white/60">
            {index + 1} / {count}
            {moment ? ` · ${moment.name}` : ''}
            {challenge ? ` · 🎯 ${challenge.name}` : ''}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {isOrganizer && (
            <button onClick={() => onFavorite(photo)} className={iconBtn} aria-label={photo.favorite ? 'Remove from best-of' : 'Add to best-of'} aria-pressed={photo.favorite}>
              <StarIcon className={`h-6 w-6 ${photo.favorite ? 'fill-brand text-brand' : ''}`} />
            </button>
          )}
          <a href={photo.url} download={`momentcap-${photo.id}.${photo.kind === 'video' ? 'mp4' : 'jpg'}`} className={iconBtn} aria-label="Download">
            <DownloadIcon className="h-6 w-6" />
          </a>
          {(isOrganizer || photo.mine) && (
            <button onClick={() => onDelete(photo)} className={iconBtn} aria-label="Delete">
              <TrashIcon className="h-6 w-6" />
            </button>
          )}
          <button onClick={() => onIndex(null)} className={iconBtn} aria-label="Close">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2">
        {photo.kind === 'video' ? (
          <video key={photo.id} src={photo.url} controls autoPlay playsInline className="max-h-full max-w-full rounded-lg" onClick={(e) => e.stopPropagation()} />
        ) : (
          <img src={photo.url} alt={`Photo by ${photo.contributor_name}`} className="max-h-full max-w-full rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
        )}
        {count > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); step(-1) }} className="absolute left-2 rounded-full bg-black/50 p-2 transition hover:bg-black/80" aria-label="Previous">
              <ChevronIcon dir="left" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); step(1) }} className="absolute right-2 rounded-full bg-black/50 p-2 transition hover:bg-black/80" aria-label="Next">
              <ChevronIcon dir="right" />
            </button>
          </>
        )}
      </div>

      <div className="flex min-h-20 items-center justify-center gap-2 p-4" onClick={(e) => e.stopPropagation()}>
        {photo.status === 'pending' ? (
          isOrganizer ? (
            <>
              <button onClick={() => onApprove(photo)} className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-bold text-ink">
                <CheckIcon /> Approve
              </button>
              <button onClick={() => onDelete(photo)} className="rounded-full border border-white/30 px-5 py-2.5 font-semibold">
                Reject
              </button>
            </>
          ) : (
            <p className="text-sm text-white/70">Waiting for the organizer&apos;s approval</p>
          )
        ) : (
          canReact &&
          REACTIONS.map((r) => {
            const active = photo.my_reactions.includes(r.id)
            return (
              <button
                key={r.id}
                onClick={() => onReact(photo, r.id)}
                aria-pressed={active}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-lg transition ${active ? 'bg-white text-ink' : 'bg-white/10 hover:bg-white/20'}`}
              >
                <span aria-hidden="true">{r.emoji}</span>
                <span className="text-sm font-bold tabular-nums">{photo.reactions[r.id] || 0}</span>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
