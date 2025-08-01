const { Router } = require('express')
const { createUser } = require('../models/db')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const appRouter = Router()

appRouter.get('/', async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/folder/' + req.user.homeFolderId)
  } else {
    res.render('index', { user: req.user })
  }
})

appRouter.get('/signup', (req, res) => {
  if (req.isUnauthenticated()) {
    res.render('signup')
  } else {
    res.redirect('/')
  }
})

appRouter.post('/signup', async (req, res, next) => {
  const pass = req.body.password
  const pass2 = req.body.passwordconfirm
  if (pass === pass2) {
    try {
      const hashedPassword = await bcrypt.hash(pass, 10)
      await createUser(req.body.username, hashedPassword)
      res.redirect('/')
    } catch (error) {
      next(error)
    }
  } else res.redirect('/signup')
})

appRouter.get('/login', (req, res) => {
  if (req.isUnauthenticated) {
    res.render('login')
  } else {
    res.redirect('/')
  }
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
