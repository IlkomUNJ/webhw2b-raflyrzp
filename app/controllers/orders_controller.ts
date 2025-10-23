import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'

export default class OrdersController {
  public async index({ auth, view }: HttpContext) {
    const user = auth.user!
    const orders = await Order.query().where('userId', user.id).orderBy('createdAt', 'desc')

    return view.render('pages/user/orders/index', {
      title: 'My Orders - ShiftUp',
      orders,
    })
  }

  public async show({ auth, params, view, response }: HttpContext) {
    const user = auth.user!
    const id = Number(params.id)

    const order = await Order.query().where('id', id).preload('items').first()

    if (!order) {
      return response.notFound('Order not found')
    }
    if (order.userId !== user.id) {
      return response.forbidden('Not allowed')
    }

    const computedTotal =
      order.items?.reduce((sum: number, it: any) => sum + Number(it.price) * it.quantity, 0) ??
      order.total

    return view.render('pages/user/orders/show', {
      title: `Order #${order.id} - ShiftUp`,
      order,
      computedTotal,
    })
  }
}
