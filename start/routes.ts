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

router
  .group(() => {
    router.get('/register', [AuthController, 'showRegister']).as('auth.register')
    router.post('/register', [AuthController, 'register'])
    router.get('/login', [AuthController, 'showLogin']).as('auth.login')
    router.post('/login', [AuthController, 'login'])
    router.post('/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())
  })
  .prefix('/auth')

router
  .group(() => {
    router.get('/login', [AuthController, 'showLoginAdmin']).as('auth.loginAdmin')
    router.post('/login', [AuthController, 'loginAdmin'])
    router
      .post('/logout', [AuthController, 'logoutAdmin'])
      .as('auth.logoutAdmin')
      .use(middleware.auth())
  })
  .prefix('/admin/auth')

router.on('/').render('pages/home')
router.on('/about').render('pages/about')
router.on('/case-studies').render('pages/case_studies')
router.on('/services').render('pages/services')
router.on('/contact').render('pages/contact')
