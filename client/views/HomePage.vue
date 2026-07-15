<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

interface Feature {
  tag: string
  title: string
  desc: string
}

const features: Feature[] = [
  { tag: 'Aa', title: 'Character breakdown', desc: 'Uppercase, lowercase, digits, punctuation — every character sorted and counted.' },
  { tag: '¶', title: 'Word & sentence stats', desc: 'Lengths, frequency, repetition, and structure across words, sentences, and paragraphs.' },
  { tag: '#', title: 'Keyword extraction', desc: 'Stop words stripped away to surface the terms that actually carry meaning.' },
  { tag: '⏱', title: 'Reading & speaking time', desc: 'Know how long your text takes to read aloud or skim silently.' },
  { tag: '⌕', title: 'Word search & highlight', desc: 'Find every occurrence of a word instantly, highlighted in context.' },
  { tag: '⇩', title: 'Upload & export', desc: 'Drop in a .txt or .docx file, then export your full report as a PDF.' }
]

interface AnnotatedWord {
  text: string
  note: string | null
  color?: 'amber' | 'primary'
}

const annotatedWords: AnnotatedWord[] = [
  { text: 'Every', note: null },
  { text: 'word', note: '6 letters', color: 'amber' },
  { text: 'you', note: null },
  { text: 'write', note: null },
  { text: 'carries', note: 'longest word', color: 'primary' },
  { text: 'a', note: null },
  { text: 'shape,', note: '7 chars', color: 'amber' },
  { text: 'a', note: null },
  { text: 'rhythm,', note: 'repeated 2×', color: 'primary' },
  { text: 'a', note: null },
  { text: 'meaning.', note: 'keyword', color: 'amber' }
]

function goToAnalyzer() {
  router.push('/analyze')
}
</script>

<template>
  <div class="min-h-screen bg-paper text-ink overflow-x-hidden">
    <header class="max-w-6xl mx-auto px-6 md:px-10 py-7 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
          <span class="text-paper font-display italic text-base leading-none">AB</span>
        </div>
        <span class="font-display text-lg tracking-tight">Word Analyzer</span>
      </div>
      <button @click="goToAnalyzer" class="hidden sm:inline-flex text-sm font-medium text-ink-400 hover:text-ink transition-colors">
        Open analyzer →
      </button>
    </header>

    <section class="max-w-6xl mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-24 grid md:grid-cols-2 gap-14 items-center">
      <div class="animate-slide-up">
        <span class="inline-block font-mono text-xs tracking-widest uppercase text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-6">
          Phase 1 — Core Analyzer
        </span>
        <h1 class="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6">
          Read your text
          <span class="italic text-primary-600">the way</span>
          a linguist would.
        </h1>
        <p class="text-ink-400 text-lg leading-relaxed mb-9 max-w-md">
          Paste or upload anything — an essay, an email, a manuscript — and get a full
          statistical and structural breakdown in seconds.
        </p>
        <div class="flex flex-wrap items-center gap-4">
          <button @click="goToAnalyzer" class="btn-primary">Start Analyzing</button>
          <button @click="goToAnalyzer" class="btn-secondary">See it in action</button>
        </div>
      </div>

      <div class="relative animate-fade-in" style="animation-delay: 0.15s">
        <div class="card !p-8 md:!p-10 relative">
          <p class="font-mono text-xs text-ink-400 mb-6 tracking-wide">SAMPLE INPUT — auto-annotated</p>
          <p class="font-display text-2xl md:text-[1.7rem] leading-[1.7] flex flex-wrap gap-x-2 gap-y-7 pt-2">
            <span v-for="(w, i) in annotatedWords" :key="i" class="relative inline-block group">
              <span :class="[w.note ? 'border-b-2' : '', w.color === 'amber' ? 'border-amber-500' : w.color === 'primary' ? 'border-primary-500' : '']">{{ w.text }}</span>
              <span v-if="w.note" :class="['absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[0.65rem] px-2 py-0.5 rounded-full opacity-90', w.color === 'amber' ? 'bg-amber-500/15 text-amber-600' : 'bg-primary-500/15 text-primary-600']">{{ w.note }}</span>
            </span>
          </p>

          <div class="mt-8 pt-6 border-t border-ink/[0.06] grid grid-cols-3 gap-4 font-mono">
            <div>
              <div class="text-2xl font-semibold">11</div>
              <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">words</div>
            </div>
            <div>
              <div class="text-2xl font-semibold">1</div>
              <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">sentence</div>
            </div>
            <div>
              <div class="text-2xl font-semibold">7s</div>
              <div class="text-[0.65rem] uppercase tracking-wide text-ink-400">read time</div>
            </div>
          </div>
        </div>

        <div class="absolute -bottom-5 -right-5 hidden md:flex items-center gap-2 bg-ink text-paper px-4 py-2.5 rounded-full shadow-xl animate-float">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span class="font-mono text-xs">Analysis updates live</span>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-6 md:px-10 pb-28">
      <div class="mb-12">
        <h2 class="font-display text-3xl md:text-4xl tracking-tight mb-3">What it breaks down</h2>
        <p class="text-ink-400 max-w-lg">Six lenses on the same text, all generated from a single analysis pass.</p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="(f, i) in features" :key="f.title" class="card hover:-translate-y-1 hover:shadow-md transition-all duration-200 animate-slide-up" :style="{ animationDelay: `${i * 0.06}s` }">
          <div class="w-10 h-10 rounded-lg bg-ink/[0.04] flex items-center justify-center font-display italic text-lg mb-5">{{ f.tag }}</div>
          <h3 class="font-semibold text-base mb-2">{{ f.title }}</h3>
          <p class="text-sm text-ink-400 leading-relaxed">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-6 md:px-10 pb-24">
      <div class="bg-ink text-paper rounded-3xl px-8 md:px-14 py-14 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <h2 class="font-display text-3xl md:text-4xl tracking-tight mb-3">Paste your first text.</h2>
          <p class="text-paper/60 max-w-sm">No sign-up, no setup. The analyzer is ready the moment you are.</p>
        </div>
        <button @click="goToAnalyzer" class="bg-paper text-ink font-semibold py-3.5 px-8 rounded-full hover:-translate-y-0.5 transition-transform shadow-xl whitespace-nowrap">
          Start Analyzing →
        </button>
      </div>
    </section>

    <footer class="max-w-6xl mx-auto px-6 md:px-10 pb-10 text-xs text-ink-400 font-mono">
      Advanced Word Analyzer — Phase 1
    </footer>
  </div>
</template>