import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Order from '#models/order'

export default class DashboardAdminController {
  async index({ view }: HttpContext) {
    // Total revenue
    const revenueRow = await db.from('orders').sum({ totalRevenue: 'total' }).first()
    const totalRevenue = Number(revenueRow?.totalRevenue ?? 0)

    // Total orders
    const countRow = await db.from('orders').count('id as totalOrders').first()
    const totalOrders = Number(countRow?.totalOrders ?? 0)

    // Distinct customers
    const customersRow = await db.from('orders').countDistinct('user_id as totalCustomers').first()
    const totalCustomers = Number(customersRow?.totalCustomers ?? 0)

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Revenue by month (SQLite strftime)
    const byMonthRows = await db
      .from('orders')
      .select(db.raw("strftime('%Y-%m', created_at) as ym"))
      .sum({ revenue: 'total' })
      .groupBy('ym')
      .orderBy('ym', 'asc')

    const revenueByMonth = byMonthRows.map((r: any) => ({
      ym: String(r.ym),
      revenue: Number(r.revenue),
    }))
    const maxRevenueMonth = Math.max(1, ...revenueByMonth.map((r) => r.revenue))

    // Top products (best sellers) using order_items
    const topProducts = await db
      .from('order_items as oi')
      .leftJoin('products as p', 'p.id', 'oi.product_id')
      .select('oi.product_id as productId', 'p.name as name')
      .select(db.raw('SUM(oi.quantity) as qty'))
      .select(db.raw('SUM(oi.quantity * oi.price) as revenue'))
      .groupBy('oi.product_id', 'p.name')
      .orderBy('qty', 'desc')
      .limit(5)

    // Recent orders (last 10) with user + items preload
    const recentOrders = await Order.query()
      .orderBy('createdAt', 'desc')
      .preload('user')
      .preload('items')
      .limit(10)

    // Derive item counts per order
    const recent = recentOrders.map((o) => {
      const itemsCount = o.items.reduce((sum, it) => sum + it.quantity, 0)
      return {
        id: o.id,
        createdAt: o.createdAt,
        customer: o.user?.name || '—',
        status: o.status,
        total: Number(o.total),
        itemsCount,
      }
    })

    return view.render('pages/admin/dashboard', {
      title: 'Dashboard - ShiftUp',
      totalRevenue,
      totalOrders,
      totalCustomers,
      avgOrderValue,
      revenueByMonth,
      maxRevenueMonth,
      topProducts: topProducts.map((t: any) => ({
        productId: t.productId,
        name: t.name || 'Unknown',
        qty: Number(t.qty),
        revenue: Number(t.revenue),
      })),
      recentOrders: recent,
    })
  }
}
