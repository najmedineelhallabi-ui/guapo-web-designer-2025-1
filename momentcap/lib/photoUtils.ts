'use client'

import type { FrameId } from './albumRules'

const MAX_SIDE = 1920

function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read this image'))
    }
    img.src = url
  })
}

let logoPromise: Promise<HTMLImageElement | null> | null = null

/** The transparent "Moment caps" wordmark used as watermark (loaded once). */
function watermarkLogo() {
  logoPromise ??= fetch('/brand/wordmark.png')
    .then((r) => (r.ok ? r.blob() : Promise.reject()))
    .then(loadImage)
    .catch(() => null)
  return logoPromise
}

export type ProcessOptions = {
  frame: FrameId
  frameColor: string
  albumName: string
  watermark: boolean
}

/**
 * Resizes a photo, draws the chosen frame and (for free albums) the watermark.
 * Formats the browser can't decode (e.g. some HEIC) are returned untouched.
 */
export async function processImage(file: File, opts: ProcessOptions): Promise<File> {
  let img: HTMLImageElement
  try {
    img = await loadImage(file)
  } catch {
    return file
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height))
  const w = Math.round(img.width * scale)
  const h = Math.round(img.height * scale)

  // Frame geometry
  const unit = Math.round(Math.min(w, h) * 0.04)
  const pad =
    opts.frame === 'polaroid'
      ? { top: unit, side: unit, bottom: unit * 5 }
      : opts.frame === 'event'
        ? { top: unit * 1.5, side: unit * 1.5, bottom: unit * 4 }
        : { top: 0, side: 0, bottom: 0 }

  const canvas = document.createElement('canvas')
  canvas.width = w + pad.side * 2
  canvas.height = h + pad.top + pad.bottom
  const ctx = canvas.getContext('2d')
  if (!ctx) return file

  if (opts.frame !== 'none') {
    ctx.fillStyle = opts.frame === 'polaroid' ? '#ffffff' : opts.frameColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(img, pad.side, pad.top, w, h)

  if (opts.frame !== 'none' && opts.albumName) {
    const size = Math.round(pad.bottom * (opts.frame === 'polaroid' ? 0.32 : 0.38))
    ctx.font = `700 ${size}px ui-sans-serif, system-ui, sans-serif`
    ctx.fillStyle = '#17150f'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const text = opts.albumName.length > 40 ? opts.albumName.slice(0, 39) + '…' : opts.albumName
    ctx.fillText(text, canvas.width / 2, h + pad.top + pad.bottom / 2, canvas.width - pad.side * 4)
  }

  if (opts.watermark) {
    const logo = await watermarkLogo()
    const margin = Math.round(Math.min(w, h) * 0.03)
    if (logo) {
      // "Moment caps" bubble logo in the bottom-right corner
      const lw = Math.round(Math.max(120, w * 0.24))
      const lh = Math.round((lw * logo.height) / logo.width)
      ctx.save()
      ctx.globalAlpha = 0.92
      ctx.shadowColor = 'rgba(0,0,0,0.35)'
      ctx.shadowBlur = Math.round(lw / 40)
      ctx.drawImage(logo, pad.side + w - lw - margin, pad.top + h - lh - margin, lw, lh)
      ctx.restore()
    } else {
      const size = Math.max(14, Math.round(w / 40))
      ctx.font = `800 ${size}px ui-sans-serif, system-ui, sans-serif`
      ctx.textAlign = 'right'
      ctx.textBaseline = 'bottom'
      ctx.lineWidth = Math.max(2, size / 6)
      ctx.strokeStyle = 'rgba(0,0,0,0.6)'
      ctx.fillStyle = '#ffffff'
      const x = pad.side + w - margin
      const y = pad.top + h - margin
      ctx.strokeText('Moment caps', x, y)
      ctx.fillText('Moment caps', x, y)
    }
  }

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85))
  return blob ? new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }) : file
}

/** Duration of a video file in seconds (null if the browser can't read it). */
export function videoDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      resolve(Number.isFinite(video.duration) ? video.duration : null)
    }
    video.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    video.src = url
  })
}
