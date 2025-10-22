/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')

/**
 * Public auth (users)
 */
router
  .group(() => {
    router.get('/register', [AuthController, 'showRegister']).as('auth.register.show')
    router.post('/register', [AuthController, 'register']).as('auth.register')
    router.get('/login', [AuthController, 'showLogin']).as('auth.login.show')
    router.post('/login', [AuthController, 'login']).as('auth.login')
    router.post('/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())
  })
  .prefix('/auth')

/**
 * Admin auth
 */
router
  .group(() => {
    router.get('/login', [AuthController, 'showLoginAdmin']).as('admin.auth.login.show')
    router.post('/login', [AuthController, 'loginAdmin']).as('admin.auth.login')
    router
      .post('/logout', [AuthController, 'logoutAdmin'])
      .as('admin.auth.logout')
      .use(middleware.auth())
  })
  .prefix('/admin/auth')

/**
 * Public pages
 */
router.on('/').render('pages/home').as('home')
router.on('/about').render('pages/about').as('about')
router.on('/case-studies').render('pages/case_studies').as('case_studies')
router.on('/services').render('pages/services').as('services')
router.on('/contact').render('pages/contact').as('contact')

/**
 * User-facing product pages
 */
const ProductsController = () => import('#controllers/products_controller')
router.get('/products', [ProductsController, 'index']).as('products.index')
router.get('/products/:slug', [ProductsController, 'show']).as('products.show')

/**
 * Auth-required features (Cart, Wishlist, Checkout)
 */
router
  .group(() => {
    // Cart
    const CartController = () => import('#controllers/carts_controller')
    router
      .group(() => {
        router.get('/', [CartController, 'index']).as('cart.index')
        router.post('/add', [CartController, 'add']).as('cart.add')
        router.post('/update', [CartController, 'update']).as('cart.update')
        router.post('/remove', [CartController, 'remove']).as('cart.remove')
        router.post('/clear', [CartController, 'clear']).as('cart.clear')
      })
      .prefix('/cart')

    // Wishlist
    const WishlistController = () => import('#controllers/wishlists_controller')
    router
      .group(() => {
        router.get('/', [WishlistController, 'index']).as('wishlist.index')
        router.post('/add', [WishlistController, 'add']).as('wishlist.add')
        router.post('/remove', [WishlistController, 'remove']).as('wishlist.remove')
      })
      .prefix('/wishlist')

    // Checkout
    const CheckoutController = () => import('#controllers/checkouts_controller')
    router
      .group(() => {
        router.get('/', [CheckoutController, 'show']).as('checkout.show')
        router.post('/', [CheckoutController, 'place']).as('checkout.place')
      })
      .prefix('/checkout')
  })
  .use(middleware.auth())

/**
 * Admin manage products
 */
const AdminProductsController = () => import('#controllers/admin/products_controller')
router
  .group(() => {
    router.get('/products', [AdminProductsController, 'index']).as('admin.products.index')
    router.get('/products/create', [AdminProductsController, 'create']).as('admin.products.create')
    router.post('/products', [AdminProductsController, 'store']).as('admin.products.store')
    router.get('/products/:id/edit', [AdminProductsController, 'edit']).as('admin.products.edit')
    router.post('/products/:id', [AdminProductsController, 'update']).as('admin.products.update')
    router
      .post('/products/:id/delete', [AdminProductsController, 'destroy'])
      .as('admin.products.destroy')
  })
  .prefix('/admin')
  .use(middleware.admin())
