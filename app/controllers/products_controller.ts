import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class ProductsController {
  async index({ view, request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = 9
    const products = await Product.query()
      .where('isActive', true)
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
    products.baseUrl('/templates')

    return view.render('pages/products/index', {
      title: 'Templates - ShiftUp',
      products,
    })
  }

  async show({ params, view, response }: HttpContext) {
    const product = await Product.query().where('slug', params.slug).first()
    if (!product) return response.notFound('Product not found')

    return view.render('pages/products/show', {
      title: `${product.name} - ShiftUp`,
      product,
    })
  }
}
