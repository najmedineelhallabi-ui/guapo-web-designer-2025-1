import { isSupabaseConfigured } from '@/lib/supabase'

export default function DemoBanner() {
  if (isSupabaseConfigured) return null
  return (
    <div className="bg-ink px-4 py-2 text-center text-xs font-medium text-white">
      Demo mode — accounts, albums and photos are saved only in this browser.
    </div>
  )
}
