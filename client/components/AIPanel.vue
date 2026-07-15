<script setup lang="ts">
import { useAIStore } from '@/stores/ai'
import { storeToRefs } from 'pinia'

const props = defineProps<{ text: string }>()

const store = useAIStore()
const { summary, grammar, tone, improvements, difficultWords, askAnswer, question, loading, error } = storeToRefs(store)

const features = [
  { key: 'summary', label: 'AI Summary', icon: '◈', desc: 'Concise 3-5 sentence summary' },
  { key: 'grammar', label: 'Grammar Check', icon: '✓', desc: 'Issues and how to fix them' },
  { key: 'tone', label: 'Tone Detection', icon: '◉', desc: 'Formal, casual, persuasive...' },
  { key: 'improvements', label: 'Improvements', icon: '↑', desc: 'Make your writing stronger' },
  { key: 'difficultWords', label: 'Difficult Words', icon: '◆', desc: 'Hard words explained simply' }
] as const

type Feature = typeof features[number]['key']

const resultMap: Record<Feature, any> = {
  summary,
  grammar,
  tone,
  improvements,
  difficultWords
}

function run(feature: Feature) {
  store.run(feature, props.text)
}
</script>

<template>
  <div class="space-y-5">
    <div class="card border-primary-100 bg-primary-50/30">
      <div class="flex items-center gap-3 mb-1">
        <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white text-sm">✦</div>
        <h3 class="font-display text-xl">AI Features</h3>
       
      </div>
      
    </div>

    <p v-if="error" class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{{ error }}</p>

    <!-- Feature buttons -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="f in features" :key="f.key" class="card hover:shadow-md transition-all duration-200">
        <div class="flex items-start justify-between mb-3">
          <div>
            <span class="font-mono text-lg text-primary-500">{{ f.icon }}</span>
            <h4 class="font-semibold text-sm mt-1">{{ f.label }}</h4>
            <p class="text-xs text-ink-400 mt-0.5">{{ f.desc }}</p>
          </div>
        </div>
        <button
          @click="run(f.key)"
          :disabled="loading !== null"
          class="w-full text-xs font-semibold py-2 px-4 rounded-full bg-ink text-paper hover:bg-ink-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span v-if="loading === f.key" class="w-3 h-3 border-2 border-paper border-t-transparent rounded-full animate-spin"></span>
          {{ loading === f.key ? 'Running...' : 'Run' }}
        </button>

        <div
          v-if="resultMap[f.key as Feature]?.value"
          class="mt-3 text-xs leading-relaxed text-ink-400 bg-ink/[0.02] rounded-xl p-3 whitespace-pre-wrap border border-ink/[0.04]"
        >
          {{ resultMap[f.key as Feature].value }}
        </div>
      </div>
    </div>

    <!-- Ask AI -->
    <div class="card">
      <div class="flex items-center gap-2 mb-4">
        <span class="font-mono text-lg text-primary-500">?</span>
        <h4 class="font-semibold">Ask AI about your text</h4>
      </div>
      <div class="flex gap-3">
        <input
          v-model="question"
          type="text"
          placeholder="e.g. What is the main argument? Who is the audience?"
          class="flex-1 rounded-xl border border-ink/10 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
          @keydown.enter="store.run('ask', text)"
        />
        <button
          @click="store.run('ask', text)"
          :disabled="loading !== null"
          class="btn-primary !py-2.5 !px-5 text-sm disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
        >
          <span v-if="loading === 'ask'" class="w-3 h-3 border-2 border-paper border-t-transparent rounded-full animate-spin"></span>
          {{ loading === 'ask' ? 'Asking...' : 'Ask' }}
        </button>
      </div>
      <div
        v-if="askAnswer"
        class="mt-4 text-sm leading-relaxed text-ink bg-ink/[0.02] rounded-xl p-4 whitespace-pre-wrap border border-ink/[0.04]"
      >
        {{ askAnswer }}
      </div>
    </div>
  </div>
</template>