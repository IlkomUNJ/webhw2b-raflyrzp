import type { HttpContext } from '@adonisjs/core/http'
import WishlistItem from '#models/wishlist_item'
import Product from '#models/product'
import { addToWishlistValidator } from '#validators/cart'

export default class WishlistsController {
  async index({ auth, view }: HttpContext) {
    const user = auth.user!
    const items = await WishlistItem.query().where('userId', user.id).preload('product')
    return view.render('pages/user/wishlist/index', { title: 'Your Wishlist - ShiftUp', items })
  }

  async add({ auth, request, response, session }: HttpContext) {
    const user = auth.user!
    const { product_id: productId } = await request.validateUsing(addToWishlistValidator)

    const product = await Product.find(productId)
    if (!product || !product.isActive) {
      session.flash('errors', { form: ['Product not available'] })
      return response.redirect().back()
    }

    await WishlistItem.firstOrCreate({
      userId: user.id,
      productId: product.id,
    })

    session.flash('success', 'Added to wishlist')
    return response.redirect().back()
  }

  async remove({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const id = Number(request.input('id'))
    const item = await WishlistItem.query().where('id', id).andWhere('userId', user.id).first()
    if (item) await item.delete()
    return response.redirect().back()
  }
}
