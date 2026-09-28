'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'
import { XIcon } from '@/components/Icons'
import { BillingToggle, SubscriptionCards } from '@/components/pricing/Cards'
import { useRequireAuth } from '@/lib/useAuth'
import {
  addTeamMember,
  cancelSubscription,
  getAccount,
  getConfig,
  removeTeamMember,
  resumeSubscription,
  subscribe,
  type Account
} from '@/lib/api'
import { packInfo, planPrice, subscriptionInfo, euroPrice, type Billing, type PlanId } from '@/lib/pricing'
import { formatEventDate } from '@/lib/dates'

function AccountView() {
  const { user, loading: authLoading } = useRequireAuth('/account')
  const search = useSearchParams()
  const wanted = search.get('plan') as PlanId | null
  const [account, setAccount] = useState<Account | null>(null)
  const [demoPayments, setDemoPayments] = useState(false)
  const [billing, setBilling] = useState<Billing>(search.get('billing') === 'year' ? 'year' : 'month')
  const [showPlans, setShowPlans] = useState(false)
  const [teamEmail, setTeamEmail] = useState('')
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
        if (a.active && a.subscription) setBilling(a.subscription.billing)
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
      setShowPlans(false)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      return false
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

  const sub = account.active ? account.subscription : null
  const plan = sub ? subscriptionInfo(sub.plan) : null
  const date = (iso: string) => formatEventDate(iso.slice(0, 10))
  const sameAsCurrent = (id: PlanId) => Boolean(sub && sub.plan === id && sub.billing === billing)

  const planCards = (
    <>
      <div className="mb-6 text-center">
        <BillingToggle billing={billing} onChange={setBilling} />
      </div>
      <SubscriptionCards
        billing={billing}
        currentPlan={sub?.billing === billing ? sub.plan : null}
        cta={(id) => (
          <button
            onClick={() => act(id, () => subscribe(id, billing), sub ? `You're now on ${subscriptionInfo(id)!.name}.` : `Welcome to ${subscriptionInfo(id)!.name}!`)}
            disabled={!!busy || sameAsCurrent(id)}
            className={`w-full rounded-full py-3 font-bold disabled:opacity-50 ${wanted === id && !sub ? 'bg-brand text-ink ring-4 ring-brand/40' : 'bg-brand text-ink'}`}
          >
            {busy === id ? 'Processing…' : sameAsCurrent(id) ? 'Current plan' : sub ? 'Switch to this plan' : 'Subscribe'}
          </button>
        )}
      />
      {demoPayments && <p className="mt-3 text-center text-xs text-ink-soft">Demo mode: no real payment is taken.</p>}
    </>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-extrabold tracking-tight">My account</h1>
        <p className="mt-1 text-ink-soft">
          {user.name} · {user.email}
        </p>

        <section className="mt-8 rounded-3xl border border-line bg-white p-6 sm:p-8">
          <h2 className="text-lg font-bold">Subscription</h2>
          {sub && plan ? (
            <div className="mt-4">
              <p className="text-2xl font-extrabold">
                {plan.name} · {euroPrice(planPrice(plan, sub.billing))} / {sub.billing}
              </p>
              <p className="mt-1 text-ink-soft">
                {sub.status === 'active' ? `Renews on ${date(sub.current_period_end)}` : `Canceled — active until ${date(sub.current_period_end)}`}
              </p>
              <p className="mt-3 rounded-2xl bg-brand-soft px-4 py-3 text-sm">
                All your events have the <span className="font-semibold">{packInfo(plan.tier).name}</span> pack while your subscription is active.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => setShowPlans((v) => !v)} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
                  {showPlans ? 'Hide plans' : 'Change plan'}
                </button>
                {sub.status === 'active' ? (
                  <button
                    onClick={() => confirm('Cancel your subscription? It stays active until the end of the paid period.') && act('cancel', cancelSubscription, 'Subscription canceled.')}
                    disabled={!!busy}
                    className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold"
                  >
                    Cancel subscription
                  </button>
                ) : (
                  <button onClick={() => act('resume', resumeSubscription, 'Welcome back! Your subscription will renew.')} disabled={!!busy} className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold">
                    Resume subscription
                  </button>
                )}
              </div>
              {showPlans && <div className="mt-8">{planCards}</div>}
            </div>
          ) : (
            <>
              <p className="mt-1 text-ink-soft">No subscription: you pay per event. Subscribe if you organize events regularly.</p>
              <div className="mt-6">{planCards}</div>
            </>
          )}
          {notice && <p className="mt-4 rounded-xl bg-brand-soft px-4 py-3 text-sm font-semibold" role="status">{notice}</p>}
          {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
        </section>

        {sub && plan && plan.teamSize > 0 && (
          <section className="mt-6 rounded-3xl border border-line bg-white p-6 sm:p-8">
            <h2 className="text-lg font-bold">
              Team <span className="text-ink-soft">({sub.team.length}/{plan.teamSize})</span>
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Team members see and manage all your events. They sign up or log in with this email.
            </p>
            {sub.team.length > 0 && (
              <ul className="mt-4 space-y-2">
                {sub.team.map((email) => (
                  <li key={email} className="flex items-center justify-between rounded-xl bg-cream px-4 py-2.5 text-sm">
                    <span className="truncate">{email}</span>
                    <button
                      onClick={() => act('rm-' + email, () => removeTeamMember(email), `${email} removed from the team.`)}
                      className="rounded-full p-1 hover:bg-line"
                      aria-label={`Remove ${email}`}
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {sub.team.length < plan.teamSize && (
              <form
                className="mt-4 flex gap-2"
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (await act('team', () => addTeamMember(teamEmail), `${teamEmail} joined your team.`)) setTeamEmail('')
                }}
              >
                <input
                  type="email"
                  value={teamEmail}
                  onChange={(e) => setTeamEmail(e.target.value)}
                  required
                  placeholder="colleague@company.com"
                  aria-label="Team member email"
                  className="min-w-0 flex-1 rounded-xl border border-line px-4 py-2.5 focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <button type="submit" disabled={busy === 'team'} className="rounded-full bg-ink px-5 text-sm font-semibold text-white disabled:opacity-50">
                  Add
                </button>
              </form>
            )}
          </section>
        )}
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
