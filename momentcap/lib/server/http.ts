import 'server-only'
import { AppError, formatError } from '../albumRules'
import type { Ctx } from '../core/service'
import { readToken } from './auth'
import { serverRepo } from './serverRepo'

export function errorResponse(err: unknown) {
  if (err instanceof AppError) {
    return Response.json({ error: err.message, code: err.code, params: err.params }, { status: err.status })
  }
  console.error(err)
  return Response.json({ error: formatError('server_error'), code: 'server_error' }, { status: 500 })
}

export function requireRepo() {
  const repo = serverRepo()
  if (!repo) throw new AppError('storage_unavailable', 503)
  return repo
}

export function ctxFrom(request: Request): Ctx {
  const token = readToken(request)
  const guest = request.headers.get('x-guest-id')
  const pin = request.headers.get('x-album-pin')
  return {
    user: token ? { id: token.uid, email: token.email, name: token.name } : null,
    guestId: guest && /^[0-9a-f-]{36}$/.test(guest) ? guest : null,
    pin: pin ? decodeURIComponent(pin) : null
  }
}
