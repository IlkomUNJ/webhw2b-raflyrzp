import type { HttpContext } from '@adonisjs/core/http'

export default class ShareGobalsMiddleware {
  public async handle(ctx: HttpContext, next: () => Promise<void>) {
    try {
      await ctx.auth.use('web').check()
    } catch {}

    const user = ctx.auth.use('web').user ?? null
    const cartCount = Number(ctx.session?.get('cart_count') ?? 0)

    ctx.logger.debug({ isAuthenticated: ctx.auth?.isAuthenticated, user: !!user }, 'share_gobals')

    ctx.view.share({ user, cartCount })

    await next()
  }
}
