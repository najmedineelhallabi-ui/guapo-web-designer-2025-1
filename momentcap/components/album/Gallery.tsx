'use client'

import { ImageIcon, PlayIcon, StarIcon } from '@/components/Icons'
import { REACTIONS, type AppAlbum, type AppPhoto } from '@/lib/albumRules'

export type GalleryFilter = 'all' | 'mine' | 'favorites' | 'pending' | 'videos' | `moment:${string}` | `challenge:${string}`

export function applyFilter(photos: AppPhoto[], filter: GalleryFilter) {
  if (filter === 'mine') return photos.filter((p) => p.mine)
  if (filter === 'favorites') return photos.filter((p) => p.favorite)
  if (filter === 'pending') return photos.filter((p) => p.status === 'pending')
  if (filter === 'videos') return photos.filter((p) => p.kind === 'video')
  if (filter.startsWith('moment:')) return photos.filter((p) => p.moment_id === filter.slice(7))
  if (filter.startsWith('challenge:')) return photos.filter((p) => p.challenge_id === filter.slice(10))
  return photos
}

type Props = {
  album: AppAlbum
  photos: AppPhoto[]
  isOrganizer: boolean
  filter: GalleryFilter
  onFilter: (f: GalleryFilter) => void
  onOpen: (index: number) => void
}

export default function Gallery({ album, photos, isOrganizer, filter, onFilter, onOpen }: Props) {
  const galleryPrivate = !album.settings.guests_can_view && !isOrganizer
  const shown = applyFilter(photos, filter)

  const chips: { id: GalleryFilter; label: string; count: number }[] = [
    { id: 'all' as GalleryFilter, label: 'All', count: photos.length },
    ...(isOrganizer ? [{ id: 'pending' as const, label: 'To review', count: photos.filter((p) => p.status === 'pending').length }] : []),
    { id: 'favorites' as GalleryFilter, label: '⭐ Best of', count: photos.filter((p) => p.favorite).length },
    ...(!galleryPrivate ? [{ id: 'mine' as const, label: 'Mine', count: photos.filter((p) => p.mine).length }] : []),
    { id: 'videos' as GalleryFilter, label: 'Videos', count: photos.filter((p) => p.kind === 'video').length },
    ...album.moments.map((m) => ({ id: `moment:${m.id}` as GalleryFilter, label: m.name, count: photos.filter((p) => p.moment_id === m.id).length })),
    ...album.challenges.map((c) => ({ id: `challenge:${c.id}` as GalleryFilter, label: `🎯 ${c.name}`, count: photos.filter((p) => p.challenge_id === c.id).length }))
  ].filter((c) => c.id === 'all' || c.id === filter || c.count > 0)

  return (
    <section className="mt-10" aria-labelledby="gallery-title">
      <h2 id="gallery-title" className="text-xl font-bold">
        {galleryPrivate ? 'Your photos' : 'Photos'} <span className="text-ink-soft">({photos.length})</span>
      </h2>
      {galleryPrivate && (
        <p className="mt-1 text-sm text-ink-soft">The organizer keeps this album private — you only see the photos you added.</p>
      )}

      {chips.length > 1 && (
        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1" role="tablist" aria-label="Filter photos">
          {chips.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={filter === c.id}
              onClick={() => onFilter(c.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === c.id ? 'bg-ink text-white' : 'border border-line bg-white hover:border-ink'
              } ${c.id === 'pending' && c.count > 0 && filter !== c.id ? 'border-red-300 text-red-700' : ''}`}
            >
              {c.label} <span className="opacity-60">{c.count}</span>
            </button>
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <div className="mt-4 rounded-3xl border-2 border-dashed border-line bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft">
            <ImageIcon className="h-7 w-7" />
          </div>
          <p className="mt-4 font-semibold">{filter === 'all' ? 'No photos yet' : 'Nothing here yet'}</p>
          <p className="mt-1 text-ink-soft">
            {filter === 'all' ? (galleryPrivate ? 'Your photos will show up here.' : 'Be the first to add one!') : 'Try another filter.'}
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {shown.map((photo, i) => {
            const totalReactions = REACTIONS.reduce((n, r) => n + (photo.reactions[r.id] || 0), 0)
            const top = REACTIONS.reduce((a, b) => ((photo.reactions[b.id] || 0) > (photo.reactions[a.id] || 0) ? b : a))
            return (
              <button
                key={photo.id}
                onClick={() => onOpen(i)}
                className="group relative overflow-hidden rounded-2xl bg-line text-left focus:outline-none focus:ring-2 focus:ring-brand"
                aria-label={`${photo.kind === 'video' ? 'Video' : 'Photo'} by ${photo.contributor_name}`}
              >
                {photo.kind === 'video' ? (
                  <video src={`${photo.url}#t=0.1`} muted playsInline preload="metadata" className="aspect-square w-full object-cover" />
                ) : (
                  <img src={photo.url} alt="" loading="lazy" className="aspect-square w-full object-cover transition group-hover:scale-105" />
                )}
                {photo.kind === 'video' && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="rounded-full bg-black/50 p-3 text-white"><PlayIcon className="h-6 w-6" /></span>
                  </span>
                )}
                <span className="absolute left-2 top-2 flex gap-1">
                  {photo.status === 'pending' && (
                    <span className="rounded-full bg-white/95 px-2 py-0.5 text-xs font-bold text-ink">{isOrganizer ? 'To review' : 'Pending'}</span>
                  )}
                  {photo.favorite && (
                    <span className="rounded-full bg-white/95 p-1"><StarIcon className="h-3.5 w-3.5 fill-brand text-ink" /></span>
                  )}
                </span>
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{photo.contributor_name}</span>
                    <span className="block text-xs text-white/80">
                      {new Date(photo.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </span>
                  {totalReactions > 0 && (
                    <span className="shrink-0 rounded-full bg-black/40 px-2 py-0.5 text-xs font-bold">
                      {top.emoji} {totalReactions}
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
