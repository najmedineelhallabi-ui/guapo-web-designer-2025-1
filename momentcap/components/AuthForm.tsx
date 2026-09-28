'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import Logo from './Logo'
import { useAuth } from '@/lib/useAuth'

const inputClass =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand'

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter()
  const params = useSearchParams()
  // Only allow in-app redirects
  const rawNext = params.get('next') || '/dashboard'
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const isSignup = mode === 'signup'

  // Already signed in: skip the form
  const { session } = useAuth()
  useEffect(() => {
    if (session) router.replace(next)
  }, [session, next, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setNotice('')

    if (!isSupabaseConfigured) {
      setError('Accounts are not available yet. Please try again later.')
      return
    }

    setLoading(true)
    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}/login?next=${encodeURIComponent(next)}`
          }
        })
        if (error) throw error
        if (!data.session) {
          // Email confirmation is enabled on the Supabase project
          setNotice(`We sent a confirmation link to ${email}. Click it, then log in.`)
          return
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
      router.push(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const otherHref = `${isSignup ? '/login' : '/signup'}${next !== '/dashboard' ? `?next=${encodeURIComponent(next)}` : ''}`

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Logo />
      <div className="mt-8 w-full max-w-sm rounded-3xl border border-line bg-white p-7 shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight">
          {isSignup ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="mt-1 text-ink-soft">
          {isSignup ? 'Create albums and collect every guest’s photos.' : 'Log in to manage your albums.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isSignup && (
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold">Name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} required
                autoComplete="name" placeholder="Your name" className={inputClass} />
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              autoComplete="email" placeholder="you@example.com" className={inputClass} />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              minLength={6} autoComplete={isSignup ? 'new-password' : 'current-password'}
              placeholder={isSignup ? 'At least 6 characters' : ''} className={inputClass} />
          </div>

          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {notice && <p className="rounded-xl border border-line bg-brand-soft px-4 py-3 text-sm">{notice}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-full bg-brand py-3.5 font-bold transition hover:bg-brand-strong disabled:opacity-50">
            {loading ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-sm text-ink-soft">
        {isSignup ? 'Already have an account?' : 'New to MomentCap?'}{' '}
        <Link href={otherHref} className="font-semibold text-ink underline underline-offset-4">
          {isSignup ? 'Log in' : 'Create an account'}
        </Link>
      </p>
    </div>
  )
}
