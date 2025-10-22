import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

import User from '#models/user'
import Product from '#models/product'
import CartItem from '#models/cart_item'
import WishlistItem from '#models/wishlist_item'
import Order from '#models/order'
import OrderItem from '#models/order_item'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    await db.from('order_items').delete()
    await db.from('orders').delete()
    await db.from('cart_items').delete()
    await db.from('wishlist_items').delete()
    await db.from('products').delete()
    await db.from('users').delete()

    // 1) Users
    const [john, jane] = await User.createMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password',
      },
    ])

    // 2) Products (Templates)
    const products = await Product.createMany([
      {
        name: 'Agency Portfolio',
        description:
          'A modern agency portfolio template with smooth animations and sections for services, works, and contact.',
        price: 500000,
        category: 'Portfolio',
        thumbnailImage: 'https://picsum.photos/seed/agency/800/450',
        demoUrl: 'https://example.com/demos/agency',
        isActive: true,
      },
      {
        name: 'SaaS Landing',
        description: 'SaaS-focused landing page featuring hero, pricing, FAQ, and testimonials.',
        price: 750000,
        category: 'Landing',
        thumbnailImage: 'https://picsum.photos/seed/saas/800/450',
        demoUrl: 'https://example.com/demos/saas',
        isActive: true,
      },
      {
        name: 'E-Commerce Storefront',
        description: 'Clean e-commerce storefront with product grid, filters, and cart preview.',
        price: 1000000,
        category: 'E-Commerce',
        thumbnailImage: 'https://picsum.photos/seed/store/800/450',
        demoUrl: 'https://example.com/demos/store',
        isActive: true,
      },
      {
        name: 'Restaurant & Cafe',
        description:
          'Elegant food & beverage template with menu sections, reservations, and gallery.',
        price: 450000,
        category: 'Business',
        thumbnailImage: 'https://picsum.photos/seed/restaurant/800/450',
        demoUrl: 'https://example.com/demos/restaurant',
        isActive: true,
      },
      {
        name: 'Personal Blog',
        description: 'Minimal blog template with categories, tags, and article details.',
        price: 350000,
        category: 'Blog',
        thumbnailImage: 'https://picsum.photos/seed/blog/800/450',
        demoUrl: 'https://example.com/demos/blog',
        isActive: true,
      },
      {
        name: 'Startup Starter',
        description: 'Launch-ready startup site featuring problem/solution, traction, and pricing.',
        price: 650000,
        category: 'Landing',
        thumbnailImage: 'https://picsum.photos/seed/startup/800/450',
        demoUrl: 'https://example.com/demos/startup',
        isActive: true,
      },
    ])

    const productA = products[0]!
    const productB = products[1]!
    const productC = products[2]!

    // 3) Cart Items untuk John
    await CartItem.createMany([
      {
        userId: john.id,
        productId: productA.id,
        quantity: 1,
      },
      {
        userId: john.id,
        productId: productB.id,
        quantity: 2,
      },
    ])

    // 4) Wishlist Items untuk John
    await WishlistItem.createMany([
      { userId: john.id, productId: productC.id },
      { userId: john.id, productId: productA.id },
    ])

    // 5) Order + Order Items (contoh pembelian selesai untuk John)
    const orderTotal = Number(productA.price) * 1 + Number(productB.price) * 2

    const order = await Order.create({
      userId: john.id,
      status: 'paid',
      total: orderTotal,
    })

    await OrderItem.createMany([
      {
        orderId: order.id,
        productId: productA.id,
        name: productA.name,
        price: Number(productA.price),
        quantity: 1,
      },
      {
        orderId: order.id,
        productId: productB.id,
        name: productB.name,
        price: Number(productB.price),
        quantity: 2,
      },
    ])

    // 6) (Opsional) Keranjang Jane kosong, tapi tambahkan wishlist contoh
    await WishlistItem.create({
      userId: jane.id,
      productId: productB.id,
    })

    console.log('Seed completed: users, products, cart, wishlist, orders, order_items')
  }
}
