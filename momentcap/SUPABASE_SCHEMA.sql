-- Create tables for MomentCap

-- Albums table
CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL,
  owner_type TEXT NOT NULL CHECK (owner_type IN ('couple', 'planner')),
  name TEXT NOT NULL,
  event_date DATE NOT NULL,
  location TEXT,
  qr_code TEXT UNIQUE NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  album_visibility TEXT DEFAULT 'public' CHECK (album_visibility IN ('public', 'private')),
  payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Timeslots table
CREATE TABLE timeslots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Invites table
CREATE TABLE invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Photos table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  -- Per-guest session id generated in the browser; not tied to the invites table yet
  invite_id UUID NOT NULL,
  url TEXT NOT NULL,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  is_approved BOOLEAN,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  contributor_name TEXT DEFAULT 'Anonymous',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_albums_owner_id ON albums(owner_id);
CREATE INDEX idx_albums_qr_code ON albums(qr_code);
CREATE INDEX idx_photos_album_id ON photos(album_id);
CREATE INDEX idx_photos_invite_id ON photos(invite_id);
CREATE INDEX idx_timeslots_album_id ON timeslots(album_id);
CREATE INDEX idx_invites_album_id ON invites(album_id);
CREATE INDEX idx_invites_code ON invites(code);

-- Set up Storage bucket for photos
-- Run this in Supabase Storage: Create new bucket named "photos" with public access

-- Row Level Security (RLS) policies
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeslots ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read public albums
CREATE POLICY "Public albums are readable" ON albums
  FOR SELECT USING (album_visibility = 'public');

-- Album owners (Supabase Auth). The API routes use the service role key,
-- which bypasses RLS; this policy covers direct client access.
CREATE POLICY "Album owners can read their albums" ON albums
  FOR SELECT USING (owner_id = auth.uid()::text);

-- Allow anyone to insert photos
CREATE POLICY "Allow photo uploads" ON photos
  FOR INSERT WITH CHECK (true);

-- Allow reading photos from public albums
CREATE POLICY "Public album photos readable" ON photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM albums WHERE albums.id = photos.album_id AND albums.album_visibility = 'public'
    )
  );
