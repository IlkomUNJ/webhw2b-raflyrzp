import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class ProductsController {
  async index({ view, request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = 9
    const q = (request.input('q') || '').trim()

    const query = Product.query().where('isActive', true)

    if (q) {
      query.whereRaw('LOWER(name) LIKE ? OR LOWER(description) LIKE ?', [
        `%${q.toLowerCase()}%`,
        `%${q.toLowerCase()}%`,
      ])
    }

    const products = await query.orderBy('createdAt', 'desc').paginate(page, limit)

    products.baseUrl('/templates')
    if ('queryString' in products && typeof products.queryString === 'function') {
      products.queryString({ q })
    }

    const meta = products.getMeta()

    return view.render('pages/user/products/index', {
      title: 'Templates - ShiftUp',
      products,
      meta,
      q,
    })
  }

  async show({ params, view, response }: HttpContext) {
    const product = await Product.query().where('slug', params.slug).first()
    if (!product) return response.notFound('Product not found')

    return view.render('pages/user/products/show', {
      title: `${product.name} - ShiftUp`,
      product,
    })
  }
}
