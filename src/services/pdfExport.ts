import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type {
  BasicStats,
  CharacterAnalysis,
  WordAnalysis,
  WordFrequency,
  ReadingAnalysis
} from './textAnalyzer'
import { formatDuration } from './textAnalyzer'

interface ExportPayload {
  text: string
  basicStats: BasicStats
  characterAnalysis: CharacterAnalysis
  wordAnalysis: WordAnalysis
  keywords: WordFrequency[]
  readingAnalysis: ReadingAnalysis
  chartImages?: { wordFreq?: string; charDist?: string }
}

const INK = '#15171C'
const PRIMARY = '#5B5BD6'
const MUTED = '#6B6F7B'

export function exportAnalysisToPdf(payload: ExportPayload) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 40
  let y = 50

  // Header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(INK)
  doc.text('Advanced Word Analyzer', margin, y)
  y += 18
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(MUTED)
  doc.text(`Generated on ${new Date().toLocaleString()}`, margin, y)
  y += 24

  // Section: Basic stats
  y = addSectionTitle(doc, 'Text Statistics', margin, y)
  const statsRows = [
    ['Total characters', String(payload.basicStats.totalChars)],
    ['Characters (no spaces)', String(payload.basicStats.charsNoSpaces)],
    ['Total words', String(payload.basicStats.totalWords)],
    ['Total sentences', String(payload.basicStats.totalSentences)],
    ['Total paragraphs', String(payload.basicStats.totalParagraphs)],
    ['Total lines', String(payload.basicStats.totalLines)]
  ]
  y = addSimpleTable(doc, statsRows, margin, y, pageWidth)

  // Section: Character analysis
  y = addSectionTitle(doc, 'Character Analysis', margin, y)
  const charRows = [
    ['Uppercase letters', String(payload.characterAnalysis.uppercase)],
    ['Lowercase letters', String(payload.characterAnalysis.lowercase)],
    ['Digits', String(payload.characterAnalysis.digits)],
    ['Spaces', String(payload.characterAnalysis.spaces)],
    ['Punctuation', String(payload.characterAnalysis.punctuation)],
    ['Special characters', String(payload.characterAnalysis.special)]
  ]
  y = addSimpleTable(doc, charRows, margin, y, pageWidth)

  // Section: Word analysis
  y = addSectionTitle(doc, 'Word Analysis', margin, y)
  const wordRows = [
    ['Longest word', payload.wordAnalysis.longestWord || '—'],
    ['Shortest word', payload.wordAnalysis.shortestWord || '—'],
    ['Average word length', String(payload.wordAnalysis.averageWordLength)],
    ['Total unique words', String(payload.wordAnalysis.totalUniqueWords)]
  ]
  y = addSimpleTable(doc, wordRows, margin, y, pageWidth)

  y = checkPageBreak(doc, y, 80)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(INK)
  doc.text('Top 10 most frequent words', margin, y)
  y += 14
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Word', 'Count']],
    body: payload.wordAnalysis.topWords.map(w => [w.word, String(w.count)]),
    theme: 'plain',
    headStyles: { fillColor: '#EEEEFC', textColor: INK, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 6 },
    alternateRowStyles: { fillColor: '#FAFAF9' }
  })
  y = (doc as any).lastAutoTable.finalY + 24

  // Section: Keywords
  y = checkPageBreak(doc, y, 60)
  y = addSectionTitle(doc, 'Keywords', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(INK)
  const keywordText = payload.keywords.length
    ? payload.keywords.map(k => `${k.word} (${k.count})`).join('   •   ')
    : 'No significant keywords found.'
  const wrapped = doc.splitTextToSize(keywordText, pageWidth - margin * 2)
  doc.text(wrapped, margin, y)
  y += wrapped.length * 13 + 20

  // Section: Reading analysis
  y = checkPageBreak(doc, y, 100)
  y = addSectionTitle(doc, 'Reading Analysis', margin, y)
  const readingRows = [
    ['Estimated reading time', formatDuration(payload.readingAnalysis.readingTimeSeconds)],
    ['Estimated speaking time', formatDuration(payload.readingAnalysis.speakingTimeSeconds)],
    ['Average sentence length', `${payload.readingAnalysis.averageSentenceLength} words`],
    ['Average word length', `${payload.readingAnalysis.averageWordLength} chars`]
  ]
  y = addSimpleTable(doc, readingRows, margin, y, pageWidth)

  // Charts (as images, if provided)
  if (payload.chartImages?.wordFreq) {
    y = checkPageBreak(doc, y, 220)
    y = addSectionTitle(doc, 'Word Frequency Chart', margin, y)
    const imgWidth = pageWidth - margin * 2
    doc.addImage(payload.chartImages.wordFreq, 'PNG', margin, y, imgWidth, 180)
    y += 200
  }

  if (payload.chartImages?.charDist) {
    y = checkPageBreak(doc, y, 220)
    y = addSectionTitle(doc, 'Character Distribution Chart', margin, y)
    const imgWidth = Math.min(260, pageWidth - margin * 2)
    doc.addImage(payload.chartImages.charDist, 'PNG', margin, y, imgWidth, imgWidth)
    y += imgWidth + 20
  }

  doc.save(`word-analysis-report-${Date.now()}.pdf`)
}

function addSectionTitle(doc: jsPDF, title: string, margin: number, y: number): number {
  y = checkPageBreak(doc, y, 40)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(PRIMARY)
  doc.text(title, margin, y)
  doc.setDrawColor(PRIMARY)
  doc.setLineWidth(1)
  doc.line(margin, y + 5, margin + 60, y + 5)
  return y + 22
}

function addSimpleTable(doc: jsPDF, rows: string[][], margin: number, y: number, pageWidth: number): number {
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    body: rows,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 5, textColor: INK },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: (pageWidth - margin * 2) * 0.5 }
    }
  })
  return (doc as any).lastAutoTable.finalY + 20
}

function checkPageBreak(doc: jsPDF, y: number, neededSpace: number): number {
  const pageHeight = doc.internal.pageSize.getHeight()
  if (y + neededSpace > pageHeight - 40) {
    doc.addPage()
    return 50
  }
  return y
}