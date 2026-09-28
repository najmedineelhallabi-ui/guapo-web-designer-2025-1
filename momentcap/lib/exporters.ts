'use client'

import type { AppAlbum, AppPhoto } from './albumRules'

const safe = (s: string) => s.replace(/[^\w-]+/g, '_').replace(/^_+|_+$/g, '') || 'album'

function saveBlob(blob: Blob, filename: string) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

/** Downloads photos and videos as a ZIP file. */
export async function downloadZip(album: Pick<AppAlbum, 'name'>, photos: AppPhoto[], suffix = '') {
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()
  await Promise.all(
    photos.map(async (p, i) => {
      const blob = await (await fetch(p.url)).blob()
      const ext = p.kind === 'video' ? (blob.type.includes('quicktime') ? 'mov' : 'mp4') : 'jpg'
      zip.file(`${String(i + 1).padStart(3, '0')}-${safe(p.contributor_name)}.${ext}`, blob)
    })
  )
  saveBlob(await zip.generateAsync({ type: 'blob' }), `${safe(album.name)}${suffix}.zip`)
}
