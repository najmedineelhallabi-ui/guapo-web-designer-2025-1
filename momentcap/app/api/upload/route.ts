import * as service from '@/lib/core/service'
import { AppError } from '@/lib/albumRules'
import { ctxFrom, errorResponse, requireRepo } from '@/lib/server/http'

// Multipart uploads: album photos/videos and cover photos
export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const code = String(form.get('code') || '')
    const target = form.get('target')
    const file = form.get('file')
    const repo = requireRepo()
    const ctx = ctxFrom(request)

    if (target === 'cover') {
      return Response.json(await service.setCover(repo, ctx, code, file instanceof File ? file : null))
    }
    if (!(file instanceof File)) throw new AppError('bad_file', 400)
    const kind = form.get('kind') === 'video' ? 'video' : 'image'
    const meta = JSON.parse(String(form.get('meta') || '{}'))
    return Response.json(await service.addPhoto(repo, ctx, code, file, kind, meta))
  } catch (err) {
    return errorResponse(err)
  }
}
