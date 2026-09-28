// <input type="datetime-local"> works in local time without a timezone
export const toLocalInput = (iso: string | null) => {
  if (!iso) return ''
  const d = new Date(iso)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export const fromLocalInput = (value: string) => (value ? new Date(value).toISOString() : null)

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString([], { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

/** "2026-10-10" -> "Sat 10 Oct 2026" without timezone shifts */
export const formatEventDate = (date: string) => {
  const [y, m, d] = date.split('-').map(Number)
  if (!y || !m || !d) return date
  return new Date(y, m - 1, d).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

/** Event day window: from 00:00 on the event date to 06:00 the next morning (local time). */
export const eventDayWindow = (date: string) => {
  const [y, m, d] = date.split('-').map(Number)
  return {
    open: new Date(y, m - 1, d, 0, 0).toISOString(),
    close: new Date(y, m - 1, d + 1, 6, 0).toISOString()
  }
}
