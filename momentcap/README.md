# MomentCap

Collaborative photo albums for events: the organizer creates an album, shares
its QR code, and guests add photos from their phone — no app, no guest account.

## Storage modes

The app picks its backend automatically (`GET /api/config`):

| Mode | When | Data lives in |
|------|------|---------------|
| **server** | `BLOB_READ_WRITE_TOKEN` is set (Vercel Blob store connected to the project) | Vercel Blob — shared by every device |
| **server (local)** | `MOMENTCAP_LOCAL_STORE=/some/dir` | Files on disk — for local development and tests |
| **demo** | neither is set | The visitor's browser only (localStorage + IndexedDB) |

### Connect Vercel Blob

Vercel dashboard → project → **Storage** → **Create** → **Blob** → connect it to
the project (all environments). This adds `BLOB_READ_WRITE_TOKEN`; redeploy.
Optionally set `AUTH_SECRET` to a long random string to sign login tokens
(otherwise the Blob token is used as the signing key).

## Development

```bash
npm install
MOMENTCAP_LOCAL_STORE=.data npm run dev
```

## Features

Guided album creation (occasion, color, rules) · cover photo & color themes ·
access code · upload window with countdown · photo approval (moderation) ·
moments & photo challenges · photos and short videos · frames · reactions ·
guestbook · best-of favorites · live big-screen slideshow · stats · ZIP and
PDF photo book · co-organizers · Premium upgrade (demo payment) · Pro page.

## Pricing

`lib/pricing.ts` holds the whole catalog — change names, prices and what each
pack unlocks there:

- One-shot packs per event: **Free** (€0), **Photos** (€19), **Full event** (€39).
  Upgrading only charges the difference.
- Subscriptions, monthly or yearly (yearly = 10 months): **Starter** (€9/€90,
  Photos pack on every event), **Pro** (€29/€290, Full event on every event),
  **Business** (€59/€590, Pro + a team of 5 who manage all the account's events).

Features are enforced by the service (`requireFeature`), not only hidden in the UI.
Payments are simulated (demo mode, or `MOMENTCAP_DEMO_PAYMENTS=1`) until Stripe is connected.

## Structure

- `lib/albumRules.ts` — album model, defaults and rules (client + server)
- `lib/core/service.ts` — every action and permission check, written once
- `lib/core/repo.ts` — storage interface used by the service
- `lib/server/` — server repo (Blob / filesystem), auth tokens, HTTP helpers
- `lib/browserRepo.ts` — demo-mode repo (localStorage + IndexedDB)
- `lib/api.ts` — client layer: calls `/api/rpc` + `/api/upload` in server mode,
  or the service directly in demo mode
- `app/api/rpc` — JSON actions · `app/api/upload` — multipart uploads ·
  `app/api/upload/token` — Blob direct uploads for large videos ·
  `app/api/files` — signed file serving with Range support

Set `MOMENTCAP_DEMO_PAYMENTS=1` to allow the fake €5 upgrade in server mode,
and `NEXT_PUBLIC_CONTACT_EMAIL` for the Pro page contact button.
