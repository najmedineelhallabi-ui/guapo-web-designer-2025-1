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

## Structure

- `lib/api.ts` — client data layer (server or demo mode)
- `lib/albumRules.ts` — album settings and upload rules shared by client and server
- `lib/server/` — storage drivers, auth (scrypt passwords, HMAC tokens), data access
- `app/api/` — auth, albums, photos, signed file serving
