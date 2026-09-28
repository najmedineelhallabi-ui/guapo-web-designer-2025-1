'use client'

import Link from 'next/link'
import Logo from './Logo'
import { useAuth, signOutAndGoHome } from '@/lib/useAuth'

export default function SiteHeader({ cta = true }: { cta?: boolean }) {
  const { user, loading } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Logo />
        {!loading && (
          <nav className="flex items-center gap-2 text-sm">
            {user ? (
              <>
                {cta && (
                  <Link href="/dashboard" className="rounded-full bg-ink px-5 py-2 font-semibold text-white transition hover:bg-black">
                    My albums
                  </Link>
                )}
                <Link href="/account" className="hidden rounded-full px-3 py-2 font-semibold text-ink-soft transition hover:text-ink sm:inline-block">
                  Account
                </Link>
                <button onClick={signOutAndGoHome} className="rounded-full px-3 py-2 font-semibold text-ink-soft transition hover:text-ink">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/pricing" className="hidden rounded-full px-3 py-2 font-semibold transition hover:bg-white sm:inline-block">
                  Pricing
                </Link>
                <Link href="/login" className="rounded-full px-3 py-2 font-semibold transition hover:bg-white">
                  Log in
                </Link>
                <Link href="/signup" className="rounded-full bg-ink px-5 py-2 font-semibold text-white transition hover:bg-black">
                  Sign up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
