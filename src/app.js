require('dotenv').config()
const path = require('path')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const express = require('express')
const bcrypt = require('bcryptjs')
const appRouter = require('./routes/routes')
const session = require('express-session')
const { getUserByUsername, getUserById } = require('./models/db')
const app = express()
const PORT = process.env.PORT || 8080

const viewsPath = path.join(__dirname, 'views')
const publicPath = path.join(__dirname, 'public')

app.set('view engine', 'ejs')
app.set('views', viewsPath)

app.use(express.static(publicPath))
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'cat', resave: false, saveUninitialized: false }))
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

app.listen(PORT, () => {
  console.log('Server started!')
})
