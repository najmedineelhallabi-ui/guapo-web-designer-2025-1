'use client'

import { jsPDF } from 'jspdf'
import type { AppAlbum, AppPhoto } from './albumRules'
import { formatEventDate } from './dates'

const MAX_PHOTOS = 150

// Built-in PDF fonts can't draw emoji and other symbols
const pdfText = (s: string) => s.replace(/[^\p{L}\p{N}\p{P}\p{Zs}+=<>|~^$€£]/gu, '').trim()

async function loadAsJpeg(url: string): Promise<{ data: string; w: number; h: number } | null> {
  try {
    const blob = await (await fetch(url)).blob()
    const objectUrl = URL.createObjectURL(blob)
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = reject
      i.src = objectUrl
    })
    // Re-encode at a print-friendly size to keep the PDF small
    const scale = Math.min(1, 1600 / Math.max(img.width, img.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.width * scale)
    canvas.height = Math.round(img.height * scale)
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
    URL.revokeObjectURL(objectUrl)
    return { data: canvas.toDataURL('image/jpeg', 0.82), w: canvas.width, h: canvas.height }
  } catch {
    return null
  }
}

/** Builds a simple photo book: a title page, then one photo per page with its author. */
export async function downloadPdfBook(album: AppAlbum, photos: AppPhoto[]) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const M = 16

  // Title page
  doc.setFillColor(255, 215, 0)
  doc.rect(0, 0, W, H, 'F')
  if (album.cover_url) {
    const cover = await loadAsJpeg(album.cover_url)
    if (cover) {
      const w = W - M * 2
      const h = Math.min((w * cover.h) / cover.w, H * 0.45)
      doc.addImage(cover.data, 'JPEG', M, M, w, h, undefined, 'FAST')
    }
  }
  doc.setTextColor(23, 21, 15)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(30)
  doc.text(doc.splitTextToSize(pdfText(album.name), W - M * 2), W / 2, H * 0.62, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(13)
  doc.text(pdfText([formatEventDate(album.event_date), album.location].filter(Boolean).join(' · ')), W / 2, H * 0.62 + 16, { align: 'center' })
  if (album.welcome_message) {
    doc.setFontSize(12)
    doc.text(doc.splitTextToSize(pdfText(album.welcome_message), W - M * 4), W / 2, H * 0.62 + 30, { align: 'center' })
  }
  doc.setFontSize(9)
  doc.text('Made with MomentCap', W / 2, H - 10, { align: 'center' })

  // Photo pages
  for (const photo of photos.filter((p) => p.kind === 'image').slice(0, MAX_PHOTOS)) {
    const img = await loadAsJpeg(photo.url)
    if (!img) continue
    doc.addPage()
    const maxW = W - M * 2
    const maxH = H - M * 2 - 14
    const ratio = Math.min(maxW / img.w, maxH / img.h)
    const w = img.w * ratio
    const h = img.h * ratio
    doc.addImage(img.data, 'JPEG', (W - w) / 2, M + (maxH - h) / 2, w, h, undefined, 'FAST')
    doc.setFontSize(10)
    doc.setTextColor(91, 87, 72)
    const when = new Date(photo.created_at).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    doc.text(pdfText(`${photo.contributor_name} · ${when}`), W / 2, H - M, { align: 'center' })
  }

  doc.save(`${album.name.replace(/[^\w-]+/g, '_') || 'album'}-book.pdf`)
}
