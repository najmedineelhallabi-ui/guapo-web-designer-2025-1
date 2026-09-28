// Tiny CSV helpers (comma or semicolon separated, quoted fields supported).

export function parseCsv(text: string): string[][] {
  const firstLine = text.split(/\r?\n/, 1)[0] || ''
  const sep = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ';' : firstLine.includes('\t') ? '\t' : ','
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === sep) {
      row.push(field.trim())
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field.trim())
      if (row.some((f) => f)) rows.push(row)
      row = []
      field = ''
    } else field += c
  }
  row.push(field.trim())
  if (row.some((f) => f)) rows.push(row)
  return rows
}

export function toCsv(rows: (string | number)[][]) {
  const cell = (v: string | number) => {
    const s = String(v ?? '')
    return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  // BOM so Excel opens accents correctly
  return '﻿' + rows.map((r) => r.map(cell).join(';')).join('\r\n')
}

export function downloadText(text: string, filename: string, type = 'text/csv;charset=utf-8') {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type }))
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}
