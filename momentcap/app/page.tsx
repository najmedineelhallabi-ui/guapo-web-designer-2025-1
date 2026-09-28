'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
      {/* Navigation */}
      <nav className="bg-black bg-opacity-20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-horizontal.svg" alt="MomentCap" className="h-16" />
          </div>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-white text-blue-600 rounded-lg font-bold hover:bg-opacity-90 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Capture Every Moment Together
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          The collaborative photo album that brings your events to life.
          No WhatsApp chaos. No scattered photos. Just pure moments.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-opacity-90 transition"
          >
            Create Album
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Zero Setup</h3>
            <p className="opacity-80">Scan QR code, instantly upload. No accounts needed.</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">Privacy First</h3>
            <p className="opacity-80">Choose who sees your photos. Keep some private.</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="opacity-80">Real-time uploads. See everyone's photos instantly.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-black bg-opacity-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Simple Pricing</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Freemium</h3>
              <p className="text-3xl font-bold mb-6">Free</p>
              <ul className="space-y-3 mb-8 opacity-80">
                <li>✅ 7 days free</li>
                <li>✅ Up to 100 photos</li>
                <li>✅ Share with guests</li>
                <li>❌ Watermark on photos</li>
                <li>❌ No downloads</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 text-gray-900">
              <h3 className="text-2xl font-bold mb-4">Premium</h3>
              <p className="text-3xl font-bold mb-6">€5<span className="text-lg opacity-70">/album</span></p>
              <ul className="space-y-3 mb-8">
                <li>✅ Keep forever</li>
                <li>✅ Unlimited photos</li>
                <li>✅ No watermarks</li>
                <li>✅ Download as PDF/ZIP</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready?</h2>
        <Link
          href="/dashboard"
          className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-opacity-90 transition"
        >
          Create Your First Album
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-black bg-opacity-30 py-8 text-center opacity-80">
        <p>© 2024 MomentCap. Built with ❤️</p>
      </footer>
    </div>
  )
}
