import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import { CheckIcon } from '@/components/Icons'
import PlansWithToggle from '@/components/pricing/PlansWithToggle'

export const metadata = { title: 'Moment caps Pro — for wedding planners and venues' }

const included = [
  'Starter: the Photos pack on every event · Pro & Business: Full event',
  'Online invitations with RSVP, guest lists and seating plans',
  'Photo albums with live slideshow, challenges and approval',
  'Business: a team of 5 who manage all your events',
  'ZIP and PDF photo books for every event',
  'Cancel anytime'
]

export default function ProPage() {
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 pt-16 pb-10 text-center">
          <span className="inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider">Moment caps Pro</span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">Every event you run, fully equipped</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-soft">
            For wedding planners, photographers and venues: one subscription, unlimited events — monthly or yearly.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-4">
          <PlansWithToggle />
        </section>

        <section className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-center text-2xl font-extrabold">What&apos;s included</h2>
          <ul className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-2">
            {included.map((i) => (
              <li key={i} className="flex gap-3 rounded-2xl border border-line bg-white p-4">
                <CheckIcon className="h-5 w-5 shrink-0" /> {i}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-ink-soft">
            Organizing a single event?{' '}
            <Link href="/pricing" className="font-semibold text-ink underline underline-offset-4">
              See one-shot packs
            </Link>
            {contact && (
              <>
                {' · '}
                <a href={`mailto:${contact}?subject=${encodeURIComponent('Moment caps Pro')}`} className="font-semibold text-ink underline underline-offset-4">
                  Contact us
                </a>
              </>
            )}
          </p>
        </section>
      </main>
    </div>
  )
}
