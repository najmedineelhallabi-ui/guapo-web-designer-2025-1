import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<'/api/albums/[code]'>
) {
  try {
    const { code } = await ctx.params

    const { data: album, error } = await supabaseAdmin
      .from('albums')
      .select(`
        *,
        timeslots: timeslots(id, name, start_time, end_time, is_active),
        photos: photos(id, url, visibility, timestamp, contributor_name, created_at, invite_id)
      `)
      .eq('qr_code', code)
      .single()

    if (error || !album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }

    return NextResponse.json({ album })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
