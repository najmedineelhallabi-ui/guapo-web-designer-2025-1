import { NextRequest } from 'next/server'
import { createToken, emailKey, hashPassword } from '@/lib/server/auth'
import { createUser, getUserByEmail, publicUser } from '@/lib/server/db'
import { fail, handle, json } from '@/lib/server/http'

export const POST = handle(async (request: NextRequest) => {
  const { name, email, password } = await request.json().catch(() => ({}))
  if (typeof name !== 'string' || !name.trim()) return fail('Please enter your name', 400)
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return fail('Please enter a valid email', 400)
  if (typeof password !== 'string' || password.length < 6) return fail('Password must be at least 6 characters', 400)

  if (await getUserByEmail(email)) return fail('An account with this email already exists', 409)

  const user = await createUser(name, email, hashPassword(password))
  return json({ token: createToken(user.id, emailKey(user.email)), user: publicUser(user) })
})
