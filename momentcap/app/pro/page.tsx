import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import { CheckIcon } from '@/components/Icons'
import { SUBSCRIPTIONS, euroPrice } from '@/lib/pricing'

export const metadata = { title: 'Moment caps Pro — for wedding planners and venues' }

const included = [
  'The Full event pack on every event you create',
  'Online invitations with RSVP, guest lists and seating plans',
  'Photo albums with live slideshow, challenges and approval',
  'Co-organize each event with your clients',
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
            For wedding planners, photographers and venues: one subscription, unlimited events, every feature.
          </p>
        </section>

        <section className="mx-auto grid max-w-4xl gap-6 px-4 md:grid-cols-2">
          {SUBSCRIPTIONS.map((s) => (
            <div key={s.id} className={`flex flex-col rounded-3xl p-8 ${s.period === 'year' ? 'bg-ink text-white' : 'border border-line bg-white'}`}>
              <h2 className="text-lg font-bold">{s.name}</h2>
              <p className={`text-sm ${s.period === 'year' ? 'text-white/70' : 'text-ink-soft'}`}>{s.tagline}</p>
              <p className="mt-4 text-4xl font-extrabold">
                {euroPrice(s.price)}
                <span className="text-base font-semibold"> / {s.period}</span>
              </p>
              <Link
                href={`/account?plan=${s.id}`}
                className={`mt-8 block rounded-full py-3 text-center font-bold ${s.period === 'year' ? 'bg-brand text-ink' : 'bg-ink text-white'}`}
              >
                Start {s.name}
              </Link>
            </div>
          ))}
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
