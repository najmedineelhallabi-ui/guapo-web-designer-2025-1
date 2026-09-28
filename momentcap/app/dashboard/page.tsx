'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { QRCodeSVG } from 'qrcode.react'
import SiteHeader from '@/components/SiteHeader'
import { ImageIcon } from '@/components/Icons'

const inputClass =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand'

export default function Dashboard() {
  const router = useRouter()
  const { session, loading: authLoading } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    event_date: '',
    location: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [albums, setAlbums] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [createdAlbum, setCreatedAlbum] = useState<any>(null)
  const [qrUrl, setQrUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [albumsLoading, setAlbumsLoading] = useState(true)

  const token = session?.access_token

  // Logged-out visitors go to the login page first
  useEffect(() => {
    if (!authLoading && !session) router.replace('/login?next=/dashboard')
  }, [authLoading, session, router])

  // Load this user's albums
  useEffect(() => {
    if (!token) return
    fetch('/api/albums', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : { albums: [] }))
      .then((data) => setAlbums(data.albums || []))
      .catch(() => setAlbums([]))
      .finally(() => setAlbumsLoading(false))
  }, [token])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          owner_type: 'couple'
        })
      })

      if (!response.ok) throw new Error('Could not create the album. Please try again.')

      const data = await response.json()
      setCreatedAlbum(data.album)
      setQrUrl(data.qrUrl)
      setAlbums(prev => [data.album, ...prev])
      setFormData({ name: '', event_date: '', location: '' })
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating album')
    } finally {
      setLoading(false)
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked; the link is still visible to copy by hand
    }
  }

  if (authLoading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-ink" />
      </div>
    )
  }

  const firstName = (session.user.user_metadata?.name as string | undefined)?.split(' ')[0]

  if (createdAlbum) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader cta={false} />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-3xl border border-line bg-white p-8 text-center shadow-xl">
            <span className="inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              Album created
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{createdAlbum.name}</h1>
            <p className="mt-1 text-ink-soft">Share this QR code with your guests</p>

            {qrUrl && (
              <div className="mx-auto mt-6 w-fit rounded-2xl bg-brand p-4">
                <div className="rounded-xl bg-white p-4">
                  <QRCodeSVG value={qrUrl} size={200} />
                </div>
              </div>
            )}

            <div className="mt-6 rounded-xl bg-cream p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Album code</p>
              <p className="mt-1 font-mono text-2xl font-bold tracking-[0.2em]">{createdAlbum.qr_code}</p>
            </div>

            {qrUrl && (
              <button
                onClick={copyLink}
                className="mt-3 w-full truncate rounded-xl border border-line px-4 py-2.5 text-sm text-ink-soft transition hover:border-ink"
              >
                {copied ? 'Link copied ✓' : qrUrl}
              </button>
            )}

            <div className="mt-6 flex gap-3">
              <Link
                href={`/album/${createdAlbum.qr_code}`}
                className="flex-1 rounded-full bg-ink py-3 font-semibold text-white transition hover:bg-black"
              >
                Open album
              </Link>
              <button
                onClick={() => {
                  setCreatedAlbum(null)
                  setQrUrl('')
                }}
                className="flex-1 rounded-full border border-line py-3 font-semibold transition hover:border-ink"
              >
                Done
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader cta={false} />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
        {/* Page title */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {firstName ? `Hi ${firstName}, your albums` : 'Your albums'}
            </h1>
            <p className="mt-1 text-ink-soft">Create an album, share the QR code, collect every photo.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={
              showForm
                ? 'rounded-full border border-line bg-white px-6 py-3 font-semibold transition hover:border-ink'
                : 'rounded-full bg-brand px-6 py-3 font-bold transition hover:bg-brand-strong'
            }
          >
            {showForm ? 'Cancel' : '+ New album'}
          </button>
        </div>

        {/* Create Album Form */}
        {showForm && (
          <div className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold">New album</h2>
            <form onSubmit={handleCreateAlbum} className="mt-6 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold">Album name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Sarah & Tom's Wedding"
                  required
                  className={inputClass}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="event_date" className="mb-2 block text-sm font-semibold">Event date</label>
                  <input
                    id="event_date"
                    type="date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleInputChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="location" className="mb-2 block text-sm font-semibold">
                    Location <span className="font-normal text-ink-soft">(optional)</span>
                  </label>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Brussels"
                    className={inputClass}
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-ink py-3.5 font-semibold text-white transition hover:bg-black disabled:opacity-50"
              >
                {loading ? 'Creating…' : 'Create album'}
              </button>
            </form>
          </div>
        )}

        {albumsLoading && (
          <p className="mt-8 text-ink-soft">Loading your albums…</p>
        )}

        {/* Albums */}
        {albums.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {albums.map((a) => (
              <Link
                key={a.id}
                href={`/album/${a.qr_code}`}
                className="rounded-2xl border border-line bg-white p-5 transition hover:border-ink"
              >
                <p className="font-bold">{a.name}</p>
                <p className="mt-1 text-sm text-ink-soft">
                  {a.event_date}{a.location ? ` · ${a.location}` : ''}
                </p>
                <p className="mt-3 font-mono text-sm tracking-widest">{a.qr_code}</p>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!albumsLoading && albums.length === 0 && !showForm && (
          <div className="mt-8 rounded-3xl border-2 border-dashed border-line bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft">
              <ImageIcon className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-xl font-bold">No albums yet</h2>
            <p className="mt-1 text-ink-soft">Create your first one — it takes 30 seconds.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-6 rounded-full bg-brand px-6 py-3 font-bold transition hover:bg-brand-strong"
            >
              Create an album
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
