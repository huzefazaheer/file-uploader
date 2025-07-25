const { Router } = require('express')
const { getUserFolder, deleteFolder } = require('../models/db')
const folderRouter = Router()

folderRouter.get('/:id', async (req, res) => {
  const currFolder = await getUserFolder(req.params.id)
  res.render('folderview', { user: req.user, folder: currFolder })
})

folderRouter.get('/delete/:id', async (req, res) => {
  if (req.user.homeFolderId !== req.params.id) {
    await deleteFolder(req.params.id)
  }
  res.redirect('/')
})

module.exports = folderRouter
