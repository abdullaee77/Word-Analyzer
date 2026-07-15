require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const analyzeRoutes = require('./routes/analyze')
const uploadRoutes = require('./routes/upload')
const exportRoutes = require('./routes/export')
const aiRoutes = require('./routes/ai')
const feedbackRoutes = require('./routes/feedback')

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/analyze', analyzeRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/export', exportRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/feedback', feedbackRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Word Analyzer API is running' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})