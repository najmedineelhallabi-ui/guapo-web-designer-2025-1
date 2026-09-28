import Link from 'next/link'
import Logo from './Logo'

export default function SiteHeader({ cta = true }: { cta?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        {cta && (
          <Link
            href="/dashboard"
            className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-black"
          >
            Create an album
          </Link>
        )}
      </div>
    </header>
  )
}
