type P = { className?: string }
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export const QrIcon = ({ className = 'h-6 w-6' }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3" /></svg>
)
export const LockIcon = ({ className = 'h-6 w-6' }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
)
export const BoltIcon = ({ className = 'h-6 w-6' }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
)
export const CameraIcon = ({ className = 'h-6 w-6' }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" /><circle cx="12" cy="13.5" r="3.5" /></svg>
)
export const UploadIcon = ({ className = 'h-6 w-6' }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
)
export const CheckIcon = ({ className = 'h-5 w-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="m5 12 5 5 9-10" /></svg>
)
export const XIcon = ({ className = 'h-5 w-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M6 6l12 12M18 6 6 18" /></svg>
)
export const ImageIcon = ({ className = 'h-6 w-6' }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></svg>
)
