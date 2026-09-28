import { NextRequest } from 'next/server'
import { readToken } from '@/lib/server/auth'
import { getUserByKey, publicUser } from '@/lib/server/db'
import { fail, handle, json } from '@/lib/server/http'

export const GET = handle(async (request: NextRequest) => {
  const token = readToken(request)
  const user = token && (await getUserByKey(token.ek))
  if (!user || user.id !== token.uid) return fail('Not logged in', 401)
  return json({ user: publicUser(user) })
})
