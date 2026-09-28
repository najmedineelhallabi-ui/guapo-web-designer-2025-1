import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side (with service role)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

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
