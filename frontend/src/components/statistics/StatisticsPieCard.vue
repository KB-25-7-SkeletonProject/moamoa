<template>
  <Card class="stats-card">
    <h2 class="section-title">카테고리 비율</h2>
    <div class="pie-inner">
      <svg class="chart" width="100" height="100" viewBox="0 0 100 100" aria-label="카테고리 비율 차트">
        <circle cx="50" cy="50" r="35" fill="none" :stroke="baseStroke" stroke-width="16" />
        <circle
          v-for="segment in segments"
          :key="segment.label"
          cx="50"
          cy="50"
          r="35"
          fill="none"
          :stroke="segment.color"
          stroke-width="16"
          :stroke-dasharray="segment.dashArray"
          :stroke-dashoffset="segment.dashOffset"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="47" text-anchor="middle" class="amount">{{ totalAmount }}</text>
        <text x="50" y="60" text-anchor="middle" class="caption">총 지출</text>
      </svg>

      <div class="pie-legend">
        <div v-for="item in items" :key="item.label" class="legend-item">
          <span class="legend-dot" :style="{ background: item.color }" />
          <span>{{ item.label }}</span>
          <span class="legend-pct">{{ item.percent }}%</span>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import Card from '@/components/common/Card.vue'

const props = defineProps({
  totalAmount: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
})

const baseStroke = 'var(--surface-muted)'
const circumference = 2 * Math.PI * 35

const segments = computed(() => {
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
.stats-card {
  height: 100%;
}

.section-title {
  margin: 0 0 12px;
  font-size: var(--font-size-15);
  font-weight: var(--font-weight-700);
  color: var(--text);
}

.pie-inner {
  display: flex;
  align-items: center;
  gap: 16px;
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

.legend-pct {
  margin-left: auto;
  font-weight: var(--font-weight-700);
  color: var(--text);
}

.amount {
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-700);
  fill: var(--text);
}

.caption {
  font-size: var(--font-size-12);
  fill: var(--text-muted);
}

@media (min-width: 768px) {
  .legend-item {
    font-size: var(--font-size-13);
  }
}

@media (min-width: 1280px) {
  .section-title {
    font-size: var(--font-size-16);
  }

  .legend-item {
    font-size: var(--font-size-14);
    margin-bottom: 9px;
  }
}
</style>
