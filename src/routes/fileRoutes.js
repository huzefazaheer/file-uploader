const { Router } = require('express')
const { getFile, deleteFile, supabase } = require('../models/db')
const fileRouter = Router()

fileRouter.get('/:id', async (req, res) => {
  const file = await getFile(req.params.id)
  res.render('fileview', { file: file, user: req.user })
})

fileRouter.get('/delete/:id', async (req, res) => {
  await deleteFile(req.params.id)
  res.redirect('/')
})

fileRouter.get('/download/:id', async (req, res) => {
  try {
    const file = await getFile(req.params.id)
    const { data } = await supabase.storage.from('data').download(file.url)
    const buffer = Buffer.from(await data.arrayBuffer())
    res.set({
      'Content-Type': data.type,
      'Content-Disposition': `attachment; filename="${file.name}"`, // Suggests a filename for download
    })
    res.send(buffer)
  } catch (err) {
    console.log(err)
  }
})

module.exports = fileRouter
