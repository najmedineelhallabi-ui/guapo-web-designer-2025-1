'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { addWatermark, compressImage } from '@/lib/photoUtils'
import Webcam from 'react-webcam'
import { v4 as uuidv4 } from 'uuid'

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading album...</p>
        </div>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <p className="text-red-600">Album not found</p>
        </div>
      </div>
    )
  }

  const isExpired = new Date(album.created_at).getTime() + 7 * 24 * 60 * 60 * 1000 < Date.now()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-8">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">{album.name} 📸</h1>
          <p className="text-gray-600 mt-1">
            {photos.length} photo{photos.length !== 1 ? 's' : ''} uploaded
          </p>
          {isExpired && (
            <p className="text-red-600 text-sm mt-2">⚠️ Album expired - photos will be deleted soon</p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">📤 Add Your Photos</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Camera Button */}
            <button
              onClick={() => setShowCamera(!showCamera)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              📷 {showCamera ? 'Hide Camera' : 'Take Photo'}
            </button>

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              ⬆️ Upload Photo
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
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full rounded-lg"
              />
              <div className="mt-4 flex gap-4">
                <button
                  onClick={capturePhoto}
                  disabled={uploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg"
                >
                  {uploading ? 'Uploading...' : 'Capture Photo'}
                </button>
                <button
                  onClick={() => setShowCamera(false)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Contributor Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <input
              type="text"
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {!album.is_paid && (
            <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg text-sm text-blue-700">
              📸 Photos will have a watermark. Upgrade to remove it!
            </div>
          )}
        </div>

        {/* Photos Gallery */}
        <div>
          <h2 className="text-xl font-bold mb-4">🖼️ Photos ({photos.length})</h2>

          {photos.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-600">
              No photos yet. Be the first to upload!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <img src={photo.url} alt="Uploaded" className="w-full h-48 object-cover" />
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-700">{photo.contributor_name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(photo.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 text-center">
          <p className="text-gray-600 text-sm">
            💡 This album will be deleted after 7 days unless the organizer pays to keep it.
          </p>
        </div>
      </div>
    </div>
  )
}
