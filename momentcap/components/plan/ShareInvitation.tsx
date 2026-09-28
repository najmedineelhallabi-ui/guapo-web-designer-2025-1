'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { usePlan } from './PlanContext'
import { Card, btnBrand, btnGhost } from './ui'

/** Link, QR and WhatsApp share for the public event page. */
export default function ShareInvitation() {
  const { album, code } = usePlan()
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => setUrl(`${window.location.origin}/album/${code}/event`), [code])

  const text = `You're invited to ${album.name}! All the details and your answer here: ${url}`
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <Card title="💌 Send your invitation">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="mx-auto shrink-0 rounded-2xl bg-brand p-2 sm:mx-0">
          <div className="rounded-xl bg-white p-2">
            <QRCodeSVG value={url || ' '} size={112} />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-ink-soft">
            Your guests open this page to see the details, add it to their calendar and answer. Share it by WhatsApp, SMS or email.
          </p>
          <p className="mt-2 break-all rounded-xl bg-cream px-3 py-2 font-mono text-xs">{url}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer" className={btnBrand}>
              Send on WhatsApp
            </a>
            <a href={`mailto:?subject=${encodeURIComponent(album.name)}&body=${encodeURIComponent(text)}`} className={btnGhost}>
              Email
            </a>
            <button onClick={copy} className={btnGhost}>
              {copied ? 'Copied ✓' : 'Copy link'}
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
