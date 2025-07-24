require('dotenv').config()
const express = require('express')
const appRouter = require('./routes/routes')
const app = express()
const PORT = process.env.PORT || 8080

app.use(appRouter)

app.listen(PORT, () => {
  console.log('Server started!')
})
