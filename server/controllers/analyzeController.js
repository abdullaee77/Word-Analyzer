const { analyzeText } = require('../services/textAnalyzer')

async function analyze(req, res, next) {
  try {
    const { text } = req.body
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Text is required.' })
    }
    if (text.length > 500000) {
      return res.status(400).json({ success: false, message: 'Text is too large. Max 500,000 characters.' })
    }

    const result = analyzeText(text)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

module.exports = { analyze }