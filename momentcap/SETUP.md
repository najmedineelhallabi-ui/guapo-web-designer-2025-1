# 🎉 MomentCap - Setup Guide

Welcome! Here's how to get MomentCap running locally.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)
- Stripe account (for payments later)

## Step 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to initialize
3. Go to SQL Editor and copy-paste the content of `SUPABASE_SCHEMA.sql`
4. Run the SQL to create all tables
5. Create a Storage bucket:
   - Go to Storage
   - Click "New bucket"
   - Name it: `photos`
   - Make it Public
   - Click Create

6. Get your API keys:
   - Go to Settings > API
   - Copy `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - Copy `anon public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - Go to Settings > Service Role Key > Copy it (SUPABASE_SERVICE_ROLE_KEY)

## Step 2: Environment Setup

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in the Supabase keys you just copied:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
   ```

3. Generate NextAuth secret:
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and paste it as `NEXTAUTH_SECRET`

4. For Stripe (optional for now):
   - Get keys from [stripe.com](https://stripe.com)
   - Paste them in `.env.local`

## Step 3: Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` 🎉

## Features Working Now

✅ Create albums with QR codes
✅ Upload photos with camera or file
✅ Real-time photo gallery
✅ Watermark on freemium photos
✅ Simple dashboard

## Features Coming Next

🔜 Stripe payment integration
🔜 Permissions (private/public photos)
🔜 PDF/ZIP export
🔜 Email notifications
🔜 White-label for planners

## Testing

### Test Flow:
1. Go to http://localhost:3000/dashboard
2. Create a new album ("Test Party", date, location)
3. Copy the QR code or code
4. Go to http://localhost:3000/album/[code]
5. Upload some photos
6. See them appear in real-time

## Troubleshooting

**"Can't connect to Supabase"**
- Check your NEXT_PUBLIC_SUPABASE_URL is correct
- Make sure you're in the SQL schema setup step

**"Photos won't upload"**
- Check Supabase Storage > photos bucket is public
- Check browser console for errors

**"QR code not showing"**
- Clear browser cache
- Refresh the page

## Database Structure

```
albums
├── id, owner_id, owner_type
├── name, event_date, location
├── qr_code, is_paid
└── created_at

photos
├── id, album_id, invite_id
├── url, visibility
├── contributor_name, timestamp
└── is_approved

invites
├── id, album_id, code
└── created_at

timeslots
├── id, album_id, name
├── start_time, end_time, is_active
└── created_at
```

## Next Steps

1. Test upload flow
2. Add auth (NextAuth setup)
3. Implement Stripe payments
4. Add export (PDF/ZIP)
5. Email notifications

Good luck! 🚀
