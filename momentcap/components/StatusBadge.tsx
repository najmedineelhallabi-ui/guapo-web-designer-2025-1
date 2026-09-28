import { albumStatus, type AlbumSettings } from '@/lib/albumRules'

const styles = {
  open: 'bg-green-100 text-green-800',
  scheduled: 'bg-brand-soft text-ink',
  closed: 'bg-line text-ink-soft'
}
const labels = { open: 'Open for photos', scheduled: 'Opens later', closed: 'Closed' }

export default function StatusBadge({ settings }: { settings: AlbumSettings }) {
  const status = albumStatus(settings)
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${styles[status]}`}>{labels[status]}</span>
}
