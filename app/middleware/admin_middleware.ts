import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  /**
   * Handle an incoming HTTP request by verifying the user is authenticated
   * and has admin role
   */
  async handle(ctx: HttpContext, next: NextFn) {
    await ctx.auth.check()

    if (ctx.auth.user?.role !== 'admin') {
      return ctx.response.redirect().toRoute('admin.login')
    }

    return next()
  }
}
