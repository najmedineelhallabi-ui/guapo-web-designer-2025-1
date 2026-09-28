import Link from 'next/link'

/** Square app icon (yellow camera). */
export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return <img src="/brand/icon.png" alt="" aria-hidden="true" className={`${className} rounded-[22%] object-cover`} />
}

/** "Moment caps" bubble-letter wordmark (transparent background). */
export function Wordmark({ className = 'h-8' }: { className?: string }) {
  return <img src="/brand/wordmark.png" alt="Moment caps" className={`${className} w-auto`} />
}

export default function Logo({ className = 'h-8 sm:h-9' }: { className?: string }) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Moment caps — home">
      <Wordmark className={className} />
    </Link>
  )
}
