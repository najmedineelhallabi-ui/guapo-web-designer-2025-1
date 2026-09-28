import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, event_date, location, owner_id, owner_type = 'couple' } = body

    if (!name || !event_date || !owner_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const albumId = uuidv4()
    const qrCode = uuidv4().split('-')[0].toUpperCase()

    // Create album
    const { data: album, error: albumError } = await supabaseAdmin
      .from('albums')
      .insert({
        id: albumId,
        owner_id,
        owner_type,
        name,
        event_date,
        location: location || '',
        qr_code: qrCode,
        is_paid: false,
        album_visibility: 'public'
      })
      .select()
      .single()

    if (albumError) {
      return NextResponse.json({ error: albumError.message }, { status: 500 })
    }

    // The QR code itself is rendered client-side from this URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
    const qrUrl = `${appUrl}/album/${qrCode}`

    return NextResponse.json({
      album,
      qrUrl
    })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: albums, error } = await supabaseAdmin
      .from('albums')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ albums })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
