<script setup lang="ts">
import { ref } from 'vue'
import api from '@/services/api'

const props = defineProps<{ wordCount: number }>()

const rating = ref(0)
const hoveredRating = ref(0)
const comment = ref('')
const submitted = ref(false)
const submitting = ref(false)
const error = ref('')

function setRating(value: number) {
  rating.value = value
}

async function submitFeedback() {
  if (rating.value === 0) {
    error.value = 'Please select a star rating before submitting.'
    return
  }

  error.value = ''
  submitting.value = true

  try {
    await api.post('/feedback', {
      rating: rating.value,
      comment: comment.value,
      wordCount: props.wordCount
    })
    submitted.value = true
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to submit feedback. Please try again.'
  } finally {
    submitting.value = false
  }
}

const labels: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very good',
  5: 'Excellent'
}
</script>

<template>
  <div class="card border-amber-500/20 bg-amber-50/20">

    <!-- Success state -->
    <div v-if="submitted" class="flex flex-col items-center justify-center py-6 text-center gap-3">
      <div class="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center text-2xl">
        ✦
      </div>
      <h4 class="font-display text-lg">Thanks for your feedback!</h4>
      <p class="text-sm text-ink-400">It helps us improve the analyzer.</p>
    </div>

    <!-- Form state -->
    <div v-else>
      <div class="flex items-center gap-2 mb-4">
        <span class="font-mono text-amber-500 text-lg">★</span>
        <h3 class="font-display text-lg">How was your analysis?</h3>
      </div>

      <!-- Star rating -->
      <div class="flex items-center gap-2 mb-2">
        <button
          v-for="star in 5"
          :key="star"
          @click="setRating(star)"
          @mouseenter="hoveredRating = star"
          @mouseleave="hoveredRating = 0"
          class="text-3xl transition-transform hover:scale-110 focus:outline-none"
        >
          <span :class="star <= (hoveredRating || rating) ? 'text-amber-500' : 'text-ink/15'">★</span>
        </button>
        <span v-if="hoveredRating || rating" class="font-mono text-sm text-ink-400 ml-1">
          {{ labels[hoveredRating || rating] }}
        </span>
      </div>

      <!-- Comment -->
      <textarea
        v-model="comment"
        placeholder="Any comments? (optional)"
        rows="3"
        class="w-full mt-3 rounded-xl border border-ink/10 p-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none"
      ></textarea>

      <p v-if="error" class="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
        {{ error }}
      </p>

      <button
        @click="submitFeedback"
        :disabled="submitting"
        class="mt-3 btn-primary !py-2.5 !px-6 text-sm disabled:opacity-50 flex items-center gap-2"
      >
        <span v-if="submitting" class="w-3 h-3 border-2 border-paper border-t-transparent rounded-full animate-spin"></span>
        {{ submitting ? 'Submitting...' : 'Submit Feedback' }}
      </button>
    </div>

  </div>
</template>