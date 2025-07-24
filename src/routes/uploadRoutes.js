const { Router } = require('express')
const multer = require('multer')
const upload = multer({ dest: './public/data/uploads/' })
const uploadRouter = Router()

uploadRouter.get('/', (req, res, next) => {
  res.render('uploadfile', { folderid: req.query.folder })
})

uploadRouter.post('/', upload.single('uploadedfile'), function (req, res) {
  // req.file is the name of your file in the form above, here 'uploaded_file'
  // req.body will hold the text fields, if there were any
  console.log(req.file, req.body)
})

module.exports = uploadRouter
