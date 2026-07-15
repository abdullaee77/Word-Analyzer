<script setup lang="ts">
import FeedbackForm from '@/components/FeedbackForm.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAnalyzerStore } from '@/stores/analyzer'
import { highlightMatches, formatDuration } from '@/services/textAnalyzer'
import { exportAnalysisToPdf } from '@/services/pdfExport'
import WordFrequencyChart from '@/components/WordFrequencyChart.vue'
import CharacterDistributionChart from '@/components/CharacterDistributionChart.vue'
import AIPanel from '@/components/AIPanel.vue'

const router = useRouter()
const store = useAnalyzerStore()
const {
  text,
  hasAnalyzed,
  isAnalyzing,
  isExporting,
  isUploading,
  fileError,
  searchQuery,
  searchResultCount,
  basicStats,
  characterAnalysis,
  wordAnalysis,
  keywords,
  readingAnalysis,
  wordCountLive
} = storeToRefs(store)

const fileInput = ref<HTMLInputElement | null>(null)
const copyFeedback = ref(false)
const wordChartRef = ref<InstanceType<typeof WordFrequencyChart> | null>(null)
const charChartRef = ref<InstanceType<typeof CharacterDistributionChart> | null>(null)

const highlightedText = computed(() => {
  if (!searchQuery.value.trim()) return null
  return highlightMatches(text.value, searchQuery.value)
})

async function copyText() {
  if (!text.value) return
  try {
    await navigator.clipboard.writeText(text.value)
    copyFeedback.value = true
    setTimeout(() => (copyFeedback.value = false), 1500)
  } catch {
    store.setFileError('Could not copy — clipboard access was denied.')
  }
}

async function pasteText() {
  try {
    const clipboardText = await navigator.clipboard.readText()
    text.value = clipboardText
  } catch {
    store.setFileError('Could not paste — clipboard access was denied. Try Ctrl+V in the box instead.')
  }
}

function triggerFileUpload() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!['txt', 'docx'].includes(ext || '')) {
    store.setFileError('Only .txt and .docx files are supported.')
    input.value = ''
    return
  }

  store.uploadFile(file)
  input.value = ''
}

async function exportPdf() {
  if (!hasAnalyzed.value || !basicStats.value || !characterAnalysis.value || !wordAnalysis.value || !readingAnalysis.value) {
    store.setFileError('Run an analysis first before exporting.')
    return
  }

  store.isExporting = true
  await new Promise(resolve => setTimeout(resolve, 50))

  try {
    const wordCanvas = (wordChartRef.value as any)?.$el?.querySelector('canvas') as HTMLCanvasElement | undefined
    const charCanvas = (charChartRef.value as any)?.$el?.querySelector('canvas') as HTMLCanvasElement | undefined

    exportAnalysisToPdf({
      text: text.value,
      basicStats: basicStats.value,
      characterAnalysis: characterAnalysis.value,
      wordAnalysis: wordAnalysis.value,
      keywords: keywords.value,
      readingAnalysis: readingAnalysis.value,
      chartImages: {
        wordFreq: wordCanvas?.toDataURL('image/png'),
        charDist: charCanvas?.toDataURL('image/png')
      }
    })
  } catch {
    store.setFileError('Something went wrong generating the PDF. Please try again.')
  } finally {
    store.isExporting = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-paper text-ink">

    <!-- Analyzing overlay -->
    <div v-if="isAnalyzing" class="fixed inset-0 bg-ink/10 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="bg-white rounded-2xl px-8 py-6 shadow-xl flex items-center gap-3">
        <div class="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <span class="font-mono text-sm text-ink-400">Analyzing your text...</span>
      </div>
    </div>

    <!-- Top bar -->
    <header class="max-w-7xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between">
      <button @click="router.push('/')" class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
          <span class="text-paper font-display italic text-base leading-none">Aa</span>
        </div>
        <span class="font-display text-lg tracking-tight">Word Analyzer</span>
      </button>
      <span class="font-mono text-xs text-ink-400 uppercase tracking-widest">Text Analyzer</span>
    </header>

    <main class="max-w-7xl mx-auto px-6 md:px-10 pb-24 grid lg:grid-cols-5 gap-8">

      <!-- Left: Input column -->
      <section class="lg:col-span-2 space-y-5">

        <!-- Text input card -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-display text-xl">Your text</h2>
            <span class="font-mono text-xs text-ink-400">{{ wordCountLive }} words</span>
          </div>

          <textarea
            v-model="text"
            placeholder="Paste or type your text here..."
            class="w-full h-72 resize-y rounded-xl border border-ink/10 p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all bg-white"
          ></textarea>

          <p v-if="fileError" class="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {{ fileError }}
          </p>

          <div class="flex flex-wrap gap-3 mt-4">
            <button
              @click="store.analyze"
              :disabled="isAnalyzing"
              class="btn-primary !py-2.5 !px-6 text-sm disabled:opacity-60 flex items-center gap-2"
            >
              <span v-if="isAnalyzing" class="w-3 h-3 border-2 border-paper border-t-transparent rounded-full animate-spin"></span>
              {{ isAnalyzing ? 'Analyzing...' : 'Analyze' }}
            </button>
            <button @click="store.clearAll" class="btn-secondary !py-2.5 !px-6 text-sm">
              Clear
            </button>
            <button @click="copyText" class="btn-secondary !py-2.5 !px-6 text-sm">
              {{ copyFeedback ? 'Copied!' : 'Copy' }}
            </button>
            <button @click="pasteText" class="btn-secondary !py-2.5 !px-6 text-sm">
              Paste
            </button>
          </div>
        </div>

        <!-- File upload card -->
        <div class="card">
          <h3 class="font-semibold text-sm mb-3">Upload a file</h3>
          <button
            @click="triggerFileUpload"
            :disabled="isUploading"
            class="w-full border-2 border-dashed border-ink/15 rounded-xl py-8 text-center hover:border-primary-400 hover:bg-primary-50/40 transition-all disabled:opacity-50"
          >
            <div v-if="isUploading" class="flex items-center justify-center gap-2">
              <div class="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <p class="text-sm text-ink-400">Uploading...</p>
            </div>
            <p v-else class="text-sm text-ink-400">
              Click to upload a <span class="font-mono">.txt</span> or <span class="font-mono">.docx</span> file
            </p>
          </button>
          <input
            ref="fileInput"
            type="file"
            accept=".txt,.docx"
            class="hidden"
            @change="handleFileChange"
          />
        </div>

        <!-- Word search card (only after analysis) -->
        <div class="card" v-if="hasAnalyzed">
          <h3 class="font-semibold text-sm mb-3">Word search</h3>
          <input
            v-model="searchQuery"
            @input="store.runSearch"
            type="text"
            placeholder="Search for a word..."
            class="w-full rounded-xl border border-ink/10 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
          />
          <p v-if="searchQuery.trim()" class="mt-3 text-sm text-ink-400">
            <span class="font-semibold text-ink">{{ searchResultCount }}</span>
            occurrence{{ searchResultCount === 1 ? '' : 's' }} found
          </p>
          <div
            v-if="highlightedText"
            class="mt-3 max-h-48 overflow-y-auto text-sm leading-relaxed p-3 bg-ink/[0.02] rounded-xl"
            v-html="highlightedText"
          ></div>
        </div>

      </section>

      <!-- Right: Results column -->
      <section class="lg:col-span-3 space-y-5">

        <!-- Placeholder before analysis -->
        <div v-if="!hasAnalyzed" class="card flex items-center justify-center h-64 text-center">
          <p class="text-ink-400">
            Paste or upload some text, then click
            <span class="font-semibold text-ink">Analyze</span>
            to see the breakdown here.
          </p>
        </div>

        <template v-else>

          <!-- Export button -->
          <div class="flex justify-end">
            <button
              @click="exportPdf"
              :disabled="isExporting"
              class="btn-primary !py-2.5 !px-6 text-sm disabled:opacity-50 flex items-center gap-2"
            >
              <span v-if="isExporting" class="w-3 h-3 border-2 border-paper border-t-transparent rounded-full animate-spin"></span>
              {{ isExporting ? 'Exporting...' : 'Export PDF Report' }}
            </button>
          </div>

          <!-- Basic stats -->
          <div class="card">
            <h3 class="font-display text-lg mb-4">Text statistics</h3>
            <div class="grid grid-cols-3 sm:grid-cols-6 gap-4 font-mono">
              <div>
                <div class="text-xl font-semibold">{{ basicStats?.totalChars }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">chars</div>
              </div>
              <div>
                <div class="text-xl font-semibold">{{ basicStats?.charsNoSpaces }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">no spaces</div>
              </div>
              <div>
                <div class="text-xl font-semibold">{{ basicStats?.totalWords }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">words</div>
              </div>
              <div>
                <div class="text-xl font-semibold">{{ basicStats?.totalSentences }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">sentences</div>
              </div>
              <div>
                <div class="text-xl font-semibold">{{ basicStats?.totalParagraphs }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">paragraphs</div>
              </div>
              <div>
                <div class="text-xl font-semibold">{{ basicStats?.totalLines }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">lines</div>
              </div>
            </div>
          </div>

          <!-- Character analysis -->
          <div class="card">
            <h3 class="font-display text-lg mb-4">Character analysis</h3>
            <div class="grid grid-cols-3 sm:grid-cols-6 gap-4 font-mono">
              <div>
                <div class="text-xl font-semibold text-primary-600">{{ characterAnalysis?.uppercase }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">uppercase</div>
              </div>
              <div>
                <div class="text-xl font-semibold text-primary-600">{{ characterAnalysis?.lowercase }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">lowercase</div>
              </div>
              <div>
                <div class="text-xl font-semibold text-amber-600">{{ characterAnalysis?.digits }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">digits</div>
              </div>
              <div>
                <div class="text-xl font-semibold">{{ characterAnalysis?.spaces }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">spaces</div>
              </div>
              <div>
                <div class="text-xl font-semibold">{{ characterAnalysis?.punctuation }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">punctuation</div>
              </div>
              <div>
                <div class="text-xl font-semibold">{{ characterAnalysis?.special }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">special</div>
              </div>
            </div>
          </div>

          <!-- Charts -->
          <div class="grid sm:grid-cols-2 gap-5">
            <div class="card">
              <h3 class="font-display text-lg mb-4">Word frequency</h3>
              <WordFrequencyChart ref="wordChartRef" :words="wordAnalysis?.topWords || []" />
            </div>
            <div class="card">
              <h3 class="font-display text-lg mb-4">Character distribution</h3>
              <CharacterDistributionChart ref="charChartRef" :data="characterAnalysis" />
            </div>
          </div>

          <!-- Word analysis -->
          <div class="card">
            <h3 class="font-display text-lg mb-4">Word analysis</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono mb-6">
              <div>
                <div class="text-base font-semibold break-all">{{ wordAnalysis?.longestWord || '—' }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">longest</div>
              </div>
              <div>
                <div class="text-base font-semibold break-all">{{ wordAnalysis?.shortestWord || '—' }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">shortest</div>
              </div>
              <div>
                <div class="text-base font-semibold">{{ wordAnalysis?.averageWordLength }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">avg length</div>
              </div>
              <div>
                <div class="text-base font-semibold">{{ wordAnalysis?.totalUniqueWords }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">unique words</div>
              </div>
            </div>
            <p class="text-sm font-semibold mb-2">Top 10 most frequent</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="w in wordAnalysis?.topWords"
                :key="w.word"
                class="font-mono text-xs bg-ink/[0.04] px-2.5 py-1.5 rounded-full"
              >
                {{ w.word }} <span class="text-ink-400">×{{ w.count }}</span>
              </span>
              <span v-if="!wordAnalysis?.topWords?.length" class="text-sm text-ink-400">
                No repeated words found.
              </span>
            </div>
          </div>

          <!-- Keywords -->
          <div class="card">
            <h3 class="font-display text-lg mb-4">Keywords</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="k in keywords"
                :key="k.word"
                class="font-mono text-xs bg-amber-500/10 text-amber-600 px-2.5 py-1.5 rounded-full"
              >
                {{ k.word }} <span class="opacity-60">×{{ k.count }}</span>
              </span>
              <span v-if="!keywords?.length" class="text-sm text-ink-400">
                No significant keywords found.
              </span>
            </div>
          </div>

          <!-- Reading analysis -->
          <div class="card">
            <h3 class="font-display text-lg mb-4">Reading analysis</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
              <div>
                <div class="text-xl font-semibold">{{ formatDuration(readingAnalysis?.readingTimeSeconds || 0) }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">reading time</div>
              </div>
              <div>
                <div class="text-xl font-semibold">{{ formatDuration(readingAnalysis?.speakingTimeSeconds || 0) }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">speaking time</div>
              </div>
              <div>
                <div class="text-xl font-semibold">{{ readingAnalysis?.averageSentenceLength }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">avg sentence len</div>
              </div>
              <div>
                <div class="text-xl font-semibold">{{ readingAnalysis?.averageWordLength }}</div>
                <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">avg word len</div>
              </div>
            </div>
          </div>

          <!-- AI Features Panel -->
          <AIPanel :text="text" />
          <!-- Feedback -->
<FeedbackForm :word-count="basicStats?.totalWords || 0" />

        </template>
      </section>
    </main>
  </div>
</template>