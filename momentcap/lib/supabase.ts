import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Clients are created on first use so the app can build and render
// even before the Supabase env vars are configured.
function lazyClient(getKey: () => string | undefined, label: string): SupabaseClient {
  let client: SupabaseClient | null = null
  return new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      if (!client) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = getKey()
        if (!url || !key) {
          throw new Error(`Supabase is not configured (missing NEXT_PUBLIC_SUPABASE_URL or ${label})`)
        }
        client = createClient(url, key)
      }
      return Reflect.get(client, prop)
    }
  })
}

// Client-side
export const supabase = lazyClient(() => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')

// Server-side (with service role)
export const supabaseAdmin = lazyClient(() => process.env.SUPABASE_SERVICE_ROLE_KEY, 'SUPABASE_SERVICE_ROLE_KEY')

// Types
export type Album = {
  id: string
  owner_id: string
  owner_type: 'couple' | 'planner'
  name: string
  event_date: string
  location: string
  qr_code: string
  is_paid: boolean
  album_visibility: 'private' | 'public'
  created_at: string
  payment_intent_id?: string
}

export type Photo = {
  id: string
  album_id: string
  invite_id: string
  url: string
  visibility: 'private' | 'public'
  is_approved: boolean | null
  timestamp: string
  contributor_name: string
  created_at: string
}

export type Invite = {
  id: string
  album_id: string
  code: string
  name?: string
  created_at: string
}

export type Timeslot = {
  id: string
  album_id: string
  name: string
  start_time: string
  end_time: string
  is_active: boolean
  created_at: string
}
