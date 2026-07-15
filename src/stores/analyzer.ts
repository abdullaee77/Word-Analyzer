import { defineStore } from 'pinia'
import api from '@/services/api'
import { searchWord, highlightMatches } from '@/services/textAnalyzer'
import type {
  BasicStats,
  CharacterAnalysis,
  WordAnalysis,
  WordFrequency,
  ReadingAnalysis
} from '@/services/textAnalyzer'

interface AnalyzerState {
  text: string
  hasAnalyzed: boolean
  isAnalyzing: boolean
  isExporting: boolean
  isUploading: boolean
  fileError: string
  searchQuery: string
  searchResultCount: number
  basicStats: BasicStats | null
  characterAnalysis: CharacterAnalysis | null
  wordAnalysis: WordAnalysis | null
  keywords: WordFrequency[]
  readingAnalysis: ReadingAnalysis | null
}

export const useAnalyzerStore = defineStore('analyzer', {
  state: (): AnalyzerState => ({
    text: '',
    hasAnalyzed: false,
    isAnalyzing: false,
    isExporting: false,
    isUploading: false,
    fileError: '',
    searchQuery: '',
    searchResultCount: 0,
    basicStats: null,
    characterAnalysis: null,
    wordAnalysis: null,
    keywords: [],
    readingAnalysis: null
  }),

  getters: {
    wordCountLive(state): number {
      const matches = state.text.match(/[A-Za-z']+/g)
      return matches ? matches.length : 0
    }
  },

  actions: {
    async analyze() {
      if (!this.text.trim()) {
        this.fileError = 'Please enter or upload some text first.'
        return
      }
      this.fileError = ''
      this.isAnalyzing = true

      try {
        const { data } = await api.post('/analyze', { text: this.text })
        if (data.success) {
          this.basicStats = data.data.basicStats
          this.characterAnalysis = data.data.characterAnalysis
          this.wordAnalysis = data.data.wordAnalysis
          this.keywords = data.data.keywords
          this.readingAnalysis = data.data.readingAnalysis
          this.hasAnalyzed = true
          this.runSearch()
        }
      } catch (err: any) {
        this.fileError = err?.response?.data?.message || 'Analysis failed. Is the backend running?'
      } finally {
        this.isAnalyzing = false
      }
    },

    async uploadFile(file: File) {
      this.fileError = ''
      this.isUploading = true

      try {
        const formData = new FormData()
        formData.append('file', file)
        const { data } = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (data.success) {
          this.text = data.data.text
        }
      } catch (err: any) {
        this.fileError = err?.response?.data?.message || 'File upload failed. Please try again.'
      } finally {
        this.isUploading = false
      }
    },

    clearAll() {
      this.text = ''
      this.hasAnalyzed = false
      this.basicStats = null
      this.characterAnalysis = null
      this.wordAnalysis = null
      this.keywords = []
      this.readingAnalysis = null
      this.searchQuery = ''
      this.searchResultCount = 0
      this.fileError = ''
    },

    runSearch() {
      if (!this.text || !this.searchQuery.trim()) {
        this.searchResultCount = 0
        return
      }
      const result = searchWord(this.text, this.searchQuery)
      this.searchResultCount = result.count
    },

    setFileError(message: string) {
      this.fileError = message
    }
  }
})
