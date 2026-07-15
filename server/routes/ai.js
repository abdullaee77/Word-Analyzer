const express = require('express')
const router = express.Router()
const { summary, grammar, tone, improvements, difficultWords, askQuestion } = require('../controllers/aiController')

router.post('/summary', summary)
router.post('/grammar', grammar)
router.post('/tone', tone)
router.post('/improvements', improvements)
router.post('/difficult-words', difficultWords)
router.post('/ask', askQuestion)

module.exports = router