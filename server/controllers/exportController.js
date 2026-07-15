const PDFDocument = require('pdfkit')

async function exportPdf(req, res, next) {
  try {
    const { basicStats, characterAnalysis, wordAnalysis, keywords, readingAnalysis } = req.body

    if (!basicStats) {
      return res.status(400).json({ success: false, message: 'Analysis data is required.' })
    }

    const doc = new PDFDocument({ margin: 50 })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="word-analysis-report.pdf"')
    doc.pipe(res)

    // Title
    doc.fontSize(22).font('Helvetica-Bold').text('Advanced Word Analyzer Report', { align: 'center' })
    doc.fontSize(10).font('Helvetica').fillColor('#6B6F7B').text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' })
    doc.moveDown(1.5)

    // Helper
    function section(title) {
      doc.moveDown(0.5)
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#4747C2').text(title)
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#4747C2').lineWidth(1).stroke()
      doc.moveDown(0.5)
      doc.fillColor('#15171C').fontSize(11).font('Helvetica')
    }

    function row(label, value) {
      doc.font('Helvetica-Bold').text(`${label}: `, { continued: true })
         .font('Helvetica').text(String(value))
    }

    section('Text Statistics')
    row('Total Characters', basicStats.totalChars)
    row('Characters (no spaces)', basicStats.charsNoSpaces)
    row('Total Words', basicStats.totalWords)
    row('Total Sentences', basicStats.totalSentences)
    row('Total Paragraphs', basicStats.totalParagraphs)
    row('Total Lines', basicStats.totalLines)

    section('Character Analysis')
    row('Uppercase Letters', characterAnalysis.uppercase)
    row('Lowercase Letters', characterAnalysis.lowercase)
    row('Digits', characterAnalysis.digits)
    row('Spaces', characterAnalysis.spaces)
    row('Punctuation', characterAnalysis.punctuation)
    row('Special Characters', characterAnalysis.special)

    section('Word Analysis')
    row('Longest Word', wordAnalysis.longestWord || '—')
    row('Shortest Word', wordAnalysis.shortestWord || '—')
    row('Average Word Length', wordAnalysis.averageWordLength)
    row('Total Unique Words', wordAnalysis.totalUniqueWords)
    doc.moveDown(0.5)
    doc.font('Helvetica-Bold').text('Top 10 Most Frequent Words:')
    wordAnalysis.topWords.forEach((w, i) => {
      doc.font('Helvetica').text(`${i + 1}. ${w.word} — ${w.count} times`)
    })

    section('Keywords')
    doc.font('Helvetica').text(keywords.map(k => `${k.word} (${k.count})`).join(', ') || 'None found')

    section('Reading Analysis')
    const fmt = s => s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`
    row('Estimated Reading Time', fmt(readingAnalysis.readingTimeSeconds))
    row('Estimated Speaking Time', fmt(readingAnalysis.speakingTimeSeconds))
    row('Average Sentence Length', `${readingAnalysis.averageSentenceLength} words`)
    row('Average Word Length', `${readingAnalysis.averageWordLength} chars`)

    doc.end()
  } catch (err) {
    next(err)
  }
}

module.exports = { exportPdf }