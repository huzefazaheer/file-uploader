const { Router } = require('express')
const { createFolder } = require('../models/db')
const createRouter = Router()

createRouter.get('/', (req, res, next) => {
  res.render('newfolder', { folder: req.query.folder, user: req.user })
})

createRouter.post('/', async (req, res) => {
  await createFolder(req.query.folder, req.body.foldername)
  const redirecturl = '/folder/' + req.query.folder
  res.redirect(redirecturl)
})

module.exports = createRouter
