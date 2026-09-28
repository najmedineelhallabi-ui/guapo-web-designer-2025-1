import * as service from '@/lib/core/service'
import { AppError } from '@/lib/albumRules'
import { createToken, sign } from '@/lib/server/auth'
import { getStorage } from '@/lib/server/storage'
import { ctxFrom, errorResponse, requireRepo } from '@/lib/server/http'

// One endpoint for every JSON action; the service enforces all permissions.
type Handler = (args: any[], ctx: service.Ctx) => Promise<unknown>

const withRepo =
  (fn: (repo: ReturnType<typeof requireRepo>, ctx: service.Ctx, ...args: any[]) => Promise<unknown>): Handler =>
  (args, ctx) =>
    fn(requireRepo(), ctx, ...args)

const ticketFor = (path: string, guestId: string) => sign(`upload:${path}:${guestId}`)

const methods: Record<string, Handler> = {
  async signUp([input]) {
    const user = await service.signUp(requireRepo(), input || {})
    return { user, token: createToken(user) }
  },
  async signIn([input]) {
    const user = await service.signIn(requireRepo(), input || {})
    return { user, token: createToken(user) }
  },
  listAlbums: withRepo((repo, ctx) => service.listAlbums(repo, ctx)),
  createAlbum: withRepo((repo, ctx, input) => service.createAlbum(repo, ctx, input || {})),
  getAlbum: withRepo((repo, ctx, code) => service.getAlbum(repo, ctx, code)),
  updateAlbum: withRepo((repo, ctx, code, patch) => service.updateAlbum(repo, ctx, code, patch || {})),
  deleteAlbum: withRepo((repo, ctx, code) => service.deleteAlbum(repo, ctx, code)),
  upgradeAlbum: withRepo((repo, ctx, code) =>
    service.upgradeAlbum(repo, ctx, code, process.env.MOMENTCAP_DEMO_PAYMENTS === '1')
  ),
  addCoOrganizer: withRepo((repo, ctx, code, email) => service.addCoOrganizer(repo, ctx, code, email)),
  removeCoOrganizer: withRepo((repo, ctx, code, email) => service.removeCoOrganizer(repo, ctx, code, email)),
  deletePhoto: withRepo((repo, ctx, code, id) => service.deletePhoto(repo, ctx, code, id)),
  moderatePhoto: withRepo((repo, ctx, code, id, approve) => service.moderatePhoto(repo, ctx, code, id, Boolean(approve))),
  approveAll: withRepo((repo, ctx, code) => service.approveAllPhotos(repo, ctx, code)),
  toggleFavorite: withRepo((repo, ctx, code, id) => service.toggleFavorite(repo, ctx, code, id)),
  react: withRepo((repo, ctx, code, id, reaction) => service.react(repo, ctx, code, id, reaction)),
  addGuestbookEntry: withRepo((repo, ctx, code, input) => service.addGuestbookEntry(repo, ctx, code, input || {})),
  moderateGuestbookEntry: withRepo((repo, ctx, code, id, approve) =>
    service.moderateGuestbookEntry(repo, ctx, code, id, Boolean(approve))
  ),

  // Large files (videos) go straight from the browser to Blob storage:
  // 1. prepareDirectUpload checks the rules and reserves a path
  // 2. the browser uploads to that path (see /api/upload/token)
  // 3. registerDirectUpload records it in the album
  prepareDirectUpload: withRepo(async (repo, ctx, code, kind, size, meta) => {
    const { guestId, path } = await service.prepareUpload(repo, ctx, code, kind === 'video' ? 'video' : 'image', Number(size) || 0, meta || {})
    return { path, ticket: ticketFor(path, guestId) }
  }),
  registerDirectUpload: withRepo(async (repo, ctx, code, path, ticket, kind, meta) => {
    const k = kind === 'video' ? 'video' : 'image'
    const guestId = ctx.guestId || ''
    if (typeof path !== 'string' || ticket !== ticketFor(path, guestId)) throw new AppError('forbidden', 403)
    const size = await getStorage()!.size(path)
    if (size === null) throw new AppError('bad_file', 400)
    const prepared = await service.prepareUpload(repo, ctx, code, k, size, meta || {})
    if (!path.startsWith(`albums/${prepared.album.qr_code}/media/`)) throw new AppError('forbidden', 403)
    return service.registerPhoto(repo, ctx, prepared.album, prepared.guestId, path, k, meta || {})
  })
}

export async function POST(request: Request) {
  try {
    const { method, args } = await request.json().catch(() => ({}))
    const handler = typeof method === 'string' && Object.hasOwn(methods, method) ? methods[method] : null
    if (!handler) throw new AppError('invalid_input', 400)
    const result = await handler(Array.isArray(args) ? args : [], ctxFrom(request))
    return Response.json(result ?? { ok: true })
  } catch (err) {
    return errorResponse(err)
  }
}
