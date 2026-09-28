'use client'

import type { AppAlbum, AppPhoto } from '@/lib/albumRules'

/** Photo challenges: tapping one preselects it for the next upload. */
export default function Challenges({ album, photos, canUpload, onPick }: { album: AppAlbum; photos: AppPhoto[]; canUpload: boolean; onPick: (id: string) => void }) {
  if (album.challenges.length === 0) return null
  return (
    <section className="mt-8 rounded-3xl bg-brand-soft p-5 sm:p-6" aria-labelledby="challenges-title">
      <h2 id="challenges-title" className="text-lg font-bold">🎯 Photo challenges</h2>
      <p className="text-sm text-ink-soft">Pick one, then take your shot!</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {album.challenges.map((c) => {
          const done = photos.filter((p) => p.challenge_id === c.id).length
          return (
            <li key={c.id}>
              <button
                disabled={!canUpload}
                onClick={() => {
                  onPick(c.id)
                  document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-left font-semibold transition hover:ring-2 hover:ring-ink disabled:cursor-default disabled:hover:ring-0"
              >
                <span>{c.name}</span>
                <span className="shrink-0 text-xs font-bold text-ink-soft">{done} 📸</span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
