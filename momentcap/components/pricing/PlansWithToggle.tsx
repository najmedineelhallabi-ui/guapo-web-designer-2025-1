'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BillingToggle, SubscriptionCards } from './Cards'
import type { Billing } from '@/lib/pricing'

/** Subscription plans with the monthly / yearly switch, linking to the account page. */
export default function PlansWithToggle() {
  const [billing, setBilling] = useState<Billing>('month')
  return (
    <>
      <div className="mb-8 text-center">
        <BillingToggle billing={billing} onChange={setBilling} />
      </div>
      <SubscriptionCards
        billing={billing}
        cta={(id) => (
          <Link href={`/account?plan=${id}&billing=${billing}`} className="block rounded-full bg-brand py-3 text-center font-bold text-ink">
            Subscribe
          </Link>
        )}
      />
    </>
  )
}
