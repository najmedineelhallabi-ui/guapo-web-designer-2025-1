import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const albumId = formData.get('albumId') as string
    const inviteId = formData.get('inviteId') as string
    const visibility = (formData.get('visibility') as string) || 'public'
    const contributorName = (formData.get('contributorName') as string) || 'Anonymous'

    if (!file || !albumId || !inviteId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify album exists
    const { data: album, error: albumError } = await supabaseAdmin
      .from('albums')
      .select('id, is_paid')
      .eq('id', albumId)
      .single()

    if (albumError || !album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }

    // Upload photo to Supabase Storage
    const photoId = uuidv4()
    const fileName = `${albumId}/${photoId}.jpg`
    const buffer = await file.arrayBuffer()

    const { error: uploadError } = await supabaseAdmin.storage
      .from('photos')
      .upload(fileName, buffer, {
        contentType: 'image/jpeg'
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('photos')
      .getPublicUrl(fileName)

    // Create photo record
    const { data: photo, error: photoError } = await supabaseAdmin
      .from('photos')
      .insert({
        id: photoId,
        album_id: albumId,
        invite_id: inviteId,
        url: urlData.publicUrl,
        visibility,
        contributor_name: contributorName,
        timestamp: new Date().toISOString(),
        is_approved: null
      })
      .select()
      .single()

    if (photoError) {
      return NextResponse.json({ error: photoError.message }, { status: 500 })
    }

    return NextResponse.json({ photo })
  } catch (error) {
    console.error('Photo upload error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
