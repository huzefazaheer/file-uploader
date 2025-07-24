const { Router } = require('express')
const { createUser } = require('../models/db')

const appRouter = Router()

appRouter.get('/', async (req, res) => {
  await createUser()
})

module.exports = appRouter
