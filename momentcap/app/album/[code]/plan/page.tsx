'use client'

import Link from 'next/link'
import { usePlan } from '@/components/plan/PlanContext'
import { Card, Progress, Stat, euro } from '@/components/plan/ui'
import Countdown from '@/components/album/Countdown'
import ShareInvitation from '@/components/plan/ShareInvitation'
import { UpgradePanel } from '@/components/pricing/Locked'
import { budgetStats, guestStats } from '@/lib/planRules'
import { formatEventDate } from '@/lib/dates'

export default function PlanOverview() {
  const { album, plan, code, unseenAnswers } = usePlan()
  const g = guestStats(plan.guests)
  const b = budgetStats(plan)
  const done = plan.tasks.filter((t) => t.done).length
  const today = new Date().toISOString().slice(0, 10)
  const nextTasks = plan.tasks
    .filter((t) => !t.done)
    .sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'))
    .slice(0, 4)
  const latest = plan.guests
    .filter((guest) => guest.answered_at)
    .sort((a, b) => (b.answered_at || '').localeCompare(a.answered_at || ''))
    .slice(0, 5)
  const seats = plan.tables.reduce((n, t) => n + t.seats, 0)

  const [y, m, d] = album.event_date.split('-').map(Number)
  const start = y ? new Date(y, m - 1, d, ...((album.event.start_time || '00:00').split(':').map(Number) as [number, number])) : null
  const base = `/album/${code}/plan`

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-ink-soft">The big day</p>
            <p className="text-2xl font-extrabold">
              {formatEventDate(album.event_date)}
              {album.event.start_time ? ` · ${album.event.start_time}` : ''}
            </p>
            {(album.event.venue_name || album.location) && <p className="text-ink-soft">{album.event.venue_name || album.location}</p>}
          </div>
          {start && start.getTime() > Date.now() && <Countdown target={start.toISOString()} />}
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Guests & answers" action={<Link href={`${base}/guests`} className="text-sm font-semibold underline">Manage</Link>}>
          <div className="grid grid-cols-3 gap-2">
            <Stat value={g.yes} label="Coming" tone="bg-green-50" />
            <Stat value={g.pending} label="No answer" />
            <Stat value={g.no} label="Can't come" />
          </div>
          <p className="mt-3 text-sm text-ink-soft">
            {g.invited} invited · <span className="font-semibold text-ink">{g.people} people confirmed</span>
          </p>
        </Card>

        <Card title="Seating" action={<Link href={`${base}/seating`} className="text-sm font-semibold underline">Manage</Link>}>
          <p className="text-sm">
            <span className="text-2xl font-extrabold">{g.seated}</span> / {g.people} confirmed people seated
          </p>
          <div className="mt-3">
            <Progress value={g.seated} max={g.people} />
          </div>
          <p className="mt-3 text-sm text-ink-soft">
            {plan.tables.length} table{plan.tables.length === 1 ? '' : 's'} · {seats} seats
          </p>
        </Card>

        <Card title="Checklist" action={<Link href={`${base}/checklist`} className="text-sm font-semibold underline">Open</Link>}>
          <p className="text-sm">
            <span className="text-2xl font-extrabold">{done}</span> / {plan.tasks.length} done
          </p>
          <div className="mt-3">
            <Progress value={done} max={plan.tasks.length} />
          </div>
          {nextTasks.length > 0 ? (
            <ul className="mt-4 space-y-2 text-sm">
              {nextTasks.map((t) => (
                <li key={t.id} className="flex justify-between gap-3">
                  <span className="truncate">{t.title}</span>
                  {t.due && (
                    <span className={`shrink-0 font-semibold ${t.due < today ? 'text-red-700' : 'text-ink-soft'}`}>{formatEventDate(t.due)}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-ink-soft">No tasks yet. Start from our suggested checklist.</p>
          )}
        </Card>

        <Card title="Budget" action={<Link href={`${base}/budget`} className="text-sm font-semibold underline">Open</Link>}>
          <div className="grid grid-cols-3 gap-2">
            <Stat value={euro(b.planned)} label="Planned" />
            <Stat value={euro(b.paid)} label="Paid" />
            <Stat value={euro(b.toPay)} label="Left to pay" />
          </div>
          {b.remaining !== null && (
            <p className={`mt-3 text-sm font-semibold ${b.remaining < 0 ? 'text-red-700' : ''}`}>
              {b.remaining < 0 ? `${euro(-b.remaining)} over budget` : `${euro(b.remaining)} left in your budget`}
            </p>
          )}
        </Card>
      </div>

      {latest.length > 0 && (
        <Card title="Latest answers" action={<Link href={`${base}/guests`} className="text-sm font-semibold underline">All guests</Link>}>
          <ul className="divide-y divide-line">
            {latest.map((guest) => (
              <li key={guest.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="min-w-0 truncate">
                  <span className="font-semibold">{guest.name}</span>
                  {unseenAnswers.has(guest.id) && <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-xs font-bold text-white">New</span>}
                  {guest.diet && <span className="text-ink-soft"> · 🍽 {guest.diet}</span>}
                </span>
                <span className={`shrink-0 rounded-full px-3 py-1 font-semibold ${guest.rsvp === 'yes' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
                  {guest.rsvp === 'yes' ? `Coming${guest.party_size > 1 ? ` · ${guest.party_size}` : ''}` : "Can't come"}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {album.features.planning ? (
        <ShareInvitation />
      ) : (
        <UpgradePanel code={code} feature="planning" current={album.effective_tier}>
          Unlock the online invitation with RSVP, guest list, seating plan, budget and vendors. The checklist stays free.
        </UpgradePanel>
      )}

      <Card title="Vendors" action={<Link href={`${base}/vendors`} className="text-sm font-semibold underline">Open</Link>}>
        {plan.vendors.length === 0 ? (
          <p className="text-sm text-ink-soft">Keep your caterer, photographer, DJ… and what you owe them in one place.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {plan.vendors.map((v) => (
              <li key={v.id} className="rounded-full bg-cream px-3 py-1.5 text-sm">
                <span className="font-semibold">{v.name}</span> <span className="text-ink-soft">· {v.category}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
