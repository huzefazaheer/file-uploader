const { Router } = require('express')
const {
  createUser,
  getUserFolder,
  createFolder,
  getFile,
  deleteFile,
  deleteFolder,
} = require('../models/db')
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

appRouter.get('/folder/:id', async (req, res) => {
  const currFolder = await getUserFolder(req.params.id)
  console.log(currFolder)
  res.render('folderview', { user: req.user, folder: currFolder })
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

appRouter.get('/create', (req, res, next) => {
  res.render('newfolder', { folder: req.query.folder, user: req.user })
})

appRouter.post('/create', async (req, res) => {
  console.log('Q')
  await createFolder(req.query.folder, req.body.foldername)
  const redirecturl = '/folder/' + req.query.folder
  res.redirect(redirecturl)
})

appRouter.get('/file/:id', async (req, res) => {
  const file = await getFile(req.params.id)
  res.render('fileview', { file: file, user: req.user })
})

appRouter.get('/file/delete/:id', async (req, res) => {
  await deleteFile(req.params.id)
  res.redirect('/')
})

appRouter.get('/folder/delete/:id', async (req, res) => {
  if (req.user.homeFolderId !== req.params.id) {
    await deleteFolder(req.params.id)
  }
  res.redirect('/')
})

appRouter.get('/file/download/:id', async (req, res) => {
  const file = await getFile(req.params.id)
  res.download(file.url)
})

module.exports = appRouter
