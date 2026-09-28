'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'
import { SubscriptionCards } from '@/components/pricing/Cards'
import { useRequireAuth } from '@/lib/useAuth'
import { cancelSubscription, getAccount, getConfig, resumeSubscription, subscribe, type Account } from '@/lib/api'
import { subscriptionInfo, euroPrice, type PlanId } from '@/lib/pricing'
import { formatEventDate } from '@/lib/dates'

function AccountView() {
  const { user, loading: authLoading } = useRequireAuth('/account')
  const wanted = useSearchParams().get('plan') as PlanId | null
  const [account, setAccount] = useState<Account | null>(null)
  const [demoPayments, setDemoPayments] = useState(false)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const userId = user?.id
  useEffect(() => {
    if (!userId) return
    Promise.all([getAccount(), getConfig()])
      .then(([a, c]) => {
        setAccount(a)
        setDemoPayments(c.demoPayments)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load your account'))
  }, [userId])

  const act = async (label: string, fn: () => Promise<Account>, message: string) => {
    setBusy(label)
    setError('')
    setNotice('')
    try {
      setAccount(await fn())
      setNotice(message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusy('')
    }
  }

  if (authLoading || !user || !account) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-ink" />
      </div>
    )
  }

  const sub = account.subscription
  const plan = sub ? subscriptionInfo(sub.plan) : null
  const date = (iso: string) => formatEventDate(iso.slice(0, 10))

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-extrabold tracking-tight">My account</h1>
        <p className="mt-1 text-ink-soft">
          {user.name} · {user.email}
        </p>

        <section className="mt-8 rounded-3xl border border-line bg-white p-6 sm:p-8">
          <h2 className="text-lg font-bold">Subscription</h2>
          {account.active && plan && sub ? (
            <div className="mt-4">
              <p className="text-2xl font-extrabold">
                {plan.name} · {euroPrice(plan.price)} / {plan.period}
              </p>
              <p className="mt-1 text-ink-soft">
                {sub.status === 'active' ? `Renews on ${date(sub.current_period_end)}` : `Canceled — active until ${date(sub.current_period_end)}`}
              </p>
              <p className="mt-3 rounded-2xl bg-brand-soft px-4 py-3 text-sm">All your events have the Full event pack while your subscription is active.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {sub.status === 'active' ? (
                  <button
                    onClick={() => confirm('Cancel your subscription? It stays active until the end of the paid period.') && act('cancel', cancelSubscription, 'Subscription canceled.')}
                    disabled={!!busy}
                    className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold"
                  >
                    Cancel subscription
                  </button>
                ) : (
                  <button onClick={() => act('resume', resumeSubscription, 'Welcome back! Your subscription will renew.')} disabled={!!busy} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
                    Resume subscription
                  </button>
                )}
                {sub.plan === 'pro_monthly' && (
                  <button onClick={() => act('yearly', () => subscribe('pro_yearly'), 'Switched to yearly billing.')} disabled={!!busy} className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold">
                    Switch to yearly (2 months free)
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <p className="mt-1 text-ink-soft">
                No subscription. You pay per event — or go Pro to unlock every event.
              </p>
              <div className="mt-6">
                <SubscriptionCards
                  cta={(id) => (
                    <button
                      onClick={() => act(id, () => subscribe(id), 'You are Pro! Every event now has the Full event pack.')}
                      disabled={!!busy}
                      className={`w-full rounded-full py-3 font-bold ${wanted === id ? 'bg-brand text-ink ring-4 ring-brand/40' : 'bg-brand text-ink'}`}
                    >
                      {busy === id ? 'Processing…' : 'Subscribe'}
                    </button>
                  )}
                />
              </div>
              {demoPayments && <p className="mt-3 text-center text-xs text-ink-soft">Demo mode: no real payment is taken.</p>}
            </>
          )}
          {notice && <p className="mt-4 rounded-xl bg-brand-soft px-4 py-3 text-sm font-semibold" role="status">{notice}</p>}
          {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
        </section>
      </main>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense>
      <AccountView />
    </Suspense>
  )
}
