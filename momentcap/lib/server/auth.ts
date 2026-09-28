import 'server-only'
import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import type { NextRequest } from 'next/server'

const TOKEN_DAYS = 30

function secret() {
  const s = process.env.AUTH_SECRET || process.env.BLOB_READ_WRITE_TOKEN
  if (s) return s
  if (process.env.MOMENTCAP_LOCAL_STORE) return 'local-dev-secret'
  throw new Error('No AUTH_SECRET configured')
}

const b64url = (buf: Buffer | string) => Buffer.from(buf).toString('base64url')

export const emailKey = (email: string) =>
  createHash('sha256').update(email.trim().toLowerCase()).digest('hex')

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const expected = Buffer.from(hash, 'hex')
  const actual = scryptSync(password, salt, 64)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('base64url')
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export type TokenPayload = { uid: string; ek: string; exp: number }

export function createToken(uid: string, ek: string) {
  const payload = b64url(JSON.stringify({ uid, ek, exp: Date.now() + TOKEN_DAYS * 864e5 }))
  return `${payload}.${sign(payload)}`
}

export function readToken(request: NextRequest): TokenPayload | null {
  const header = request.headers.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const [payload, sig] = token.split('.')
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as TokenPayload
    return data.exp > Date.now() ? data : null
  } catch {
    return null
  }
}

/** Signs a file path so only URLs handed out by the API can be loaded. */
export const signedFileUrl = (pathname: string) => `/api/files/${pathname}?sig=${sign(pathname)}`

export const verifyFileSig = (pathname: string, sig: string | null) => Boolean(sig) && safeEqual(sig!, sign(pathname))
