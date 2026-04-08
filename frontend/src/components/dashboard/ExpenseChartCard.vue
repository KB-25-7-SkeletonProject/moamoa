<template>
  <div class="pie-card">
    <div class="pie-inner">
      <svg class="chart" width="110" height="110" viewBox="0 0 110 110" aria-label="지출 비율 차트">
        <circle
          v-for="segment in chartSegments"
          :key="segment.label"
          cx="55"
          cy="55"
          r="40"
          fill="none"
          :stroke="segment.color"
          stroke-width="18"
          :stroke-dasharray="segment.dashArray"
          :stroke-dashoffset="segment.dashOffset"
          transform="rotate(-90 55 55)"
        />
        <text x="55" y="52" text-anchor="middle" class="chart-title">지출</text>
        <text x="55" y="65" text-anchor="middle" class="chart-subtitle">비율</text>
      </svg>

      <div class="pie-legend">
        <div v-for="item in items" :key="item.label" class="legend-item">
          <span class="legend-dot" :style="{ background: item.color }" />
          {{ item.label }} {{ item.percent }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const circumference = 2 * Math.PI * 40

const chartSegments = computed(() => {
  let offset = 0

  return props.items.map((item) => {
    const arc = (item.percent / 100) * circumference
    const segment = {
      label: item.label,
      color: item.color,
      dashArray: `${arc} ${circumference - arc}`,
      dashOffset: -offset,
    }
    offset += arc
    return segment
  })
})
</script>

<style scoped>
.pie-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-card-sm);
}

.pie-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}

.chart {
  flex-shrink: 0;
}

.chart-title {
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-700);
  fill: var(--text);
}

.chart-subtitle {
  font-size: var(--font-size-12);
  fill: var(--text-muted);
}

.pie-legend {
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 7px;
  font-size: var(--font-size-12);
  color: var(--text-muted);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .legend-item {
    font-size: var(--font-size-12);
  }
}

@media (min-width: 1280px) {
  .legend-item {
    font-size: var(--font-size-13);
    margin-bottom: 9px;
  }
}
</style>
