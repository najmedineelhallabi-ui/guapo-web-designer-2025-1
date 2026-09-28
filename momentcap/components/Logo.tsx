import Link from 'next/link'

export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="#FFD700" />
      <rect x="9" y="10" width="22" height="20" rx="4" fill="#fff" />
      <circle cx="20" cy="20" r="6" fill="none" stroke="#17150F" strokeWidth="2.5" />
      <rect x="12" y="13" width="4" height="3" rx="1" fill="#17150F" />
    </svg>
  )
}

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-lg text-ink">
      <LogoMark />
      MomentCap
    </Link>
  )
}
