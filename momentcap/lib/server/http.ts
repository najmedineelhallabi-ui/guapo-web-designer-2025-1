import 'server-only'
import { NextResponse } from 'next/server'

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status })
export const fail = (error: string, status: number) => NextResponse.json({ error }, { status })

/** Wraps a handler so storage/config errors become clean JSON responses. */
export function handle<A extends unknown[]>(fn: (...args: A) => Promise<Response>) {
  return async (...args: A) => {
    try {
      return await fn(...args)
    } catch (err) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'Server error'
      return fail(message === 'Storage is not configured' ? message : 'Server error', 500)
    }
  }
}

export const isUuid = (v: unknown): v is string =>
  typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(v)
