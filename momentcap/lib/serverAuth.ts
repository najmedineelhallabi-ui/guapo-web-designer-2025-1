import { NextRequest } from 'next/server'
import { supabaseAdmin } from './supabase'

// Resolves the signed-in user from the `Authorization: Bearer <access token>` header.
export async function getRequestUser(request: NextRequest) {
  const header = request.headers.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return null

  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) return null
  return data.user
}
