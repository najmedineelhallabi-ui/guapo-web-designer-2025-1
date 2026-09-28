import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { sign } from '@/lib/server/auth'
import { ctxFrom, errorResponse } from '@/lib/server/http'
import { MAX_VIDEO_MB } from '@/lib/albumRules'

// Issues short-lived Blob upload tokens for paths reserved by prepareDirectUpload
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody
    const guestId = ctxFrom(request).guestId || ''
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const { ticket } = JSON.parse(clientPayload || '{}')
        if (!ticket || ticket !== sign(`upload:${pathname}:${guestId}`)) throw new Error('Upload not allowed')
        return {
          allowedContentTypes: ['video/*', 'image/*'],
          maximumSizeInBytes: MAX_VIDEO_MB * 1024 * 1024,
          addRandomSuffix: false
        }
      }
    })
    return Response.json(result)
  } catch (err) {
    return errorResponse(err)
  }
}
