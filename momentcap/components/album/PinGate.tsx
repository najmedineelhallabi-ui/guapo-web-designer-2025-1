'use client'

import { useState } from 'react'
import Logo from '@/components/Logo'
import { LockIcon } from '@/components/Icons'
import { eventTypeInfo } from '@/lib/albumRules'
import type { AlbumView } from '@/lib/api'
import ThemeScope from './ThemeScope'

type Locked = Extract<AlbumView, { locked: true }>['album']

export default function PinGate({ album, error, onSubmit }: { album: Locked; error: string; onSubmit: (pin: string) => void }) {
  const [pin, setPin] = useState('')
  return (
    <ThemeScope theme={album.theme} className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Logo />
      <div className="mt-8 w-full max-w-sm overflow-hidden rounded-3xl border border-line bg-white text-center shadow-sm">
        {album.cover_url ? (
          <img src={album.cover_url} alt="" className="h-36 w-full object-cover" />
        ) : (
          <div className="flex h-24 items-center justify-center bg-brand text-4xl" aria-hidden="true">
            {eventTypeInfo(album.event_type).emoji}
          </div>
        )}
        <form
          className="p-7"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(pin)
          }}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft">
            <LockIcon />
          </div>
          <h1 className="mt-4 text-xl font-extrabold">{album.name}</h1>
          <p className="mt-1 text-ink-soft">Enter the album code you received from the organizer.</p>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value.toUpperCase())}
            autoFocus
            autoComplete="off"
            maxLength={8}
            aria-label="Album code"
            placeholder="••••"
            className="mt-5 w-full rounded-xl border border-line px-4 py-3 text-center font-mono text-2xl tracking-[0.3em] focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand"
          />
          {error && <p className="mt-3 text-sm font-semibold text-red-700">{error}</p>}
          <button type="submit" className="mt-4 w-full rounded-full bg-ink py-3 font-semibold text-white transition hover:bg-black">
            Open album
          </button>
        </form>
      </div>
    </ThemeScope>
  )
}
