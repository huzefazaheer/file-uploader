const { Router } = require('express')
const multer = require('multer')
const { uploadFile, supabase, incrementUpload } = require('../models/db')
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
})
const uploadRouter = Router()

uploadRouter.get('/', (req, res, next) => {
  res.render('uploadfile', { folderid: req.query.folder, user: req.user })
})

uploadRouter.post(
  '/',
  upload.single('uploadedfile'),
  async function (req, res) {
    if (
      (req.user.filesUploaded < 5 && req.user.role === 'USER') ||
      req.user.role !== 'USER'
    ) {
      if (req.file.size < 100000000) {
        const filePath = crypto.randomUUID()
        const { data, error } = await supabase.storage
          .from('data')
          .upload(filePath, req.file)
        uploadFile(
          req.query.folder,
          req.file.originalname,
          filePath,
          req.file.size,
        )
        incrementUpload(req.user.id)
        res.redirect('/')
      }
    }
  },
)

module.exports = uploadRouter
