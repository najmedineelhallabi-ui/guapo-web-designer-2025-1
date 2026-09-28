'use client'

import { useEffect, useState } from 'react'
import { getUser, onAuthChange, signOut, type AppUser } from './api'

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const refresh = () =>
      getUser().then((u) => {
        if (!active) return
        setUser(u)
        setLoading(false)
      })
    refresh()
    const unsubscribe = onAuthChange(refresh)
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return { user, loading }
}

// Set while logging out so protected pages don't redirect to /login first
let leaving = false

/** Logs out and goes to the home page. */
export async function signOutAndGoHome() {
  leaving = true
  await signOut()
  window.location.replace('/')
}

/** Sends logged-out visitors to the login page, then back to `next`. */
export function useRequireAuth(next: string) {
  const auth = useAuth()
  useEffect(() => {
    if (!auth.loading && !auth.user && !leaving) window.location.replace(`/login?next=${encodeURIComponent(next)}`)
  }, [auth.loading, auth.user, next])
  return auth
}
