import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, beforeSave } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import CartItem from '#models/cart_item'
import WishlistItem from '#models/wishlist_item'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare price: number

  @column()
  declare category: string

  @column()
  declare thumbnailImage: string | null

  @column()
  declare demoUrl: string | null

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static ensureSlug(product: Product) {
    if (!product.slug && product.name) {
      product.slug = slugify(product.name)
    }
  }

  @hasMany(() => CartItem)
  declare cartItems: HasMany<typeof CartItem>

  @hasMany(() => WishlistItem)
  declare wishlistItems: HasMany<typeof WishlistItem>
}
