<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import type { WordFrequency } from '@/services/textAnalyzer'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  words: WordFrequency[]
}>()

const chartData = computed(() => ({
  labels: props.words.map(w => w.word),
  datasets: [
    {
      label: 'Occurrences',
      data: props.words.map(w => w.count),
      backgroundColor: '#5B5BD6',
      borderRadius: 6,
      barThickness: 22
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#15171C',
      titleFont: { family: 'Inter' },
      bodyFont: { family: 'Inter' },
      padding: 10,
      cornerRadius: 8
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: { precision: 0, font: { family: 'Inter', size: 11 } },
      grid: { color: '#15171C0F' }
    },
    y: {
      ticks: { font: { family: 'Inter', size: 12 } },
      grid: { display: false }
    }
  }
}
</script>

<template>
  <div class="h-72">
    <Bar v-if="words.length" :data="chartData" :options="chartOptions" />
    <div v-else class="h-full flex items-center justify-center text-sm text-ink-400">
      No word frequency data yet.
    </div>
  </div>
</template>