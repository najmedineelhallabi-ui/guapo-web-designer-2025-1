import { NextRequest } from 'next/server'
import { createToken, emailKey, verifyPassword } from '@/lib/server/auth'
import { getUserByEmail, publicUser } from '@/lib/server/db'
import { fail, handle, json } from '@/lib/server/http'

export const POST = handle(async (request: NextRequest) => {
  const { email, password } = await request.json().catch(() => ({}))
  if (typeof email !== 'string' || typeof password !== 'string') return fail('Wrong email or password', 401)

  const user = await getUserByEmail(email)
  if (!user || !verifyPassword(password, user.password)) return fail('Wrong email or password', 401)

  return json({ token: createToken(user.id, emailKey(user.email)), user: publicUser(user) })
})
