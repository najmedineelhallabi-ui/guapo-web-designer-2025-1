# 📋 MomentCap MVP Todo

## What's Done ✅

- [x] Project structure (Next.js + Supabase)
- [x] Database schema (5 tables)
- [x] Create album page
- [x] Album view page (for guests)
- [x] Photo upload (file + camera)
- [x] Photo watermark (freemium)
- [x] QR code generation
- [x] Photo gallery
- [x] Landing page
- [x] Basic UI/styling

## What You Need to Do Tomorrow 🔨

### 1. Supabase Setup (30 min)
- [ ] Create Supabase project
- [ ] Copy-paste SQL schema
- [ ] Create "photos" storage bucket
- [ ] Get and fill `.env.local`

### 2. Test Locally (1 hour)
- [ ] `npm install` and `npm run dev`
- [ ] Create test album
- [ ] Try uploading photos
- [ ] Check watermark appears
- [ ] Check photos show in gallery

### 3. Fix Issues (as they appear)
- [ ] TypeScript errors
- [ ] API issues
- [ ] Watermark not working
- [ ] Photo compression

## What's Next (Sprint 2) 🎯

### Auth (1 day)
- [ ] Setup NextAuth properly
- [ ] Email login
- [ ] Dashboard access control
- [ ] User sessions

### Payments (2 days)
- [ ] Stripe integration
- [ ] Create checkout page
- [ ] Payment success handling
- [ ] Remove watermark on paid

### Permissions (1 day)
- [ ] Private/public photo toggle
- [ ] Private/public album toggle
- [ ] Filter photos by visibility
- [ ] Only show public albums to guests

### Export (1 day)
- [ ] PDF export (jspdf)
- [ ] ZIP export (jszip)
- [ ] Download buttons
- [ ] Test exports

### Email (1 day)
- [ ] Send email when album expires (day 2)
- [ ] Send email day 5
- [ ] Send email day 7
- [ ] Recovery email after expiry

## Nice to Have (Sprint 3) 💅

- [ ] Timeslots "live" feature
- [ ] Dark mode
- [ ] Analytics dashboard
- [ ] Share buttons (WhatsApp, Instagram)
- [ ] Rename album
- [ ] Delete photos
- [ ] Invite codes (custom per guest)

## Known Issues 🐛

- Watermark canvas might not work on all browsers
- No error handling on photo compression
- No file size limit on upload
- No spam prevention

## Metrics to Track

- Photos uploaded per album
- Conversion rate (free → paid)
- Average album lifetime
- Storage usage

## Branch Strategy

```
main (production)
  └── develop (staging)
       ├── auth
       ├── payments
       ├── permissions
       └── export
```

## Deployment

When ready:
1. Push to Vercel
2. Setup Stripe webhook
3. Setup email service (SendGrid/Resend)
4. Monitor usage
5. Scale as needed

---

**Current Status:** MVP Core done, ready for env setup + testing
**Time Spent:** ~2 hours of coding
**Next Checkpoint:** Get it running locally tomorrow
