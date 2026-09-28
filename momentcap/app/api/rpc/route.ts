import * as service from '@/lib/core/service'
import * as planService from '@/lib/core/planService'
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

// Payments are simulated until Stripe is connected
const demoPayments = () => process.env.MOMENTCAP_DEMO_PAYMENTS === '1'

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
  purchasePack: withRepo((repo, ctx, code, pack) => service.purchasePack(repo, ctx, code, pack, demoPayments())),
  getAccount: withRepo((repo, ctx) => service.getAccount(repo, ctx)),
  subscribe: withRepo((repo, ctx, plan, billing) => service.subscribe(repo, ctx, plan, billing, demoPayments())),
  addTeamMember: withRepo((repo, ctx, email) => service.addTeamMember(repo, ctx, email)),
  removeTeamMember: withRepo((repo, ctx, email) => service.removeTeamMember(repo, ctx, email)),
  cancelSubscription: withRepo((repo, ctx) => service.cancelSubscription(repo, ctx)),
  resumeSubscription: withRepo((repo, ctx) => service.resumeSubscription(repo, ctx)),
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

  // Event preparation
  getPlan: withRepo((repo, ctx, code) => planService.getPlan(repo, ctx, code)),
  updateEvent: withRepo((repo, ctx, code, patch) => planService.updateEvent(repo, ctx, code, patch || {})),
  programToMoments: withRepo((repo, ctx, code) => planService.programToMoments(repo, ctx, code)),
  savePlanItem: withRepo((repo, ctx, code, section, item) => planService.savePlanItem(repo, ctx, code, section, item || {})),
  deletePlanItem: withRepo((repo, ctx, code, section, id) => planService.deletePlanItem(repo, ctx, code, section, id)),
  importGuests: withRepo((repo, ctx, code, rows) => planService.importGuests(repo, ctx, code, rows)),
  setBudgetTotal: withRepo((repo, ctx, code, total) => planService.setBudgetTotal(repo, ctx, code, total)),
  seedChecklist: withRepo((repo, ctx, code) => planService.seedChecklist(repo, ctx, code)),
  ensureInviteKeys: withRepo((repo, ctx, code) => planService.ensureInviteKeys(repo, ctx, code)),
  markInvited: withRepo((repo, ctx, code, ids) => planService.markInvited(repo, ctx, code, ids)),
  getEventPage: withRepo((repo, ctx, code, key) => planService.getEventPage(repo, ctx, code, key)),
  submitRsvp: withRepo((repo, ctx, code, input, key) => planService.submitRsvp(repo, ctx, code, input || {}, key)),
  findTable: withRepo((repo, ctx, code, query) => planService.findTable(repo, ctx, code, query)),

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
