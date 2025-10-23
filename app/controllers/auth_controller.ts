import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'

export default class AuthController {
  async showLogin({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async login({ request, response, auth, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    if (user.role !== 'user') {
      session.flash('error', 'Invalid credentials')
      return response.redirect().back()
    }

    await auth.use('web').login(user)

    session.flash('success', 'Welcome back!')
    return response.redirect().toRoute('home')
  }

  async showRegister({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async register({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    await User.create({
      ...data,
      role: 'user',
    })

    session.flash('success', 'Registration successful! Please login.')
    return response.redirect().toRoute('auth.login')
  }

  async logout({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', 'Logged out successfully!!')
    return response.redirect().toRoute('home')
  }

  // ADMIN
  async showLoginAdmin({ view }: HttpContext) {
    return view.render('pages/auth/login_admin')
  }

  async loginAdmin({ request, response, auth, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    if (user.role !== 'admin') {
      session.flash('error', 'Access denied. Admin only.')
      return response.redirect().back()
    }

    await auth.use('web').login(user)

    session.flash('success', 'Welcome, Admin!')
    return response.redirect().toRoute('admin.dashboard')
  }

  async logoutAdmin({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', 'Logged out successfully')
    return response.redirect().toRoute('admin.login')
  }
}
