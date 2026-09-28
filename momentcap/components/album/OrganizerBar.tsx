'use client'

import Link from 'next/link'
import { useState } from 'react'
import { BookIcon, ChartIcon, DownloadIcon, SettingsIcon, ShareIcon, TvIcon } from '@/components/Icons'
import type { AppAlbum, AppPhoto } from '@/lib/albumRules'
import { downloadZip } from '@/lib/exporters'

export default function OrganizerBar({ album, photos, onReview }: { album: AppAlbum; photos: AppPhoto[]; onReview: () => void }) {
  const [busy, setBusy] = useState('')
  const pending = photos.filter((p) => p.status === 'pending').length
  const approved = photos.filter((p) => p.status === 'approved')
  const favorites = approved.filter((p) => p.favorite)

  const run = async (label: string, fn: () => Promise<void>) => {
    setBusy(label)
    try {
      await fn()
    } catch {
      alert('Something went wrong while preparing the download. Please try again.')
    } finally {
      setBusy('')
    }
  }

  const chip = 'flex shrink-0 items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold transition hover:border-ink disabled:opacity-40'
  const base = `/album/${album.qr_code}`

  return (
    <div className="mt-5">
      {pending > 0 && (
        <button onClick={onReview} className="mb-3 flex w-full items-center justify-between rounded-2xl bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-800">
          <span>{pending} photo{pending > 1 ? 's' : ''} waiting for your approval</span>
          <span className="underline">Review</span>
        </button>
      )}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <Link href={`${base}/share`} className="flex shrink-0 items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-black">
          <ShareIcon /> Share &amp; QR
        </Link>
        <Link href={`${base}/plan`} className="flex shrink-0 items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-bold transition hover:bg-brand-strong">
          📋 Plan the event
        </Link>
        <Link href={`${base}/live`} className={chip}>
          <TvIcon /> Slideshow
        </Link>
        <Link href={`${base}/stats`} className={chip}>
          <ChartIcon /> Stats
        </Link>
        <button disabled={!!busy || approved.length === 0} onClick={() => run('zip', () => downloadZip(album, approved))} className={chip}>
          <DownloadIcon /> {busy === 'zip' ? 'Preparing…' : 'ZIP'}
        </button>
        {favorites.length > 0 && (
          <button disabled={!!busy} onClick={() => run('fav', () => downloadZip(album, favorites, '-best-of'))} className={chip}>
            <DownloadIcon /> {busy === 'fav' ? 'Preparing…' : 'Best-of ZIP'}
          </button>
        )}
        <button
          disabled={!!busy || approved.filter((p) => p.kind === 'image').length === 0}
          onClick={() => run('pdf', async () => (await import('@/lib/pdfBook')).downloadPdfBook(album, favorites.length >= 4 ? favorites : approved))}
          className={chip}
        >
          <BookIcon /> {busy === 'pdf' ? 'Preparing…' : 'PDF book'}
        </button>
        <Link href={`${base}/settings`} className={chip}>
          <SettingsIcon /> Settings
        </Link>
      </div>
    </div>
  )
}
