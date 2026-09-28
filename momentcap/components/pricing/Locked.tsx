import Link from 'next/link'
import { LockIcon } from '@/components/Icons'
import { FEATURE_LABELS, packFor, packInfo, upgradePrice, euroPrice, type Features, type Tier } from '@/lib/pricing'

/** Small "🔒 Photos" badge next to a locked feature. */
export function LockBadge({ feature }: { feature: keyof Features }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
      <LockIcon className="h-3 w-3" /> {packInfo(packFor(feature)).name}
    </span>
  )
}

/** Upsell panel shown instead of (or above) a locked feature. */
export function UpgradePanel({
  code,
  feature,
  current,
  isOwner = true,
  children
}: {
  code: string
  feature: keyof Features
  current: Tier
  isOwner?: boolean
  children?: React.ReactNode
}) {
  const pack = packFor(feature)
  const price = upgradePrice(current, pack)
  return (
    <div className="rounded-3xl border-2 border-dashed border-ink/20 bg-brand-soft p-6 text-center sm:p-8">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-white">
        <LockIcon />
      </div>
      <h2 className="mt-4 text-xl font-extrabold">{FEATURE_LABELS[feature] || 'This feature'} is part of the {packInfo(pack).name} pack</h2>
      {children && <div className="mx-auto mt-2 max-w-md text-ink-soft">{children}</div>}
      {isOwner ? (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link href={`/album/${code}/upgrade?pack=${pack}`} className="rounded-full bg-ink px-6 py-3 font-semibold text-white">
            Unlock for {euroPrice(price)}
          </Link>
          <Link href="/pricing#subscriptions" className="rounded-full border border-ink/20 bg-white px-6 py-3 font-semibold">
            Or go Pro (all events)
          </Link>
        </div>
      ) : (
        <p className="mt-4 text-sm font-semibold">Ask the album owner to unlock it.</p>
      )}
    </div>
  )
}
