import { defineStore } from 'pinia'
import api from '@/services/api'

type AIFeature =
  | 'summary'
  | 'grammar'
  | 'tone'
  | 'improvements'
  | 'difficultWords'
  | 'ask'

type EndpointFeature = Exclude<AIFeature, 'ask'>

interface AIState {
  summary: string
  grammar: string
  tone: string
  improvements: string
  difficultWords: string
  askAnswer: string
  question: string
  loading: AIFeature | null
  error: string
}

const endpoints: Record<EndpointFeature, string> = {
  summary: '/ai/summary',
  grammar: '/ai/grammar',
  tone: '/ai/tone',
  improvements: '/ai/improvements',
  difficultWords: '/ai/difficult-words'
}

export const useAIStore = defineStore('ai', {
  state: (): AIState => ({
    summary: '',
    grammar: '',
    tone: '',
    improvements: '',
    difficultWords: '',
    askAnswer: '',
    question: '',
    loading: null,
    error: ''
  }),

  actions: {
    async run(feature: AIFeature, text: string) {
      if (!text.trim()) {
        this.error = 'No text to analyze. Run an analysis first.'
        return
      }

      this.error = ''
      this.loading = feature

      try {
        if (feature === 'ask') {
          if (!this.question.trim()) {
            this.error = 'Please enter a question first.'
            this.loading = null
            return
          }

          const { data } = await api.post('/ai/ask', {
            text,
            question: this.question
          })

          if (data.success) {
            this.askAnswer = data.data
          }
        } else {
          const endpoint = endpoints[feature]

          const { data } = await api.post(endpoint, { text })

          if (data.success) {
            this[feature] = data.data
          }
        }
      } catch (err: any) {
        this.error =
          err?.response?.data?.message ??
          'AI request failed. Check your API key in server/.env'
      } finally {
        this.loading = null
      }
    },

    clearAll() {
      this.summary = ''
      this.grammar = ''
      this.tone = ''
      this.improvements = ''
      this.difficultWords = ''
      this.askAnswer = ''
      this.question = ''
      this.error = ''
      this.loading = null
    }
  }
})