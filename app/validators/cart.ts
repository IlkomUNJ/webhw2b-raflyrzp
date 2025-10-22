import vine from '@vinejs/vine'

export const addToCartValidator = vine.compile(
  vine.object({
    product_id: vine.number(),
    quantity: vine.number().min(1).optional(),
  })
)

export const addToWishlistValidator = vine.compile(
  vine.object({
    product_id: vine.number(),
  })
)
