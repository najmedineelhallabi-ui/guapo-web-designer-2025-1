'use client'

import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import SiteHeader from '@/components/SiteHeader'
import { PACKS, SUBSCRIPTIONS, euroPrice } from '@/lib/pricing'
import { Wordmark } from '@/components/Logo'
import { QrIcon, LockIcon, CheckIcon, XIcon, TvIcon, MessageIcon, StarIcon, BookIcon, UsersIcon } from '@/components/Icons'

const steps = [
  { n: '1', title: 'Create your album', text: 'Name it, pick the date. Takes 30 seconds.' },
  { n: '2', title: 'Share the QR code', text: 'Print it on tables, show it on screen, send the link.' },
  { n: '3', title: 'Guests add their photos', text: 'They scan, snap and upload. No app, no account.' }
]

const features = [
  { icon: QrIcon, title: 'Zero setup for guests', text: 'Scan the QR code and upload instantly. No app, no account.' },
  { icon: UsersIcon, title: 'Plan the whole event', text: 'Online invitation with RSVP, guest list, seating plan and “find your table”.' },
  { icon: CheckIcon, title: 'Checklist, budget, vendors', text: 'Everything to prepare the big day, in the same place as your photos.' },
  { icon: TvIcon, title: 'Live slideshow', text: 'Photos appear on the big screen as guests take them.' },
  { icon: MessageIcon, title: 'Guestbook & reactions', text: 'Guests leave you messages and react ❤️ 😂 😮 to photos.' },
  { icon: StarIcon, title: 'Photo challenges & moments', text: 'Fun missions and album sections: ceremony, cocktail, party…' },
  { icon: LockIcon, title: 'You stay in control', text: 'Approve photos, private gallery, access code, upload times.' },
  { icon: BookIcon, title: 'Keep the memories', text: 'Download everything as a ZIP or a PDF photo book.' }
]

// Soft placeholder tiles for the hero preview
const tiles = ['#FFE680', '#F9D7C4', '#CFE3D4', '#D9D4F2', '#FFD700', '#F4E3B2']

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 overflow-x-clip px-4 pt-14 pb-20 md:grid-cols-2 md:pt-20">
          <div>
            <span className="inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink">
              Weddings · Birthdays · Parties
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Every guest&apos;s photos.{' '}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10">One album.</span>
                <span className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-brand sm:h-4" aria-hidden="true" />
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink-soft">
              The collaborative photo album that brings your events to life. No WhatsApp chaos,
              no scattered photos — just your moments, in one place.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-full bg-brand px-7 py-3.5 text-center font-bold text-ink shadow-sm transition hover:bg-brand-strong"
              >
                Create a free album
              </Link>
              <a
                href="#pricing"
                className="rounded-full border border-line bg-white px-7 py-3.5 text-center font-semibold text-ink transition hover:border-ink"
              >
                See pricing
              </a>
            </div>
            <p className="mt-4 text-sm text-ink-soft">Free for 7 days · No credit card</p>
          </div>

          {/* Preview card */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-4 -z-10 rotate-3 rounded-[2rem] bg-brand" aria-hidden="true" />
            <div className="rounded-[1.75rem] border border-line bg-white p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Album</p>
                  <p className="text-lg font-bold">Sarah &amp; Tom&apos;s Wedding</p>
                </div>
                <Wordmark className="h-6" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {tiles.map((c, i) => (
                  <div key={i} className="aspect-square rounded-xl" style={{ background: c }} />
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4 rounded-2xl bg-cream p-3">
                <QRCodeSVG value="https://momentcaps.vercel.app" size={72} bgColor="transparent" />
                <div>
                  <p className="font-semibold">Scan to add your photos</p>
                  <p className="text-sm text-ink-soft">128 photos · 42 guests</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-line bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">How it works</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {steps.map((s) => (
                <div key={s.n} className="text-center md:text-left">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand text-lg font-extrabold md:mx-0">
                    {s.n}
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                  <p className="mt-1 text-ink-soft">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-line bg-white p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft">
                  <Icon />
                </div>
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-1 text-ink-soft">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-20 bg-ink py-20 text-white">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">Simple pricing</h2>
            <p className="mt-3 text-center text-white/70">Pay once for your event — or subscribe if you organize events often.</p>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {PACKS.map((p) => (
                <div key={p.id} className={`flex flex-col rounded-3xl p-7 ${p.id === 'event' ? 'bg-brand text-ink' : 'border border-white/15'}`}>
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <p className={`text-sm ${p.id === 'event' ? '' : 'text-white/60'}`}>{p.tagline}</p>
                  <p className="mt-3 text-4xl font-extrabold">
                    {euroPrice(p.price)}
                    {p.price > 0 && <span className="text-base font-semibold"> once</span>}
                  </p>
                  <ul className={`mt-5 flex-1 space-y-2 text-sm ${p.id === 'event' ? '' : 'text-white/85'}`}>
                    {p.highlights.map((h) => (
                      <li key={h} className="flex gap-2"><CheckIcon className={`h-5 w-5 shrink-0 ${p.id === 'event' ? '' : 'text-brand'}`} />{h}</li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className={`mt-6 block rounded-full py-3 text-center font-semibold ${p.id === 'event' ? 'bg-ink text-white' : 'border border-white/30 hover:bg-white/10'}`}
                  >
                    {p.price === 0 ? 'Start free' : `Get ${p.name}`}
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/15 p-6 sm:flex-row">
              <div>
                <p className="text-lg font-bold">Pro subscription</p>
                <p className="text-sm text-white/70">
                  For planners, photographers and venues: every event gets the Full event pack. {euroPrice(SUBSCRIPTIONS[0].price)}/month or{' '}
                  {euroPrice(SUBSCRIPTIONS[1].price)}/year.
                </p>
              </div>
              <Link href="/pricing#subscriptions" className="shrink-0 rounded-full bg-white px-6 py-3 font-semibold text-ink">
                See Pro plans
              </Link>
            </div>
            <p className="mt-6 text-center text-sm text-white/60">
              <Link href="/pricing" className="underline underline-offset-4">Compare all features</Link>
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ready for your next event?</h2>
          <p className="mt-3 text-ink-soft">Your album is live in under a minute.</p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-full bg-brand px-8 py-4 font-bold text-ink transition hover:bg-brand-strong"
          >
            Create your first album
          </Link>
        </section>
      </main>

      <footer className="border-t border-line py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-sm text-ink-soft sm:flex-row">
          <Wordmark className="h-7" />
          <span className="flex gap-4">
            <Link href="/pro" className="font-semibold text-ink hover:underline">For planners & venues</Link>
            <span>© {new Date().getFullYear()} Moment caps</span>
          </span>
        </div>
      </footer>
    </div>
  )
}
