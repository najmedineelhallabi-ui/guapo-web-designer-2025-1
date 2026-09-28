# ☀️ MORNING CHECKLIST - 30 Minutes to Working App

## 🟢 PHASE 1: Supabase Setup (10 min)

- [ ] Open supabase.com
- [ ] Create free account
- [ ] Create new project
- [ ] Wait for it to load (~1 min)
- [ ] Go to SQL Editor
- [ ] Open `SUPABASE_SCHEMA.sql` from folder
- [ ] Copy ALL the SQL
- [ ] Paste into Supabase SQL Editor
- [ ] Click RUN ▶️
- [ ] Wait for tables to create (30 sec)
- [ ] Go to Storage tab
- [ ] Create bucket: `photos` (PUBLIC)

**✅ When done: You have database ready**

---

## 🟠 PHASE 2: Get Keys (5 min)

- [ ] Go to Supabase Settings → API
- [ ] Copy `Project URL`
- [ ] Copy `anon public` key
- [ ] Copy `Service Role Key`
- [ ] Keep these 3 keys ready

**✅ When done: You have 3 keys**

---

## 🔴 PHASE 3: Setup .env (5 min)

In this folder:

- [ ] Open `.env.local.example`
- [ ] Rename to `.env.local`
- [ ] Paste the 3 Supabase keys:
  - `NEXT_PUBLIC_SUPABASE_URL=` [Project URL]
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=` [anon public]
  - `SUPABASE_SERVICE_ROLE_KEY=` [service role]
- [ ] Generate `NEXTAUTH_SECRET`:
  ```bash
  openssl rand -base64 32
  ```
- [ ] Copy output → paste as `NEXTAUTH_SECRET`
- [ ] Save file

**✅ When done: .env.local is filled**

---

## 🟡 PHASE 4: Run (10 min)

```bash
npm run dev
```

Open: **http://localhost:3000**

You should see the landing page ✨

**✅ When done: App is running**

---

## 🔵 PHASE 5: Test (5 min)

1. Click **"Get Started"** button
2. Go to `/dashboard`
3. Click **"+ New Album"**
4. Fill:
   - Name: "Test Party"
   - Date: Today
   - Location: "Brussels"
5. Click **"Create Album"**
6. Copy the code (or screenshot QR)
7. Go to: `http://localhost:3000/album/[CODE]`
8. Replace [CODE] with the code from step 6
9. Click **"Upload Photo"** or **"📷 Take Photo"**
10. Pick any image from your computer
11. Wait for upload
12. See photo in gallery
13. **Check the watermark** ("📸 MomentCap")

**✅ If you see watermark: YOU'RE DONE!**

---

## 🎉 SUCCESS CHECKLIST

- [x] App running locally
- [x] Created album
- [x] Uploaded photo
- [x] Saw watermark
- [x] Real-time gallery working

**Status: MVP Ready! 🚀**

---

## If Something Breaks

### Photo won't upload
- Check Supabase Storage bucket is **PUBLIC**
- Check browser console (F12) for red errors
- Check .env.local has correct Supabase keys

### App won't start
- Try: `npm install` again
- Try: Delete `.next` folder
- Try: `npm run dev` again

### Watermark not showing
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page
- Make sure album shows `is_paid: false`

### QR code not working
- Make sure you created an album first
- Check the code matches in URL
- Try retyping the code manually

---

## Next: Ready for Sprint 2

Once this works:
- Auth (NextAuth)
- Payments (Stripe)
- Permissions
- Export
- Emails

**Estimated total time: 30 minutes ⏱️**

Good luck! You got this! 💪
