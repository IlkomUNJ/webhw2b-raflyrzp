import type { HttpContext } from '@adonisjs/core/http'
import CartItem from '#models/cart_item'
import Product from '#models/product'
import { addToCartValidator } from '#validators/cart'

export default class CartsController {
  async index({ auth, view }: HttpContext) {
    const user = auth.user!
    const items = await CartItem.query().where('userId', user.id).preload('product')
    const subtotal = items.reduce((sum, it) => sum + Number(it.product.price) * it.quantity, 0)

    return view.render('cart/index', {
      title: 'Your Cart - ShiftUp',
      items,
      subtotal,
    })
  }

  async add({ auth, request, response, session }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(addToCartValidator)

    const product = await Product.find(payload.product_id)
    if (!product || !product.isActive) {
      session.flash('errors', { form: ['Product not available'] })
      return response.redirect().back()
    }

    const existing = await CartItem.query()
      .where('userId', user.id)
      .andWhere('productId', product.id)
      .first()

    const qty = payload.quantity ?? 1

    if (existing) {
      existing.quantity = existing.quantity + qty
      await existing.save()
    } else {
      await CartItem.create({
        userId: user.id,
        productId: product.id,
        quantity: qty,
      })
    }

    session.flash('success', 'Added to cart')
    return response.redirect().back()
  }

  async update({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const id = Number(request.input('id'))
    const quantity = Math.max(1, Number(request.input('quantity', 1)))
    const item = await CartItem.query().where('id', id).andWhere('userId', user.id).firstOrFail()
    item.quantity = quantity
    await item.save()
    return response.redirect().back()
  }

  async remove({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const id = Number(request.input('id'))
    const item = await CartItem.query().where('id', id).andWhere('userId', user.id).first()
    if (item) await item.delete()
    return response.redirect().back()
  }

  async clear({ auth, response }: HttpContext) {
    const user = auth.user!
    await CartItem.query().where('userId', user.id).delete()
    return response.redirect().back()
  }
}
