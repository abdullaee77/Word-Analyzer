const aiService = require('../services/aiService')

function validateText(req, res) {
  const { text } = req.body
  if (!text || !text.trim()) {
    res.status(400).json({ success: false, message: 'Text is required.' })
    return false
  }
  return true
}

async function summary(req, res, next) {
  try {
    if (!validateText(req, res)) return
    const result = await aiService.getSummary(req.body.text)
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
}

async function grammar(req, res, next) {
  try {
    if (!validateText(req, res)) return
    const result = await aiService.getGrammarSuggestions(req.body.text)
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
}

async function tone(req, res, next) {
  try {
    if (!validateText(req, res)) return
    const result = await aiService.getToneDetection(req.body.text)
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
}

async function improvements(req, res, next) {
  try {
    if (!validateText(req, res)) return
    const result = await aiService.getWritingImprovements(req.body.text)
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
}

async function difficultWords(req, res, next) {
  try {
    if (!validateText(req, res)) return
    const result = await aiService.explainDifficultWords(req.body.text)
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
}

async function askQuestion(req, res, next) {
  try {
    const { text, question } = req.body
    if (!text || !question) {
      return res.status(400).json({ success: false, message: 'Text and question are required.' })
    }
    const result = await aiService.askQuestion(text, question)
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
}

module.exports = { summary, grammar, tone, improvements, difficultWords, askQuestion }