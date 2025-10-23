import type { HttpContext } from '@adonisjs/core/http'
import WishlistItem from '#models/wishlist_item'

export default class AdminWishlistsController {
  async index({ request, view }: HttpContext) {
    const page = Number(request.input('page', 1))
    const perPageRaw = Number(request.input('per_page', 20))
    const perPage = Math.min(perPageRaw > 0 ? perPageRaw : 20, 100)

    const q: string = (request.input('q') || '').trim()
    const productId = request.input('product_id')
    const userId = request.input('user_id')

    const query = WishlistItem.query()
      .preload('product')
      .preload('user')
      .orderBy('createdAt', 'desc')
      .if(productId, (qb) => qb.where('productId', productId))
      .if(userId, (qb) => qb.where('userId', userId))

    if (q) {
      query.where((qb) => {
        qb.whereHas('product', (p) => p.whereILike('name', `%${q}%`)).orWhereHas('user', (u) =>
          u.whereILike('email', `%${q}%`).orWhereILike('name', `%${q}%`)
        )
      })
    }

    const paginator = await query.paginate(page, perPage)
    paginator.baseUrl(request.url()).queryString(request.qs())

    const { data, meta } = paginator.toJSON()

    return view.render('pages/admin/wishlist/index', {
      title: 'All Wishlists - ShiftUp',
      items: data,
      meta,
      filters: {
        q,
        productId: productId || '',
        userId: userId || '',
        perPage,
      },
    })
  }
}
