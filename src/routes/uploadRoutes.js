const { Router } = require('express')
const multer = require('multer')
const { uploadFile } = require('../models/db')
const upload = multer({ dest: './public/data/uploads/' })
const uploadRouter = Router()

uploadRouter.get('/', (req, res, next) => {
  res.render('uploadfile', { folderid: req.query.folder, user: req.user })
})

uploadRouter.post('/', upload.single('uploadedfile'), function (req, res) {
  if (
    (req.user.filesUploaded < 5 && req.user.role === 'USER') ||
    req.user.role !== 'USER'
  ) {
    if (req.file.size < 100000000) {
      uploadFile(
        req.query.folder,
        req.file.originalname,
        req.file.path,
        req.file.size,
      )
      res.redirect('/')
    }
  }
})

module.exports = uploadRouter
