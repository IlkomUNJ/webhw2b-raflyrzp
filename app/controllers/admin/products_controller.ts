import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { createProductValidator, updateProductValidator } from '#validators/product'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import { mkdir, unlink } from 'node:fs/promises'

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

    const file = request.file('thumbnail_image')
    let thumbnailUrl: string | null = null
    if (file) {
      const uploadDir = app.makePath('public/uploads/thumbnails')
      await mkdir(uploadDir, { recursive: true })
      const fileName = `${cuid()}.${file.extname}`
      await file.move(uploadDir, { name: fileName, overwrite: false })
      thumbnailUrl = `/uploads/thumbnails/${fileName}`
    }

    await Product.create({
      name: payload.name,
      slug: payload.slug || '',
      description: payload.description ?? null,
      price: payload.price,
      category: payload.category,
      thumbnailImage: thumbnailUrl,
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

    const file = request.file('thumbnail_image')
    if (file) {
      const uploadDir = app.makePath('public/uploads/thumbnails')
      await mkdir(uploadDir, { recursive: true })
      const fileName = `${cuid()}.${file.extname}`
      await file.move(uploadDir, { name: fileName, overwrite: false })
      const newUrl = `/uploads/thumbnails/${fileName}`

      const oldUrl = product.thumbnailImage
      if (oldUrl && oldUrl.startsWith('/uploads/thumbnails/')) {
        try {
          await unlink(app.makePath('public', oldUrl))
        } catch {}
      }
      product.thumbnailImage = newUrl
    }

    const updates: Partial<Product> = {}
    if (payload.name !== undefined) updates.name = payload.name
    if (payload.slug !== undefined) updates.slug = payload.slug || product.slug
    if (payload.description !== undefined) updates.description = payload.description ?? null
    if (payload.price !== undefined) updates.price = payload.price as any
    if (payload.category !== undefined) updates.category = payload.category
    if (payload.demo_url !== undefined) updates.demoUrl = payload.demo_url ?? null
    if (payload.is_active !== undefined) updates.isActive = payload.is_active

    product.merge(updates)
    await product.save()

    session.flash('success', 'Product updated')
    return response.redirect().toPath('/admin/products')
  }

  async destroy({ params, response, session }: HttpContext) {
    const product = await Product.find(params.id)
    if (!product) return response.notFound('Product not found')

    const oldUrl = product.thumbnailImage
    if (oldUrl && oldUrl.startsWith('/uploads/thumbnails/')) {
      try {
        await unlink(app.makePath('public', oldUrl))
      } catch {}
    }

    await product.delete()
    session.flash('success', 'Product deleted')
    return response.redirect().toPath('/admin/products')
  }
}
