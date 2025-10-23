import type { HttpContext } from '@adonisjs/core/http'
import CartItem from '#models/cart_item'
import Order from '#models/order'
import OrderItem from '#models/order_item'

export default class CheckoutsController {
  async show({ auth, view, response }: HttpContext) {
    const user = auth.user!
    const items = await CartItem.query().where('userId', user.id).preload('product')
    if (items.length === 0) {
      return response.redirect().toPath('/cart')
    }
    const total = items.reduce((sum, it) => sum + Number(it.product.price) * it.quantity, 0)
    return view.render('pages/user/checkout/index', { title: 'Checkout - ShiftUp', items, total })
  }

  async place({ auth, response }: HttpContext) {
    const user = auth.user!
    const items = await CartItem.query().where('userId', user.id).preload('product')
    if (items.length === 0) return response.redirect().toPath('/cart')

    const total = items.reduce((sum, it) => sum + Number(it.product.price) * it.quantity, 0)

    const order = await Order.create({
      userId: user.id,
      status: 'paid',
      total,
    })

    await Promise.all(
      items.map((it) =>
        OrderItem.create({
          orderId: order.id,
          productId: it.productId,
          name: it.product.name,
          price: Number(it.product.price),
          quantity: it.quantity,
        })
      )
    )

    await CartItem.query().where('userId', user.id).delete()

    // Gunakan named route supaya stabil
    return response.redirect().toRoute('orders.show', { id: order.id })
  }
}
