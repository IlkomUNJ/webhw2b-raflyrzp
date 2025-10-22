import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3),
    slug: vine.string().optional(),
    description: vine.string().nullable().optional(),
    price: vine.number().min(0),
    category: vine.string(),
    thumbnail_image: vine.string().url().nullable().optional(),
    demo_url: vine.string().url().nullable().optional(),
    is_active: vine.boolean().optional(),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3),
    slug: vine.string().optional(),
    description: vine.string().nullable().optional(),
    price: vine.number().min(0),
    category: vine.string(),
    thumbnail_image: vine.string().url().nullable().optional(),
    demo_url: vine.string().url().nullable().optional(),
    is_active: vine.boolean().optional(),
  })
)
