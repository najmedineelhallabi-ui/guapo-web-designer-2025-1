'use client'

import { challengeStatus, type AppAlbum, type AppPhoto } from '@/lib/albumRules'

const time = (iso: string) => {
  const d = new Date(iso)
  const sameDay = d.toDateString() === new Date().toDateString()
  return sameDay
    ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleString([], { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

/** Photo challenges: tapping an active one preselects it for the next upload. */
export default function Challenges({
  album,
  photos,
  canUpload,
  isOrganizer,
  onPick
}: {
  album: AppAlbum
  photos: AppPhoto[]
  canUpload: boolean
  isOrganizer: boolean
  onPick: (id: string) => void
}) {
  const hidden = isOrganizer ? 0 : album.upcoming_challenges || 0
  if (album.challenges.length === 0 && hidden === 0) return null

  const order = { active: 0, upcoming: 1, ended: 2 }
  const list = [...album.challenges].sort((a, b) => order[challengeStatus(a)] - order[challengeStatus(b)])

  return (
    <section className="mt-8 rounded-3xl bg-brand-soft p-5 sm:p-6" aria-labelledby="challenges-title">
      <h2 id="challenges-title" className="text-lg font-bold">🎯 Photo challenges</h2>
      <p className="text-sm text-ink-soft">Pick one, then take your shot!</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {list.map((c) => {
          const status = challengeStatus(c)
          const done = photos.filter((p) => p.challenge_id === c.id).length
          const pickable = canUpload && (status === 'active' || isOrganizer)
          return (
            <li key={c.id}>
              <button
                disabled={!pickable}
                onClick={() => {
                  onPick(c.id)
                  document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-left transition ${
                  pickable ? 'hover:ring-2 hover:ring-ink' : 'cursor-default'
                } ${status === 'ended' ? 'opacity-50' : ''}`}
              >
                <span>
                  <span className="block font-semibold">{c.name}</span>
                  {status === 'upcoming' && c.starts_at && (
                    <span className="text-xs font-semibold text-ink-soft">🔒 Hidden from guests until {time(c.starts_at)}</span>
                  )}
                  {status === 'active' && c.ends_at && <span className="text-xs text-ink-soft">Until {time(c.ends_at)}</span>}
                  {status === 'ended' && <span className="text-xs font-semibold">Ended</span>}
                </span>
                <span className="shrink-0 text-xs font-bold text-ink-soft">{done} 📸</span>
              </button>
            </li>
          )
        })}
        {hidden > 0 && (
          <li className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-ink/15 px-4 py-3">
            <span className="text-2xl" aria-hidden="true">🎁</span>
            <span>
              <span className="block font-semibold">
                {hidden} surprise challenge{hidden > 1 ? 's' : ''} coming
              </span>
              {album.next_challenge_at && <span className="text-xs text-ink-soft">Next one at {time(album.next_challenge_at)}</span>}
            </span>
          </li>
        )}
      </ul>
    </section>
  )
}
