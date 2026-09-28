'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { addWatermark, compressImage } from '@/lib/photoUtils'
import Webcam from 'react-webcam'
import { v4 as uuidv4 } from 'uuid'
import Logo from '@/components/Logo'
import { CameraIcon, UploadIcon, ImageIcon } from '@/components/Icons'

type Album = {
  id: string
  name: string
  is_paid: boolean
  album_visibility: string
  photos?: any[]
  created_at: string
}

export default function AlbumPage() {
  const params = useParams()
  const code = params.code as string

  const [album, setAlbum] = useState<Album | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [inviteId] = useState(() => uuidv4())
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [photos, setPhotos] = useState<any[]>([])
  const [showCamera, setShowCamera] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [contributorName, setContributorName] = useState('Guest')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const webcamRef = useRef<Webcam>(null)

  // Fetch album on load
  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await fetch(`/api/albums/${code}`)
        if (!response.ok) throw new Error('Album not found')

        const data = await response.json()
        setAlbum(data.album)
        if (data.album.photos) {
          setPhotos(data.album.photos)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading album')
      } finally {
        setLoading(false)
      }
    }

    if (code) fetchAlbum()
  }, [code])

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || !album) return

    const file = files[0]
    await uploadPhoto(file)
  }

  const uploadPhoto = async (file: File) => {
    if (!album) return
    setUploading(true)
    setError('')

    try {
      // Compress image
      let processedFile = await compressImage(file)

      // Add watermark if not paid
      if (!album.is_paid) {
        const watermarkedBlob = await addWatermark(processedFile, true)
        processedFile = new File([watermarkedBlob], file.name, {
          type: 'image/jpeg'
        })
      }

      // Upload to server
      const formData = new FormData()
      formData.append('file', processedFile)
      formData.append('albumId', album.id)
      formData.append('inviteId', inviteId)
      formData.append('visibility', 'public')
      formData.append('contributorName', contributorName)

      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setPhotos((prev) => [...prev, data.photo])
      setShowCamera(false)
      setShowUpload(false)
      setUploadProgress(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const capturePhoto = async () => {
    if (!webcamRef.current) return

    const imageSrc = webcamRef.current.getScreenshot()
    if (!imageSrc) return

    // Convert data URL to File
    const response = await fetch(imageSrc)
    const blob = await response.blob()
    const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })

    await uploadPhoto(file)
  }

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
        </div>
      </div>
    )
  }

  const isExpired = new Date(album.created_at).getTime() + 7 * 24 * 60 * 60 * 1000 < Date.now()

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Logo />
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">{album.name}</h1>
          <p className="mt-1 text-ink-soft">
            {photos.length} photo{photos.length !== 1 ? 's' : ''} shared
          </p>
          {isExpired && (
            <p className="mt-3 inline-block rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
              Album expired — photos will be deleted soon
            </p>
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
              placeholder="Your name"
              className="w-full rounded-xl border border-line px-4 py-3 focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
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
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

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
              Photos in free albums get a small MomentCap watermark.
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
              {photos.map((photo) => (
                <figure key={photo.id} className="group relative overflow-hidden rounded-2xl bg-line">
                  <img src={photo.url} alt={`Photo by ${photo.contributor_name}`} className="aspect-square w-full object-cover" />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                    <p className="truncate text-sm font-semibold">{photo.contributor_name}</p>
                    <p className="text-xs text-white/80">
                      {new Date(photo.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>

        <p className="mt-12 text-center text-sm text-ink-soft">
          This album is kept for 7 days unless the organizer upgrades it.
        </p>
      </main>
    </div>
  )
}
