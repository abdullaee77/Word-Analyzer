const mammoth = require('mammoth')
const path = require('path')
const fs = require('fs')

async function upload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' })
    }

    const ext = path.extname(req.file.originalname).toLowerCase()
    let extractedText = ''

    if (ext === '.txt') {
      extractedText = req.file.buffer.toString('utf-8')
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer })
      extractedText = result.value
    } else {
      return res.status(400).json({ success: false, message: 'Only .txt and .docx files are supported.' })
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ success: false, message: 'The file appears to be empty.' })
    }

    res.json({ success: true, data: { text: extractedText, filename: req.file.originalname } })
  } catch (err) {
    next(err)
  }
}

module.exports = { upload }