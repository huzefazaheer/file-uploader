const { Router } = require('express')
const { createUser } = require('../models/db')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const appRouter = Router()

appRouter.get('/', (req, res) => {
  res.render('index', { user: req.user })
})

appRouter.get('/signup', (req, res) => {
  res.render('signup')
})

appRouter.post('/signup', async (req, res, next) => {
  const pass = req.body.password
  const pass2 = req.body.passwordconfirm
  if (pass === pass2) {
    try {
      const hashedPassword = await bcrypt.hash(pass, 10)
      await createUser(req.body.username, hashedPassword)
    } catch (error) {
      next(error)
    }
  } else res.redirect('/signup')
})

appRouter.get('/login', (req, res) => {
  res.render('login')
})

appRouter.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }),
)

appRouter.get('/logout', (req, res, next) => {
  req.logOut((err) => {
    if (err) next(err)
    res.redirect('/')
  })
})

module.exports = appRouter
