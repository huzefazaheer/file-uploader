require('dotenv').config()
const path = require('path')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const express = require('express')
const bcrypt = require('bcryptjs')
const appRouter = require('./routes/routes')
const session = require('express-session')
const { getUserByUsername, getUserById } = require('./models/db')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store')
const { PrismaClient } = require('../generated/prisma/client.js')
const uploadRouter = require('./routes/uploadRoutes.js')
const createRouter = require('./routes/createRoutes.js')
const fileRouter = require('./routes/fileRoutes.js')
const folderRouter = require('./routes/folderRouter.js')
const app = express()
const PORT = process.env.PORT || 8080

const viewsPath = path.join(__dirname, 'views')
const publicPath = path.join(__dirname, 'public')

app.set('view engine', 'ejs')
app.set('views', viewsPath)

app.use(express.static(publicPath))
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: 'cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
)
app.use(passport.session())

passport.use(
  new localStrategy(async (username, password, done) => {
    const user = await getUserByUsername(username)
    try {
      if (!user) return done(null, false, { message: 'Invald username' })
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return done(null, false, { message: 'Invald password' })
      return done(null, user)
    } catch (error) {
      return done(error)
    }
  }),
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id)
    done(null, user)
  } catch (error) {
    done(error)
  }
})

app.use(appRouter)
app.use('/create', createRouter)
app.use('/upload', uploadRouter)
app.use('/file', fileRouter)
app.use('/folder', folderRouter)

app.use((req, res) => {
  res.render('error')
})

app.use((error, req, res, next) => {
  res.render('error')
})

app.listen(PORT, () => {
  console.log('Server started!')
})
