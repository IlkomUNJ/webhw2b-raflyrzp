import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { createProductValidator, updateProductValidator } from '#validators/product'

export default class AdminProductsController {
  async index({ view }: HttpContext) {
    const products = await Product.query().orderBy('createdAt', 'desc')
    return view.render('pages/admin/products/index', {
      title: 'Manage Products - ShiftUp',
      products,
    })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/admin/products/form', {
      title: 'Create Product - ShiftUp',
      product: null,
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createProductValidator)
    await Product.create({
      name: payload.name,
      slug: payload.slug || '',
      description: payload.description ?? null,
      price: payload.price,
      category: payload.category,
      thumbnailImage: payload.thumbnail_image ?? null,
      demoUrl: payload.demo_url ?? null,
      isActive: payload.is_active ?? true,
    })
    session.flash('success', 'Product created')
    return response.redirect().toPath('/admin/products')
  }

  async edit({ params, view, response }: HttpContext) {
    const product = await Product.find(params.id)
    if (!product) return response.notFound('Product not found')
    return view.render('pages/admin/products/form', {
      title: `Edit ${product.name} - ShiftUp`,
      product,
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const product = await Product.find(params.id)
    if (!product) return response.notFound('Product not found')

    const payload = await request.validateUsing(updateProductValidator)

    product.merge({
      name: payload.name,
      slug: payload.slug || product.slug,
      description: payload.description ?? null,
      price: payload.price,
      category: payload.category,
      thumbnailImage: payload.thumbnail_image ?? null,
      demoUrl: payload.demo_url ?? null,
      isActive: payload.is_active ?? product.isActive,
    })
    await product.save()

    session.flash('success', 'Product updated')
    return response.redirect().toPath('/admin/products')
  }

  async destroy({ params, response, session }: HttpContext) {
    const product = await Product.find(params.id)
    if (!product) return response.notFound('Product not found')
    await product.delete()
    session.flash('success', 'Product deleted')
    return response.redirect().toPath('/admin/products')
  }
}
