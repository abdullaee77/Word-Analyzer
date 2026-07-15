const express = require('express')
const router = express.Router()
const multer = require('multer')
const { upload } = require('../controllers/uploadController')

const storage = multer.memoryStorage()
const fileFilter = (req, file, cb) => {
  const allowed = ['.txt', '.docx']
  const ext = require('path').extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) cb(null, true)
  else cb(new Error('Only .txt and .docx files are allowed.'))
}

const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
})

router.post('/', uploadMiddleware.single('file'), upload)

module.exports = router