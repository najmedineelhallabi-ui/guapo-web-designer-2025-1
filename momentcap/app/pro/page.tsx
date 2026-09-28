import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import { CheckIcon } from '@/components/Icons'

export const metadata = { title: 'MomentCap Pro — for wedding planners and venues' }

const plans = [
  {
    name: 'Planner',
    price: '€29',
    period: '/month',
    for: 'Wedding planners & photographers',
    perks: ['Unlimited Premium albums', 'Your logo on QR cards and albums', 'Co-organize with your clients', 'Live slideshow for every event', 'Priority support'],
    highlight: true
  },
  {
    name: 'Venue',
    price: 'Custom',
    period: '',
    for: 'Reception halls, hotels, restaurants',
    perks: ['Everything in Planner', 'Multiple team accounts', 'Branded QR displays for your tables', 'Monthly stats report', 'Dedicated onboarding'],
    highlight: false
  }
]

export default function ProPage() {
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 pt-16 pb-10 text-center">
          <span className="inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider">MomentCap Pro</span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">Give every event you run a shared photo album</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-soft">
            For wedding planners, photographers and venues: create albums for your clients in seconds, with your brand on every QR card.
          </p>
        </section>

        <section className="mx-auto grid max-w-4xl gap-6 px-4 pb-20 md:grid-cols-2">
          {plans.map((p) => (
            <div key={p.name} className={`flex flex-col rounded-3xl p-8 ${p.highlight ? 'bg-ink text-white' : 'border border-line bg-white'}`}>
              <h2 className="text-lg font-bold">{p.name}</h2>
              <p className={`text-sm ${p.highlight ? 'text-white/70' : 'text-ink-soft'}`}>{p.for}</p>
              <p className="mt-4 text-4xl font-extrabold">
                {p.price}
                <span className="text-base font-semibold">{p.period}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-3">
                    <CheckIcon className={`h-5 w-5 shrink-0 ${p.highlight ? 'text-brand' : ''}`} /> {perk}
                  </li>
                ))}
              </ul>
              {contact ? (
                <a
                  href={`mailto:${contact}?subject=${encodeURIComponent(`MomentCap ${p.name}`)}`}
                  className={`mt-8 block rounded-full py-3 text-center font-bold ${p.highlight ? 'bg-brand text-ink' : 'bg-ink text-white'}`}
                >
                  Contact us
                </a>
              ) : (
                <Link href="/signup" className={`mt-8 block rounded-full py-3 text-center font-bold ${p.highlight ? 'bg-brand text-ink' : 'bg-ink text-white'}`}>
                  Start with a free album
                </Link>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
