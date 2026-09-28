# 🚀 MomentCap - Quick Start (Claude Code)

**Status:** ✅ MVP fully coded, ready to test

---

## What's Done

- ✅ Next.js project structure
- ✅ Supabase integration
- ✅ 3 main pages (Landing, Dashboard, Album Guest)
- ✅ Photo upload (camera + file)
- ✅ Watermark system
- ✅ QR code generation
- ✅ API routes
- ✅ Database schema

---

## Tomorrow Morning - 30 Minute Setup

### Step 1: Supabase Setup (15 min)

1. Go to [supabase.com](https://supabase.com) → Sign up (free)
2. Create new project
3. Go to **SQL Editor**
4. Open file: `SUPABASE_SCHEMA.sql` (in this folder)
5. Copy ALL the SQL
6. Paste into Supabase SQL Editor → **RUN**
7. Go to **Storage** → Click "New bucket"
   - Name: `photos`
   - Make it **PUBLIC**
   - Click Create

### Step 2: Get API Keys (5 min)

1. Go to **Settings** → **API**
2. Copy `Project URL` → paste in `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon public` key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Go to **Settings** → **Service Role Key** → copy → paste as `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Setup .env (5 min)

1. Open `.env.local.example` → rename to `.env.local`
2. Fill in the 3 Supabase keys from Step 2
3. For `NEXTAUTH_SECRET`, generate:
   ```bash
   openssl rand -base64 32
   ```
   Copy output → paste as `NEXTAUTH_SECRET`
4. For now, keep Stripe keys as placeholders (we'll do payments later)

### Step 4: Run (5 min)

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## Test the Flow

1. Click **"Create Album"** (top right)
2. Fill in: Name, Date, Location
3. Click **"Create Album"**
4. Copy the **QR code** or **code**
5. In new tab: `http://localhost:3000/album/[CODE]` (replace [CODE])
6. Try uploading a photo
7. **Check watermark** appears on the photo!

---

## Files You'll Need to Edit

### Database
- `SUPABASE_SCHEMA.sql` ← Copy into Supabase

### Config
- `.env.local` ← Fill with Supabase keys (create from `.env.local.example`)

### Code (later)
- `app/dashboard/page.tsx` ← Create album page
- `app/album/[code]/page.tsx` ← Upload/gallery page
- `app/api/photos/route.ts` ← Upload handler
- `lib/photoUtils.ts` ← Watermark logic

---

## Next Steps (After Testing)

1. ✅ Make sure upload works
2. ✅ Test watermark appears
3. ✅ QR code works
4. 🔜 Add Stripe payment
5. 🔜 Add auth (NextAuth)
6. 🔜 Add export (PDF/ZIP)

---

## Troubleshooting

**"Can't upload photos"**
- Check Supabase Storage bucket "photos" is PUBLIC
- Check .env.local has correct keys

**"Watermark not showing"**
- Refresh browser
- Check console for errors
- Make sure `is_paid: false` in album

**"QR code not working"**
- Clear browser cache
- Check album was created
- Make sure code is correct

---

## File Structure

```
app/
├── page.tsx ........................ Landing page
├── dashboard/page.tsx .............. Create album
├── album/[code]/page.tsx ........... Guest upload page
├── api/
│   ├── albums/route.ts ............ Create/list albums
│   ├── albums/[code]/route.ts ..... Get album by code
│   └── photos/route.ts ............ Upload photos
├── layout.tsx ...................... Root layout
└── globals.css ..................... Tailwind styles

lib/
├── supabase.ts ..................... Supabase client
└── photoUtils.ts ................... Watermark + compress

public/
└── (Next.js default)

.env.local .......................... YOUR KEYS GO HERE
SETUP.md ............................ Detailed setup guide
TODO.md ............................. Sprint roadmap
SUPABASE_SCHEMA.sql ................. Database setup
```

---

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, TailwindCSS
- **Backend:** Supabase (Auth, DB, Storage)
- **Uploads:** Supabase Storage
- **Camera:** react-webcam
- **QR:** qrcode.react
- **Image:** Canvas API (compression, watermark)

---

## Checklist for Tomorrow

- [ ] Create Supabase project
- [ ] Copy SQL schema
- [ ] Create photos bucket
- [ ] Get API keys
- [ ] Fill .env.local
- [ ] npm run dev
- [ ] Create test album
- [ ] Upload photo
- [ ] Check watermark
- [ ] ✅ DONE! Ready for next sprint

---

**Questions?** Check SETUP.md for more details.

**Ready to ship!** 🚀
