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

export { signOut }
