import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    slug: vine.string().trim().optional(),
    description: vine.string().nullable().optional(),
    price: vine.number(),
    category: vine.string().trim(),
    thumbnail_image: vine.file({ size: '5mb', extnames: ['jpg', 'jpeg', 'png'] }).optional(),
    demo_url: vine.string().url().nullable().optional(),
    is_active: vine.boolean().optional(),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().optional(),
    slug: vine.string().trim().optional(),
    description: vine.string().nullable().optional(),
    price: vine.number().optional(),
    category: vine.string().trim().optional(),
    thumbnail_image: vine.file({ size: '5mb', extnames: ['jpg', 'jpeg', 'png'] }).optional(),
    demo_url: vine.string().url().nullable().optional(),
    is_active: vine.boolean().optional(),
  })
)
