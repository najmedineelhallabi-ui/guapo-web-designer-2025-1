'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'
import SiteHeader from '@/components/SiteHeader'
import { LogoMark } from '@/components/Logo'
import { DownloadIcon, ShareIcon } from '@/components/Icons'
import { getAlbum, type AppAlbum } from '@/lib/api'
import { eventTypeInfo } from '@/lib/albumRules'
import { formatDateTime, formatEventDate } from '@/lib/dates'

function SharePage() {
  const params = useParams()
  const code = params.code as string
  const justCreated = useSearchParams().get('created') === '1'

  const [album, setAlbum] = useState<AppAlbum | null>(null)
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setUrl(`${window.location.origin}/album/${code.toUpperCase()}`)
    setCanShare(typeof navigator.share === 'function')
    getAlbum(code)
      .then((res) => setAlbum(res?.album ?? null))
      .finally(() => setLoading(false))
  }, [code])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const share = () => {
    if (!album) return
    navigator.share({ title: album.name, text: `Add your photos to "${album.name}"`, url }).catch(() => {})
  }

  const downloadQr = () => {
    const canvas = qrCanvasRef.current
    if (!canvas || !album) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `${album.name.replace(/[^\w-]+/g, '_')}-QR.png`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-ink" />
      </div>
    )
  }

  if (!album) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <p className="text-ink-soft">Album not found.</p>
      </div>
    )
  }

  const type = eventTypeInfo(album.event_type)
  const { uploads_open_at: opens, uploads_close_at: closes } = album.settings

  return (
    <div className="flex min-h-screen flex-col">
      <div className="print:hidden">
        <SiteHeader cta={false} />
      </div>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 print:p-0">
        <div className="print:hidden">
          <Link href={`/album/${album.qr_code}`} className="text-sm font-semibold text-ink-soft hover:text-ink">
            ← Open album
          </Link>
          {justCreated ? (
            <div className="mt-4 rounded-3xl bg-brand p-6">
              <p className="text-2xl font-extrabold tracking-tight">Your album is ready! 🎉</p>
              <p className="mt-1">Print the card below for your tables, or send the link to your guests.</p>
            </div>
          ) : (
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Share with your guests</h1>
          )}
        </div>

        <div className="mt-8 grid items-start gap-8 md:grid-cols-[1fr_280px] print:mt-0 print:block">
          {/* Printable card */}
          <div className="mx-auto w-full max-w-md rounded-[2rem] bg-brand p-3 shadow-xl print:max-w-none print:shadow-none">
            <div className="rounded-[1.6rem] bg-white px-8 py-10 text-center">
              <div className="flex items-center justify-center gap-2 font-extrabold">
                <LogoMark className="h-7 w-7" /> MomentCap
              </div>
              <p className="mt-6 text-3xl" aria-hidden="true">{type.emoji}</p>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight">{album.name}</h2>
              <p className="mt-1 text-sm text-ink-soft">
                {formatEventDate(album.event_date)}
                {album.location ? ` · ${album.location}` : ''}
              </p>
              {album.welcome_message && <p className="mx-auto mt-4 max-w-xs text-ink">{album.welcome_message}</p>}
              <div className="mx-auto mt-6 w-fit rounded-2xl border-2 border-ink p-3">
                <QRCodeSVG value={url || 'https://momentcaps.vercel.app'} size={200} />
              </div>
              <p className="mt-4 text-lg font-extrabold">Scan to add your photos</p>
              <p className="text-sm text-ink-soft">No app needed · Or go to the link below</p>
              <p className="mt-3 break-all font-mono text-xs text-ink-soft">{url}</p>
              {(opens || closes) && (
                <p className="mt-3 text-xs font-semibold">
                  {opens && `Opens ${formatDateTime(opens)}`}
                  {opens && closes && ' · '}
                  {closes && `Closes ${formatDateTime(closes)}`}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 print:hidden">
            <button onClick={() => window.print()} className="w-full rounded-full bg-ink py-3.5 font-semibold text-white transition hover:bg-black">
              Print the card
            </button>
            <button onClick={downloadQr} className="flex w-full items-center justify-center gap-2 rounded-full border border-line bg-white py-3.5 font-semibold transition hover:border-ink">
              <DownloadIcon /> Download QR code
            </button>
            {canShare && (
              <button onClick={share} className="flex w-full items-center justify-center gap-2 rounded-full border border-line bg-white py-3.5 font-semibold transition hover:border-ink">
                <ShareIcon /> Send the link
              </button>
            )}
            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Album link</p>
              <p className="mt-1 break-all text-sm">{url}</p>
              <button onClick={copy} className="mt-3 w-full rounded-full bg-brand py-2.5 text-sm font-bold transition hover:bg-brand-strong">
                {copied ? 'Copied ✓' : 'Copy link'}
              </button>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Album code</p>
              <p className="mt-1 font-mono text-2xl font-bold tracking-[0.2em]">{album.qr_code}</p>
            </div>
            <Link href={`/album/${album.qr_code}/settings`} className="block text-center text-sm font-semibold text-ink-soft hover:text-ink">
              Change guest rules →
            </Link>
          </div>
        </div>

        {/* High-resolution QR for the PNG download */}
        <QRCodeCanvas ref={qrCanvasRef} value={url || ' '} size={1024} marginSize={4} className="hidden" />
      </main>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense>
      <SharePage />
    </Suspense>
  )
}
