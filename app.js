require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

// create an express app
const app = express()

// get the path with 'path' module
const path = require('path')

// import routers for requests for user and sauce
const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce')

// connection to the database
// create an .env file at the root and enter your mongoDB connection id
// *EX: DB=idMongoDb
mongoose.connect(`mongodb+srv://${process.env.DB}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Successful database connection !'))
  .catch(() => console.log('Failed database connection !'))

// parse incoming request bodies in a middleware before your handlers, available under the req.body property
app.use(express.json())

// defines custom response headers. Changes to the headers occur synchronously. 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

// define the routes with his router
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes)

module.exports = app