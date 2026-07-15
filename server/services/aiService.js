const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const MODEL = 'llama-3.3-70b-versatile'

async function callGroq(systemPrompt, userContent) {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ],
    temperature: 0.7,
    max_tokens: 1024
  })
  return response.choices[0]?.message?.content || ''
}

async function getSummary(text) {
  return callGroq(
    'You are a professional text summarizer. Provide a clear, concise summary in 3-5 sentences. Return only the summary, no preamble.',
    `Summarize this text:\n\n${text}`
  )
}

async function getGrammarSuggestions(text) {
  return callGroq(
    'You are a grammar expert. Identify grammar issues and explain how to fix them. Format your response as a numbered list. If the text is grammatically correct, say so.',
    `Check the grammar of this text and list issues:\n\n${text}`
  )
}

async function getToneDetection(text) {
  return callGroq(
    'You are a writing tone analyst. Identify the tone of the text (e.g. formal, informal, persuasive, informative, emotional, neutral, etc.) and explain why in 2-3 sentences. Return only the tone label and explanation.',
    `Analyze the tone of this text:\n\n${text}`
  )
}

async function getWritingImprovements(text) {
  return callGroq(
    'You are a writing coach. Suggest 3-5 specific improvements to make this text clearer, more engaging, or more effective. Format as a numbered list.',
    `Suggest improvements for this text:\n\n${text}`
  )
}

async function explainDifficultWords(text) {
  return callGroq(
    'You are a vocabulary expert. Identify 5-8 difficult or advanced words in the text and explain each in simple terms. Format as: Word: [word] - Meaning: [simple explanation]',
    `Identify and explain difficult words in this text:\n\n${text}`
  )
}

async function askQuestion(text, question) {
  return callGroq(
    'You are a helpful assistant. Answer questions about the provided text accurately and concisely based only on what is in the text.',
    `Text:\n\n${text}\n\nQuestion: ${question}`
  )
}

module.exports = {
  getSummary,
  getGrammarSuggestions,
  getToneDetection,
  getWritingImprovements,
  explainDifficultWords,
  askQuestion
}