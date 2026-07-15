export interface BasicStats {
  totalChars: number
  charsNoSpaces: number
  totalWords: number
  totalSentences: number
  totalParagraphs: number
  totalLines: number
}

export interface CharacterAnalysis {
  uppercase: number
  lowercase: number
  digits: number
  spaces: number
  punctuation: number
  special: number
}

export interface WordFrequency {
  word: string
  count: number
}

export interface WordAnalysis {
  longestWord: string
  shortestWord: string
  averageWordLength: number
  totalUniqueWords: number
  repeatedWords: WordFrequency[]
  topWords: WordFrequency[]
}

export interface ReadingAnalysis {
  readingTimeSeconds: number
  speakingTimeSeconds: number
  averageSentenceLength: number
  averageWordLength: number
}

const STOP_WORDS = new Set([
  'the', 'is', 'a', 'an', 'and', 'of', 'to', 'in', 'on', 'it', 'this', 'that',
  'for', 'with', 'as', 'are', 'was', 'were', 'be', 'been', 'being', 'at',
  'by', 'from', 'or', 'but', 'not', 'so', 'if', 'then', 'than', 'too',
  'very', 'can', 'will', 'just', 'i', 'you', 'he', 'she', 'we', 'they',
  'his', 'her', 'its', 'our', 'their', 'my', 'your', 'them', 'me', 'us'
])

function getWords(text: string): string[] {
  const matches = text.match(/[A-Za-z']+/g)
  return matches ? matches : []
}

function getSentences(text: string): string[] {
  const trimmed = text.trim()
  if (!trimmed) return []
  const matches = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g)
  return matches ? matches.map(s => s.trim()).filter(Boolean) : []
}

function getParagraphs(text: string): string[] {
  return text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
}

function getLines(text: string): string[] {
  return text.split('\n')
}

export function computeBasicStats(text: string): BasicStats {
  const words = getWords(text)
  const sentences = getSentences(text)
  const paragraphs = getParagraphs(text)
  const lines = getLines(text)

  return {
    totalChars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    totalWords: words.length,
    totalSentences: sentences.length,
    totalParagraphs: paragraphs.length || (text.trim() ? 1 : 0),
    totalLines: lines.length
  }
}

export function computeCharacterAnalysis(text: string): CharacterAnalysis {
  const result: CharacterAnalysis = {
    uppercase: 0,
    lowercase: 0,
    digits: 0,
    spaces: 0,
    punctuation: 0,
    special: 0
  }

  const punctuationChars = new Set('.,!?;:\'"-()[]{}')

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

export function computeWordAnalysis(text: string): WordAnalysis {
  const words = getWords(text)
  const lowerWords = words.map(w => w.toLowerCase())

  if (words.length === 0) {
    return {
      longestWord: '',
      shortestWord: '',
      averageWordLength: 0,
      totalUniqueWords: 0,
      repeatedWords: [],
      topWords: []
    }
  }

  const freq = new Map<string, number>()
  for (const w of lowerWords) {
    freq.set(w, (freq.get(w) || 0) + 1)
  }

  const longestWord = words.reduce((a, b) => (b.length > a.length ? b : a))
  const shortestWord = words.reduce((a, b) => (b.length < a.length ? b : a))
  const totalLength = words.reduce((sum, w) => sum + w.length, 0)

  const sortedByFreq: WordFrequency[] = Array.from(freq.entries())
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

export function extractKeywords(text: string, limit = 15): WordFrequency[] {
  const words = getWords(text).map(w => w.toLowerCase())
  const freq = new Map<string, number>()

  for (const w of words) {
    if (w.length < 3 || STOP_WORDS.has(w)) continue
    freq.set(w, (freq.get(w) || 0) + 1)
  }

  return Array.from(freq.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function computeReadingAnalysis(text: string): ReadingAnalysis {
  const words = getWords(text)
  const sentences = getSentences(text)
  const wordCount = words.length
  const totalWordLength = words.reduce((sum, w) => sum + w.length, 0)

  const AVG_READING_WPM = 200
  const AVG_SPEAKING_WPM = 130

  return {
    readingTimeSeconds: Math.ceil((wordCount / AVG_READING_WPM) * 60),
    speakingTimeSeconds: Math.ceil((wordCount / AVG_SPEAKING_WPM) * 60),
    averageSentenceLength: sentences.length
      ? Number((wordCount / sentences.length).toFixed(2))
      : 0,
    averageWordLength: wordCount
      ? Number((totalWordLength / wordCount).toFixed(2))
      : 0
  }
}

export interface WordSearchResult {
  count: number
  positions: number[]
}

export function searchWord(text: string, query: string): WordSearchResult {
  if (!query.trim()) return { count: 0, positions: [] }
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`\\b${escaped}\\b`, 'gi')
  const positions: number[] = []
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    positions.push(match.index)
  }
  return { count: positions.length, positions }
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remSeconds = seconds % 60
  return remSeconds > 0 ? `${minutes}m ${remSeconds}s` : `${minutes}m`
}

export function highlightMatches(text: string, query: string): string {
  if (!query.trim()) return escapeHtml(text)
  const escapedText = escapeHtml(text)
  const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`\\b(${escapedQuery})\\b`, 'gi')
  return escapedText.replace(regex, '<mark class="bg-amber-400/40 rounded px-0.5">$1</mark>')
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}