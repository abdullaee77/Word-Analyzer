// const mongoose = require('mongoose')

// async function connectDB() {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI)
//     console.log(`MongoDB connected: ${conn.connection.host}`)
//   } catch (err) {
//     console.error('MongoDB connection error:', err.message)
//     process.exit(1)
//   }
// }

// module.exports = connectDB

const mongoose = require('mongoose')


let cached = global._mongoose
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        bufferCommands: false
      })
      .then((m) => {
        console.log(`MongoDB connected: ${m.connection.host}`)
        return m
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err.message)
        cached.promise = null   
        throw err
      })
  }

  cached.conn = await cached.promise
  return cached.conn
}

module.exports = connectDB