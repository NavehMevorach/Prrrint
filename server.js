const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on('uncaughtException', err => {
  console.log(err)
  console.log('UnHandled Exception! Shutting Down the server')
  process.exit(1)
})

dotenv.config({ path: './config.env' })
const app = require('./app')

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(con => {
    console.log('DB connections worked')
  })

// Build a Server
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`)
  console.log(__dirname)
})

process.on('unhandledRejection', err => {
  console.log(err.name, err.message)
  console.log('UnHandled Rejection! Shutting Down the server')
  server.close(() => {
    process.exit(1)
  })
})

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED - SHUTTING DOWN THE SERVER')
  server.close(() => {
    console.log('💥 Process terminated!');
  })
})
