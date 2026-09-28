import Link from 'next/link'

/** Square app icon (yellow camera). */
export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return <img src="/brand/icon.png" alt="" aria-hidden="true" className={`${className} rounded-[22%] object-cover`} />
}

/** The "Moment caps" logo: a band of the original image (yellow background, camera, bubble letters). */
export function Wordmark({ className = 'h-8' }: { className?: string }) {
  return <img src="/brand/logo-banner.png" alt="Moment caps" className={`${className} w-auto rounded-lg`} />
}

export default function Logo({ className = 'h-9 sm:h-10' }: { className?: string }) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Moment caps — home">
      <Wordmark className={className} />
    </Link>
  )
}
