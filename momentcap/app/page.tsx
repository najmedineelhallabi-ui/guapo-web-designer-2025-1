'use client'

import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import SiteHeader from '@/components/SiteHeader'
import { LogoMark } from '@/components/Logo'
import { QrIcon, LockIcon, BoltIcon, CheckIcon, XIcon } from '@/components/Icons'

const steps = [
  { n: '1', title: 'Create your album', text: 'Name it, pick the date. Takes 30 seconds.' },
  { n: '2', title: 'Share the QR code', text: 'Print it on tables, show it on screen, send the link.' },
  { n: '3', title: 'Guests add their photos', text: 'They scan, snap and upload. No app, no account.' }
]

const features = [
  { icon: QrIcon, title: 'Zero setup', text: 'Scan the QR code and upload instantly. No accounts needed for guests.' },
  { icon: LockIcon, title: 'Privacy first', text: 'Choose who sees what. Keep some photos just for you.' },
  { icon: BoltIcon, title: 'Live gallery', text: "Photos appear as they're taken, so everyone relives the moment together." }
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
                <LogoMark className="h-8 w-8" />
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
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">Simple pricing</h2>
            <p className="mt-3 text-center text-white/70">Start free. Upgrade only if you want to keep it.</p>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/15 p-8">
                <h3 className="text-lg font-bold">Free</h3>
                <p className="mt-2 text-4xl font-extrabold">€0</p>
                <ul className="mt-6 space-y-3 text-white/85">
                  {['7 days', 'Up to 100 photos', 'Share with all your guests'].map((t) => (
                    <li key={t} className="flex items-center gap-3"><CheckIcon className="h-5 w-5 text-brand" />{t}</li>
                  ))}
                  {['Watermark on photos', 'No downloads'].map((t) => (
                    <li key={t} className="flex items-center gap-3 text-white/50"><XIcon className="h-5 w-5" />{t}</li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="mt-8 block rounded-full border border-white/30 py-3 text-center font-semibold transition hover:bg-white/10"
                >
                  Start free
                </Link>
              </div>

              <div className="relative rounded-2xl bg-brand p-8 text-ink">
                <span className="absolute -top-3 right-6 rounded-full bg-white px-3 py-1 text-xs font-bold">Most popular</span>
                <h3 className="text-lg font-bold">Premium</h3>
                <p className="mt-2 text-4xl font-extrabold">
                  €5<span className="text-base font-semibold">/album</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {['Keep it forever', 'Unlimited photos', 'No watermark', 'Download as PDF or ZIP'].map((t) => (
                    <li key={t} className="flex items-center gap-3"><CheckIcon className="h-5 w-5" />{t}</li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="mt-8 block rounded-full bg-ink py-3 text-center font-semibold text-white transition hover:bg-black"
                >
                  Create an album
                </Link>
              </div>
            </div>
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
          <span className="flex items-center gap-2 font-semibold text-ink"><LogoMark className="h-6 w-6" /> MomentCap</span>
          <span>© {new Date().getFullYear()} MomentCap</span>
        </div>
      </footer>
    </div>
  )
}
