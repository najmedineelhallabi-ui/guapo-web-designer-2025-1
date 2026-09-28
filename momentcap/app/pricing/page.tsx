'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import { CheckIcon, XIcon } from '@/components/Icons'
import { PackCards } from '@/components/pricing/Cards'
import PlansWithToggle from '@/components/pricing/PlansWithToggle'
import { COMPARISON, PACKS } from '@/lib/pricing'

export default function PricingPage() {
  const [mode, setMode] = useState<'event' | 'subscription'>('event')

  useEffect(() => {
    if (window.location.hash === '#subscriptions') setMode('subscription')
  }, [])

  const cell = (v: string | boolean) =>
    v === true ? <CheckIcon className="mx-auto h-5 w-5" /> : v === false ? <XIcon className="mx-auto h-4 w-4 text-ink-soft/50" /> : <span className="text-sm">{v}</span>

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-14">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Simple pricing</h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-ink-soft">Pay once for your event, or subscribe if you organize events regularly.</p>

          <div id="subscriptions" className="mx-auto mt-8 inline-flex rounded-full border border-line bg-white p-1" role="tablist">
            {[
              ['event', 'For one event'],
              ['subscription', 'Subscription']
            ].map(([id, label]) => (
              <button
                key={id}
                role="tab"
                aria-selected={mode === id}
                onClick={() => setMode(id as typeof mode)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${mode === id ? 'bg-ink text-white' : 'text-ink-soft hover:text-ink'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          {mode === 'event' ? (
            <>
              <PackCards
                cta={(t) => (
                  <Link
                    href={t === 'free' ? '/signup' : `/signup?next=${encodeURIComponent('/dashboard/new')}`}
                    className={`block rounded-full py-3 text-center font-bold ${t === 'event' ? 'bg-brand text-ink' : t === 'photos' ? 'bg-ink text-white' : 'border border-line'}`}
                  >
                    {t === 'free' ? 'Start free' : 'Choose ' + PACKS.find((p) => p.id === t)!.name}
                  </Link>
                )}
              />
              <p className="mt-4 text-center text-sm text-ink-soft">
                Start free and upgrade anytime from your album — you only pay the difference.
              </p>
            </>
          ) : (
            <>
              <PlansWithToggle />
              <p className="mt-4 text-center text-sm text-ink-soft">
                Every event you create gets your plan&apos;s pack while the subscription is active. Change plan or cancel anytime.
              </p>
            </>
          )}
        </div>

        <section className="mt-16">
          <h2 className="text-center text-2xl font-extrabold">Compare the packs</h2>
          <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-white">
            <table className="w-full min-w-[34rem] text-left">
              <thead>
                <tr className="border-b border-line">
                  <th className="p-4 text-sm font-semibold text-ink-soft">Feature</th>
                  {PACKS.map((p) => (
                    <th key={p.id} className="p-4 text-center text-sm font-extrabold">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.label} className="border-b border-line last:border-0">
                    <td className="p-4 text-sm font-semibold">{row.label}</td>
                    <td className="p-4 text-center">{cell(row.free)}</td>
                    <td className="p-4 text-center">{cell(row.photos)}</td>
                    <td className="p-4 text-center">{cell(row.event)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-center text-sm text-ink-soft">Starter includes the Photos pack on every event; Pro and Business include Full event.</p>
        </section>
      </main>
    </div>
  )
}
