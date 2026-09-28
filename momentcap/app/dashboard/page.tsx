'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'

export default function Dashboard() {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          owner_id: 'demo-user', // TODO: Use actual user from auth
          owner_type: 'couple'
        })
      })

      if (!response.ok) throw new Error('Failed to create album')

      const data = await response.json()
      setCreatedAlbum(data.album)
      setQrUrl(data.qrUrl)
      setFormData({ name: '', event_date: '', location: '' })
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating album')
    } finally {
      setLoading(false)
    }
  }

  if (createdAlbum) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">✨ Album Created!</h2>
          <p className="text-gray-600 mb-6">{createdAlbum.name}</p>

          <div className="bg-gray-100 p-6 rounded-lg mb-6">
            {qrUrl && (
              <div>
                <QRCodeSVG value={qrUrl} size={256} className="w-full h-auto" />
                <p className="text-sm text-gray-600 mt-2">Share this QR code with guests</p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm font-mono text-blue-700 break-all">{createdAlbum.qr_code}</p>
            <p className="text-xs text-gray-600 mt-2">Or use this code</p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/album/${createdAlbum.qr_code}`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
            >
              Open Album
            </Link>
            <button
              onClick={() => {
                setCreatedAlbum(null)
                setQrUrl('')
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 rounded-lg transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 pt-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">📸 MomentCap</h1>
            <p className="text-gray-600 mt-2">Collaborative photo albums for every event</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            {showForm ? 'Cancel' : '+ New Album'}
          </button>
        </div>

        {/* Create Album Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Create a New Album</h2>
            <form onSubmit={handleCreateAlbum} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Album Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Wedding, Birthday Party, Team Outing"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Event Date</label>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location (Optional)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Brussels, Belgium"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition"
              >
                {loading ? 'Creating...' : 'Create Album'}
              </button>
            </form>
          </div>
        )}

        {/* Empty State */}
        {albums.length === 0 && !showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-600 mb-4">No albums yet. Create your first one!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              Create Album
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
