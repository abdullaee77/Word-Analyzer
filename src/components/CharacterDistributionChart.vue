<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import type { CharacterAnalysis } from '@/services/textAnalyzer'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps<{
  data: CharacterAnalysis | null
}>()

const LABELS = ['Uppercase', 'Lowercase', 'Digits', 'Spaces', 'Punctuation', 'Special']
const COLORS = ['#5B5BD6', '#7C7CE8', '#F2A93B', '#C7C7D1', '#15171C', '#2B2E37']

const total = computed(() => {
  if (!props.data) return 0
  const d = props.data
  return d.uppercase + d.lowercase + d.digits + d.spaces + d.punctuation + d.special
})

const chartData = computed(() => {
  const d = props.data
  const values = d
    ? [d.uppercase, d.lowercase, d.digits, d.spaces, d.punctuation, d.special]
    : [0, 0, 0, 0, 0, 0]

  return {
    labels: LABELS,
    datasets: [
      {
        data: values,
        backgroundColor: COLORS,
        borderWidth: 2,
        borderColor: '#F7F7F5',
        hoverOffset: 6
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        font: { family: 'Inter', size: 11 },
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 14
      }
    },
    tooltip: {
      backgroundColor: '#15171C',
      titleFont: { family: 'Inter' },
      bodyFont: { family: 'Inter' },
      padding: 10,
      cornerRadius: 8,
      callbacks: {
        label: (ctx: any) => {
          const value = ctx.parsed
          const pct = total.value ? ((value / total.value) * 100).toFixed(1) : '0'
          return `${ctx.label}: ${value} (${pct}%)`
        }
      }
    }
  }
}
</script>

<template>
  <div class="h-72">
    <Doughnut v-if="total > 0" :data="chartData" :options="chartOptions" />
    <div v-else class="h-full flex items-center justify-center text-sm text-ink-400">
      No character data yet.
    </div>
  </div>
</template>