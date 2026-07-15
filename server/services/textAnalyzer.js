const STOP_WORDS = require('../utils/stopWords')

function getWords(text) {
  const matches = text.match(/[A-Za-z']+/g)
  return matches || []
}

function getSentences(text) {
  const trimmed = text.trim()
  if (!trimmed) return []
  const matches = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g)
  return matches ? matches.map(s => s.trim()).filter(Boolean) : []
}

function getParagraphs(text) {
  return text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
}

function computeBasicStats(text) {
  const words = getWords(text)
  const sentences = getSentences(text)
  const paragraphs = getParagraphs(text)
  const lines = text.split('\n')

  return {
    totalChars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    totalWords: words.length,
    totalSentences: sentences.length,
    totalParagraphs: paragraphs.length || (text.trim() ? 1 : 0),
    totalLines: lines.length
  }
}

function computeCharacterAnalysis(text) {
  const result = {
    uppercase: 0, lowercase: 0, digits: 0,
    spaces: 0, punctuation: 0, special: 0
  }
  const punctuationChars = new Set('.,!?;:\'"-()\[\]{}')

  for (const ch of text) {
    if (/[A-Z]/.test(ch)) result.uppercase++
    else if (/[a-z]/.test(ch)) result.lowercase++
    else if (/[0-9]/.test(ch)) result.digits++
    else if (/\s/.test(ch)) result.spaces++
    else if (punctuationChars.has(ch)) result.punctuation++
    else result.special++
  }
  return result
}

function computeWordAnalysis(text) {
  const words = getWords(text)
  const lowerWords = words.map(w => w.toLowerCase())

  if (words.length === 0) {
    return {
      longestWord: '', shortestWord: '',
      averageWordLength: 0, totalUniqueWords: 0,
      repeatedWords: [], topWords: []
    }
  }

  const freq = new Map()
  for (const w of lowerWords) {
    freq.set(w, (freq.get(w) || 0) + 1)
  }

  const longestWord = words.reduce((a, b) => b.length > a.length ? b : a)
  const shortestWord = words.reduce((a, b) => b.length < a.length ? b : a)
  const totalLength = words.reduce((sum, w) => sum + w.length, 0)

  const sortedByFreq = Array.from(freq.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)

  return {
    longestWord,
    shortestWord,
    averageWordLength: Number((totalLength / words.length).toFixed(2)),
    totalUniqueWords: freq.size,
    repeatedWords: sortedByFreq.filter(w => w.count > 1),
    topWords: sortedByFreq.slice(0, 10)
  }
}

function extractKeywords(text, limit = 15) {
  const words = getWords(text).map(w => w.toLowerCase())
  const freq = new Map()

  for (const w of words) {
    if (w.length < 3 || STOP_WORDS.has(w)) continue
    freq.set(w, (freq.get(w) || 0) + 1)
  }

  return Array.from(freq.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

function computeReadingAnalysis(text) {
  const words = getWords(text)
  const sentences = getSentences(text)
  const totalWordLength = words.reduce((sum, w) => sum + w.length, 0)

  return {
    readingTimeSeconds: Math.ceil((words.length / 200) * 60),
    speakingTimeSeconds: Math.ceil((words.length / 130) * 60),
    averageSentenceLength: sentences.length
      ? Number((words.length / sentences.length).toFixed(2)) : 0,
    averageWordLength: words.length
      ? Number((totalWordLength / words.length).toFixed(2)) : 0
  }
}

function analyzeText(text) {
  return {
    basicStats: computeBasicStats(text),
    characterAnalysis: computeCharacterAnalysis(text),
    wordAnalysis: computeWordAnalysis(text),
    keywords: extractKeywords(text),
    readingAnalysis: computeReadingAnalysis(text)
  }
}

module.exports = { analyzeText }