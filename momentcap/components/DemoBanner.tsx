'use client'

import { useEffect, useState } from 'react'
import { getBackend } from '@/lib/api'

export default function DemoBanner() {
  const [demo, setDemo] = useState(false)
  useEffect(() => {
    getBackend().then((b) => setDemo(b === 'demo'))
  }, [])
  if (!demo) return null
  return (
    <div className="bg-ink px-4 py-2 text-center text-xs font-medium text-white print:hidden">
      Demo mode — accounts, albums and photos are saved only in this browser, so guests on other phones can&apos;t see them yet.
    </div>
  )
}
